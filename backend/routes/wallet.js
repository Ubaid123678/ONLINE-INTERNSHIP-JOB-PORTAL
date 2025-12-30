const express = require('express');
const router = express.Router();
const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');
const auth = require('../middleware/auth');

// Helper function to get user ID from request
const getUserId = (req) => req.user._id || req.user.id;

// @route   GET /api/wallet
// @desc    Get user's wallet
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('Wallet route - req.user:', req.user);
    const userId = req.user._id || req.user.id;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }
    
    let wallet = await Wallet.findOne({ user: userId });
    
    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await Wallet.create({
        user: userId,
        currency: 'USD'
      });
    }
    
    res.json({ wallet });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ message: 'Server error while fetching wallet' });
  }
});

// @route   GET /api/wallet/transactions
// @desc    Get user's transaction history
// @access  Private
router.get('/transactions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    const userId = getUserId(req);
    
    const query = { user: userId };
    if (type) query.type = type;
    if (status) query.status = status;
    
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('relatedJob', 'title')
      .populate('relatedApplication', 'status');
    
    const total = await Transaction.countDocuments(query);
    
    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error while fetching transactions' });
  }
});

// @route   POST /api/wallet/add-funds
// @desc    Add funds to wallet (for testing/admin)
// @access  Private
router.post('/add-funds', auth, async (req, res) => {
  try {
    const { amount, description } = req.body;
    
    console.log('Add funds request - raw amount:', amount, 'type:', typeof amount);
    
    // Convert amount to number and validate
    const numAmount = parseFloat(amount);
    
    console.log('Add funds request - parsed amount:', numAmount, 'type:', typeof numAmount);
    
    if (!numAmount || numAmount <= 0 || isNaN(numAmount)) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    const userId = getUserId(req);
    let wallet = await Wallet.findOne({ user: userId });
    
    console.log('Wallet before adding funds:', {
      balance: wallet?.balance,
      availableBalance: wallet?.availableBalance,
      totalEarned: wallet?.totalEarned
    });
    
    if (!wallet) {
      wallet = await Wallet.create({
        user: userId,
        currency: 'USD'
      });
    }
    
    await wallet.addFunds(numAmount, description || 'Funds added to wallet');
    
    console.log('Wallet after adding funds:', {
      balance: wallet.balance,
      availableBalance: wallet.availableBalance,
      totalEarned: wallet.totalEarned
    });
    
    res.json({ 
      message: 'Funds added successfully',
      wallet 
    });
  } catch (error) {
    console.error('Add funds error:', error);
    res.status(500).json({ message: error.message || 'Server error while adding funds' });
  }
});

// @route   POST /api/wallet/withdraw
// @desc    Request withdrawal
// @access  Private
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, withdrawalMethod, accountDetails } = req.body;
    
    // Convert amount to number and validate
    const numAmount = parseFloat(amount);
    
    if (!numAmount || numAmount <= 0 || isNaN(numAmount)) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    if (!withdrawalMethod || !accountDetails) {
      return res.status(400).json({ message: 'Withdrawal method and account details are required' });
    }
    
    const userId = getUserId(req);
    const wallet = await Wallet.findOne({ user: userId });
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    
    if (!wallet.hasSufficientBalance(numAmount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    await wallet.withdraw(numAmount, withdrawalMethod, accountDetails);
    
    res.json({ 
      message: 'Withdrawal request submitted successfully. It will be processed within 3-5 business days.',
      wallet 
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ message: error.message || 'Server error while processing withdrawal' });
  }
});

// @route   POST /api/wallet/payment/:jobId
// @desc    Make payment for a job (Client pays, funds go to escrow)
// @access  Private
router.post('/payment/:jobId', auth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { amount, applicationId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    const userId = getUserId(req);
    const wallet = await Wallet.findOne({ user: userId });
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    
    if (!wallet.hasSufficientBalance(amount)) {
      return res.status(400).json({ message: 'Insufficient balance. Please add funds to your wallet.' });
    }
    
    // Move funds to escrow
    await wallet.moveToEscrow(amount, `Payment for job ${jobId}`);
    
    // Update the transaction with job details
    const transaction = await Transaction.findOne({
      wallet: wallet._id,
      type: 'escrow_hold',
      amount: amount
    }).sort({ createdAt: -1 });
    
    if (transaction) {
      transaction.relatedJob = jobId;
      if (applicationId) transaction.relatedApplication = applicationId;
      await transaction.save();
    }
    
    res.json({ 
      message: 'Payment held in escrow successfully',
      wallet 
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: error.message || 'Server error while processing payment' });
  }
});

// @route   POST /api/wallet/release-payment
// @desc    Release payment from escrow (Admin or automated)
// @access  Private
router.post('/release-payment', auth, async (req, res) => {
  try {
    const { transactionId, recipientId } = req.body;
    
    const transaction = await Transaction.findById(transactionId)
      .populate('wallet');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    const clientWallet = transaction.wallet;
    const recipientWallet = await Wallet.findOne({ user: recipientId });
    
    if (!recipientWallet) {
      return res.status(404).json({ message: 'Recipient wallet not found' });
    }
    
    await clientWallet.releaseEscrow(
      transaction.amount, 
      recipientWallet, 
      `Payment for ${transaction.description}`
    );
    
    transaction.status = 'completed';
    await transaction.save();
    
    res.json({ 
      message: 'Payment released successfully',
      clientWallet,
      recipientWallet
    });
  } catch (error) {
    console.error('Release payment error:', error);
    res.status(500).json({ message: error.message || 'Server error while releasing payment' });
  }
});

// @route   GET /api/wallet/stats
// @desc    Get wallet statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const wallet = await Wallet.findOne({ user: userId });
    
    if (!wallet) {
      return res.json({
        totalEarned: 0,
        totalSpent: 0,
        totalWithdrawn: 0,
        pendingWithdrawals: 0,
        escrowBalance: 0
      });
    }
    
    const pendingWithdrawals = await Transaction.countDocuments({
      user: userId,
      type: 'withdrawal',
      status: 'pending'
    });
    
    res.json({
      totalEarned: wallet.totalEarned,
      totalSpent: wallet.totalSpent,
      totalWithdrawn: wallet.totalWithdrawn,
      pendingWithdrawals,
      escrowBalance: wallet.escrowBalance
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

module.exports = router;
