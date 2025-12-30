const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const Job = require('../models/job');
const Application = require('../models/application');
const Admin = require('../models/admin');
const Transaction = require('../models/transaction');
const Wallet = require('../models/wallet');
const auth = require('../middleware/auth');

const router = express.Router();

const ensureAdmin = (req, res, next) => {
	if (req.user.role !== 'admin') {
		return res.status(403).json({ msg: 'Admin access required.' });
	}
	next();
};

router.use(auth);
router.use(ensureAdmin);

router.get('/metrics', async (req, res) => {
	try {
		const [users, jobs, applications] = await Promise.all([
			User.countDocuments(),
			Job.countDocuments(),
			Application.countDocuments()
		]);
		res.json({ users, jobs, applications });
	} catch (err) {
		console.error('Admin metrics error:', err.message);
		res.status(500).json({ msg: 'Failed to load metrics.' });
	}
});

router.get('/users', async (req, res) => {	
	const { role } = req.query;
	const filter = role ? { role } : {};
	try {
		const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
		res.json({ users });
	} catch (err) {
		console.error('Admin users error:', err.message);
		res.status(500).json({ msg: 'Failed to load users.' });
	}
});

router.patch('/users/:userId', async (req, res) => {
	const { role, profile, name } = req.body;
	if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
		return res.status(400).json({ msg: 'Invalid user id.' });
	}
	try {
		const updates = {};
		if (role && ['student', 'client', 'admin'].includes(role)) {
			updates.role = role;
		}
		if (name) {
			updates.name = name;
		}
		if (profile) {
			updates.profile = profile;
		}
		const user = await User.findByIdAndUpdate(req.params.userId, updates, { new: true }).select('-password');
		if (!user) {
			return res.status(404).json({ msg: 'User not found.' });
		}
		res.json({ user });
	} catch (err) {
		console.error('Admin user update error:', err.message);
		res.status(500).json({ msg: 'Failed to update user.' });
	}
});

router.delete('/users/:userId', async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
		return res.status(400).json({ msg: 'Invalid user id.' });
	}
	try {
		await User.findByIdAndDelete(req.params.userId);
		res.json({ msg: 'User deleted.' });
	} catch (err) {
		console.error('Admin user delete error:', err.message);
		res.status(500).json({ msg: 'Failed to delete user.' });
	}
});

router.get('/admins', async (req, res) => {
	try {
		const admins = await Admin.find().populate('user', '-password');
		res.json({ admins });
	} catch (err) {
		console.error('Admin list error:', err.message);
		res.status(500).json({ msg: 'Failed to load admin data.' });
	}
});

router.patch('/admins/:adminId', async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.adminId)) {
		return res.status(400).json({ msg: 'Invalid admin id.' });
	}
	try {
		const admin = await Admin.findByIdAndUpdate(req.params.adminId, req.body, { new: true }).populate(
			'user',
			'-password'
		);
		if (!admin) {
			return res.status(404).json({ msg: 'Admin record not found.' });
		}
		res.json({ admin });
	} catch (err) {
		console.error('Admin update error:', err.message);
		res.status(500).json({ msg: 'Failed to update admin.' });
	}
});

router.delete('/admins/:adminId', async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.adminId)) {
		return res.status(400).json({ msg: 'Invalid admin id.' });
	}
	try {
		const admin = await Admin.findById(req.params.adminId);
		if (!admin) {
			return res.status(404).json({ msg: 'Admin record not found.' });
		}
		await Admin.findByIdAndDelete(req.params.adminId);
		await User.findByIdAndDelete(admin.user);
		res.json({ msg: 'Admin account deleted.' });
	} catch (err) {
		console.error('Admin delete error:', err.message);
		res.status(500).json({ msg: 'Failed to delete admin.' });
	}
});

router.get('/jobs', async (req, res) => {
	try {
		const jobs = await Job.find().sort({ createdAt: -1 }).populate('recruiter', 'name email');
		const totalApplications = await Application.countDocuments();
		res.json({ jobs, totalApplications });
	} catch (err) {
		console.error('Admin jobs error:', err.message);
		res.status(500).json({ msg: 'Failed to load jobs.' });
	}
});

router.delete('/jobs/:jobId', async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.jobId)) {
		return res.status(400).json({ msg: 'Invalid job id.' });
	}
	try {
		await Job.findByIdAndDelete(req.params.jobId);
		await Application.deleteMany({ job: req.params.jobId });
		res.json({ msg: 'Job deleted.' });
	} catch (err) {
		console.error('Admin job delete error:', err.message);
		res.status(500).json({ msg: 'Failed to delete job.' });
	}
});

