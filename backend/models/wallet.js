const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'PKR', 'EUR', 'GBP']
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  totalWithdrawn: {
    type: Number,
    default: 0
  },
  escrowBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  availableBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'frozen'],
    default: 'active'
  }
}, { timestamps: true });

// Virtual for display balance
WalletSchema.virtual('displayBalance').get(function() {
  return `${this.currency} ${this.balance.toFixed(2)}`;
});

// Method to check if sufficient balance
WalletSchema.methods.hasSufficientBalance = function(amount) {
  return this.availableBalance >= amount;
};

// Method to add funds
WalletSchema.methods.addFunds = async function(amount, description = 'Funds added') {
  const Transaction = mongoose.model('Transaction');
  
  // Ensure amount is a number
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Invalid amount');
  }
  
  console.log('addFunds method - before:', {
    balance: this.balance,
    availableBalance: this.availableBalance,
    totalEarned: this.totalEarned,
    amountToAdd: numAmount
  });
  
  this.balance = parseFloat((this.balance + numAmount).toFixed(2));
  this.availableBalance = parseFloat((this.availableBalance + numAmount).toFixed(2));
  this.totalEarned = parseFloat((this.totalEarned + numAmount).toFixed(2));
  
  console.log('addFunds method - after calculation:', {
    balance: this.balance,
    availableBalance: this.availableBalance,
    totalEarned: this.totalEarned
  });
  
  await this.save();
  
  console.log('addFunds method - after save:', {
    balance: this.balance,
    availableBalance: this.availableBalance,
    totalEarned: this.totalEarned
  });
  
  // Create transaction record
  await Transaction.create({
    wallet: this._id,
    user: this.user,
    type: 'credit',
    amount: numAmount,
    currency: this.currency,
    description: description,
    status: 'completed'
  });
  
  return this;
};

// Method to deduct funds
WalletSchema.methods.deductFunds = async function(amount, description = 'Payment made') {
  const Transaction = mongoose.model('Transaction');
  
  // Ensure amount is a number
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Invalid amount');
  }
  
  if (!this.hasSufficientBalance(numAmount)) {
    throw new Error('Insufficient balance');
  }
  
  this.balance = parseFloat((this.balance - numAmount).toFixed(2));
  this.availableBalance = parseFloat((this.availableBalance - numAmount).toFixed(2));
  this.totalSpent = parseFloat((this.totalSpent + numAmount).toFixed(2));
  
  await this.save();
  
  // Create transaction record
  await Transaction.create({
    wallet: this._id,
    user: this.user,
    type: 'debit',
    amount: numAmount,
    currency: this.currency,
    description: description,
    status: 'completed'
  });
  
  return this;
};

// Method to move funds to escrow
WalletSchema.methods.moveToEscrow = async function(amount, description = 'Payment held in escrow') {
  const Transaction = mongoose.model('Transaction');
  
  // Ensure amount is a number
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Invalid amount');
  }
  
  if (!this.hasSufficientBalance(numAmount)) {
    throw new Error('Insufficient balance');
  }
  
  this.availableBalance = parseFloat((this.availableBalance - numAmount).toFixed(2));
  this.escrowBalance = parseFloat((this.escrowBalance + numAmount).toFixed(2));
  
  await this.save();
  
  // Create transaction record
  await Transaction.create({
    wallet: this._id,
    user: this.user,
    type: 'escrow_hold',
    amount: numAmount,
    currency: this.currency,
    description: description,
    status: 'pending'
  });
  
  return this;
};

// Method to release escrow funds (for payment completion)
WalletSchema.methods.releaseEscrow = async function(amount, recipientWallet, description = 'Payment released from escrow') {
  const Transaction = mongoose.model('Transaction');
  
  // Ensure amount is a number
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Invalid amount');
  }
  
  if (this.escrowBalance < numAmount) {
    throw new Error('Insufficient escrow balance');
  }
  
  this.escrowBalance = parseFloat((this.escrowBalance - numAmount).toFixed(2));
  this.balance = parseFloat((this.balance - numAmount).toFixed(2));
  this.totalSpent = parseFloat((this.totalSpent + numAmount).toFixed(2));
  
  await this.save();
  
  // Add funds to recipient
  if (recipientWallet) {
    await recipientWallet.addFunds(numAmount, description);
  }
  
  // Update transaction record
  await Transaction.create({
    wallet: this._id,
    user: this.user,
    type: 'escrow_release',
    amount: numAmount,
    currency: this.currency,
    description: description,
    status: 'completed'
  });
  
  return this;
};

// Method to withdraw funds
WalletSchema.methods.withdraw = async function(amount, withdrawalMethod, accountDetails) {
  const Transaction = mongoose.model('Transaction');
  
  // Ensure amount is a number
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Invalid amount');
  }
  
  if (!this.hasSufficientBalance(numAmount)) {
    throw new Error('Insufficient balance');
  }
  
  this.availableBalance = parseFloat((this.availableBalance - numAmount).toFixed(2));
  this.totalWithdrawn = parseFloat((this.totalWithdrawn + numAmount).toFixed(2));
  
  await this.save();
  
  // Create withdrawal transaction
  await Transaction.create({
    wallet: this._id,
    user: this.user,
    type: 'withdrawal',
    amount: numAmount,
    currency: this.currency,
    description: `Withdrawal via ${withdrawalMethod}`,
    withdrawalMethod: withdrawalMethod,
    accountDetails: accountDetails,
    status: 'pending'
  });
  
  return this;
};

module.exports = mongoose.model('Wallet', WalletSchema);