// @route   GET /api/admin/withdrawals
// @desc    Get all pending withdrawal requests
// @access  Admin
router.get('/withdrawals', async (req, res) => {
	try {
		const { status = 'pending' } = req.query;
		
		const withdrawals = await Transaction.find({ 
			type: 'withdrawal',
			...(status && { status })
		})
			.populate('user', 'name email')
			.populate('wallet')
			.sort({ createdAt: -1 });
		
		res.json({ withdrawals });
	} catch (err) {
		console.error('Admin withdrawals error:', err.message);
		res.status(500).json({ msg: 'Failed to load withdrawals.' });
	}
});

// @route   POST /api/admin/withdrawals/:withdrawalId/approve
// @desc    Approve a withdrawal request
// @access  Admin
router.post('/withdrawals/:withdrawalId/approve', async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.withdrawalId)) {
		return res.status(400).json({ msg: 'Invalid withdrawal id.' });
	}
	
	try {
		const withdrawal = await Transaction.findById(req.params.withdrawalId);
		
		if (!withdrawal) {
			return res.status(404).json({ msg: 'Withdrawal not found.' });
		}
		
		if (withdrawal.type !== 'withdrawal') {
			return res.status(400).json({ msg: 'This is not a withdrawal transaction.' });
		}
		
		if (withdrawal.status !== 'pending') {
			return res.status(400).json({ msg: `Withdrawal is already ${withdrawal.status}.` });
		}
		
		// Update transaction status
		withdrawal.status = 'completed';
		withdrawal.processedAt = new Date();
		withdrawal.processedBy = req.user.id || req.user._id;
		await withdrawal.save();
		
		// Update wallet to reflect the withdrawal (reduce balance)
		const wallet = await Wallet.findById(withdrawal.wallet);
		if (wallet) {
			wallet.balance = parseFloat((wallet.balance - withdrawal.amount).toFixed(2));
			await wallet.save();
		}
		
		res.json({ 
			msg: 'Withdrawal approved successfully.',
			withdrawal 
		});
	} catch (err) {
		console.error('Admin approve withdrawal error:', err.message);
		res.status(500).json({ msg: 'Failed to approve withdrawal.' });
	}
});

// @route   POST /api/admin/withdrawals/:withdrawalId/reject
// @desc    Reject a withdrawal request
// @access  Admin
router.post('/withdrawals/:withdrawalId/reject', async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.withdrawalId)) {
		return res.status(400).json({ msg: 'Invalid withdrawal id.' });
	}
	
	try {
		const { reason } = req.body;
		const withdrawal = await Transaction.findById(req.params.withdrawalId);
		
		if (!withdrawal) {
			return res.status(404).json({ msg: 'Withdrawal not found.' });
		}
		
		if (withdrawal.type !== 'withdrawal') {
			return res.status(400).json({ msg: 'This is not a withdrawal transaction.' });
		}
		
		if (withdrawal.status !== 'pending') {
			return res.status(400).json({ msg: `Withdrawal is already ${withdrawal.status}.` });
		}
		
		// Return funds to available balance
		const wallet = await Wallet.findById(withdrawal.wallet);
		if (wallet) {
			wallet.availableBalance = parseFloat((wallet.availableBalance + withdrawal.amount).toFixed(2));
			wallet.totalWithdrawn = parseFloat((wallet.totalWithdrawn - withdrawal.amount).toFixed(2));
			await wallet.save();
		}
		
		// Update transaction status
		withdrawal.status = 'failed';
		withdrawal.processedAt = new Date();
		withdrawal.processedBy = req.user.id || req.user._id;
		withdrawal.description = `${withdrawal.description} - Rejected: ${reason || 'No reason provided'}`;
		await withdrawal.save();
		
		res.json({ 
			msg: 'Withdrawal rejected successfully.',
			withdrawal 
		});
	} catch (err) {
		console.error('Admin reject withdrawal error:', err.message);
		res.status(500).json({ msg: 'Failed to reject withdrawal.' });
	}
});

// @route   GET /api/admin/payments/pending
// @desc    Get all pending payment approvals
// @access  Admin
router.get('/payments/pending', async (req, res) => {
	try {
		const applications = await Application.find({
			'payment.status': 'pending_approval'
		})
			.populate('student', 'name email profile')
			.populate({
				path: 'job',
				select: 'title paymentAmount currency recruiter',
				populate: {
					path: 'recruiter',
					select: 'name email'
				}
			})
			.populate('payment.escrowTransaction')
			.sort({ 'projectSubmission.submittedAt': -1 });
		
		res.json({ applications });
	} catch (err) {
		console.error('Admin pending payments error:', err.message);
		res.status(500).json({ msg: 'Failed to load pending payments.' });
	}
});

// @route   POST /api/admin/payments/:applicationId/approve
// @desc    Approve payment release to student
// @access  Admin
router.post('/payments/:applicationId/approve', async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.applicationId)) {
		return res.status(400).json({ msg: 'Invalid application id.' });
	}
	
	try {
		const application = await Application.findById(req.params.applicationId)
			.populate('student')
			.populate({
				path: 'job',
				populate: { path: 'recruiter' }
			});
		
		if (!application) {
			return res.status(404).json({ msg: 'Application not found.' });
		}
		
		if (!application.payment || application.payment.status !== 'pending_approval') {
			return res.status(400).json({ msg: 'Payment is not pending approval.' });
		}
		
		const paymentAmount = application.payment.amount;
		const clientWallet = await Wallet.findOne({ user: application.job.recruiter._id });
		const studentWallet = await Wallet.findOne({ user: application.student._id });
		
		if (!clientWallet) {
			return res.status(404).json({ msg: 'Client wallet not found.' });
		}
		
		if (!studentWallet) {
			// Create wallet for student if doesn't exist
			studentWallet = await Wallet.create({
				user: application.student._id,
				currency: clientWallet.currency
			});
		}
		
		// Release payment from escrow to student
		await clientWallet.releaseEscrow(
			paymentAmount,
			studentWallet,
			`Payment for job: ${application.job.title}`
		);
		
		// Find the release transaction
		const releaseTransaction = await Transaction.findOne({
			wallet: clientWallet._id,
			type: 'escrow_release',
			amount: paymentAmount
		}).sort({ createdAt: -1 });
		
		// Update application payment status
		application.payment.status = 'released';
		application.payment.releaseTransaction = releaseTransaction?._id;
		application.payment.approvedBy = req.user.id || req.user._id;
		application.payment.approvedAt = new Date();
		await application.save();
		
		// Update escrow transaction status
		if (application.payment.escrowTransaction) {
			const escrowTrans = await Transaction.findById(application.payment.escrowTransaction);
			if (escrowTrans) {
				escrowTrans.status = 'completed';
				await escrowTrans.save();
			}
		}
		
		// Send notifications
		const notificationService = req.app.get('notificationService');
		if (notificationService) {
			await notificationService.notifyPaymentReleased(application, application.job, application.student);
		}
		
		res.json({ 
			msg: 'Payment approved and released to student successfully.',
			application 
		});
	} catch (err) {
		console.error('Admin approve payment error:', err.message);
		res.status(500).json({ msg: err.message || 'Failed to approve payment.' });
	}
});

// @route   POST /api/admin/payments/:applicationId/reject
// @desc    Reject payment release and return funds to client
// @access  Admin
router.post('/payments/:applicationId/reject', async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.applicationId)) {
		return res.status(400).json({ msg: 'Invalid application id.' });
	}
	
	try {
		const { reason } = req.body;
		const application = await Application.findById(req.params.applicationId)
			.populate('student')
			.populate({
				path: 'job',
				populate: { path: 'recruiter' }
			});
		
		if (!application) {
			return res.status(404).json({ msg: 'Application not found.' });
		}
		
		if (!application.payment || application.payment.status !== 'pending_approval') {
			return res.status(400).json({ msg: 'Payment is not pending approval.' });
		}
		
		const paymentAmount = application.payment.amount;
		const clientWallet = await Wallet.findOne({ user: application.job.recruiter._id });
		
		if (!clientWallet) {
			return res.status(404).json({ msg: 'Client wallet not found.' });
		}
		
		// Return funds from escrow to client's available balance
		clientWallet.escrowBalance = parseFloat((clientWallet.escrowBalance - paymentAmount).toFixed(2));
		clientWallet.availableBalance = parseFloat((clientWallet.availableBalance + paymentAmount).toFixed(2));
		await clientWallet.save();
		
		// Update application payment status
		application.payment.status = 'rejected';
		application.payment.approvedBy = req.user.id || req.user._id;
		application.payment.approvedAt = new Date();
		application.payment.rejectionReason = reason || 'Payment rejected by admin';
		await application.save();
		
		// Update escrow transaction status
		if (application.payment.escrowTransaction) {
			const escrowTrans = await Transaction.findById(application.payment.escrowTransaction);
			if (escrowTrans) {
				escrowTrans.status = 'cancelled';
				escrowTrans.notes = `Rejected by admin: ${reason || 'No reason provided'}`;
				await escrowTrans.save();
			}
		}
		
		// Create refund transaction
		await Transaction.create({
			wallet: clientWallet._id,
			user: clientWallet.user,
			type: 'refund',
			amount: paymentAmount,
			currency: clientWallet.currency,
			description: `Refund for job: ${application.job.title}`,
			relatedJob: application.job._id,
			relatedApplication: application._id,
			status: 'completed',
			notes: reason || 'Payment rejected by admin'
		});
		
		res.json({ 
			msg: 'Payment rejected and funds returned to client successfully.',
			application 
		});
	} catch (err) {
		console.error('Admin reject payment error:', err.message);
		res.status(500).json({ msg: err.message || 'Failed to reject payment.' });
	}
});

module.exports = router;
