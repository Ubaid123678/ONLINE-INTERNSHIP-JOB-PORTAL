# Wallet System Documentation

## Overview
A comprehensive wallet system has been implemented for both clients and students to manage their finances within the platform. The system includes balance tracking, transaction history, escrow functionality, and withdrawal management.

## Features

### 1. **Wallet Management**
- Each user (client or student) has their own wallet
- Multi-currency support (USD, PKR, EUR, GBP)
- Real-time balance tracking
- Separate available and escrow balances

### 2. **Transaction Types**
- **Credit**: Funds added to wallet
- **Debit**: Funds removed from wallet
- **Escrow Hold**: Funds held for pending work
- **Escrow Release**: Funds released to freelancer upon completion
- **Withdrawal**: Request to withdraw funds
- **Refund**: Money returned to wallet
- **Payment**: Payment made for services
- **Earning**: Money earned from completed work

### 3. **Balance Types**
- **Total Balance**: Overall wallet balance
- **Available Balance**: Funds available for use or withdrawal
- **Escrow Balance**: Funds held for ongoing projects

### 4. **Statistics Tracking**
- Total earned
- Total spent
- Total withdrawn
- Pending withdrawals count

## Backend Implementation

### Models

#### Wallet Model (`backend/models/wallet.js`)
```javascript
{
  user: ObjectId (ref: User)
  balance: Number
  currency: String (USD, PKR, EUR, GBP)
  totalEarned: Number
  totalSpent: Number
  totalWithdrawn: Number
  escrowBalance: Number
  availableBalance: Number
  status: String (active, suspended, frozen)
}
```

**Methods:**
- `hasSufficientBalance(amount)` - Check if wallet has enough funds
- `addFunds(amount, description)` - Add funds to wallet
- `deductFunds(amount, description)` - Remove funds from wallet
- `moveToEscrow(amount, description)` - Move funds to escrow
- `releaseEscrow(amount, recipientWallet, description)` - Release escrow funds
- `withdraw(amount, method, accountDetails)` - Request withdrawal

#### Transaction Model (`backend/models/transaction.js`)
```javascript
{
  wallet: ObjectId (ref: Wallet)
  user: ObjectId (ref: User)
  type: String (credit, debit, escrow_hold, etc.)
  amount: Number
  currency: String
  description: String
  status: String (pending, completed, failed, cancelled)
  relatedJob: ObjectId (ref: Job)
  relatedApplication: ObjectId (ref: Application)
  withdrawalMethod: String
  accountDetails: String
  notes: String
  processedBy: ObjectId (ref: Admin)
  processedAt: Date
}
```

### API Endpoints

#### `GET /api/wallet`
Get user's wallet information
- Returns wallet object
- Creates wallet if doesn't exist

#### `GET /api/wallet/transactions`
Get transaction history
- Query params: `page`, `limit`, `type`, `status`
- Returns paginated transactions

#### `POST /api/wallet/add-funds`
Add funds to wallet
- Body: `{ amount, description }`
- Returns updated wallet

#### `POST /api/wallet/withdraw`
Request withdrawal
- Body: `{ amount, withdrawalMethod, accountDetails }`
- Withdrawal methods: bank_transfer, paypal, stripe, jazzcash, easypaisa
- Returns updated wallet

#### `POST /api/wallet/payment/:jobId`
Make payment for a job (moves to escrow)
- Params: `jobId`
- Body: `{ amount, applicationId }`
- Returns updated wallet

#### `POST /api/wallet/release-payment`
Release payment from escrow
- Body: `{ transactionId, recipientId }`
- Returns both client and recipient wallets

#### `GET /api/wallet/stats`
Get wallet statistics
- Returns: totalEarned, totalSpent, totalWithdrawn, pendingWithdrawals, escrowBalance

## Frontend Implementation

### Pages

#### Wallet Page (`frontend/src/pages/WalletPage.js`)
Full-featured wallet management page with:
- Balance display (total, available, escrow)
- Transaction history table
- Add funds modal
- Withdraw funds modal
- Statistics panel

**Access:** `/wallet` (Protected route - all authenticated users)

### Components

#### WalletWidget (`frontend/src/components/WalletWidget.js`)
Dashboard widget showing:
- Available balance
- Escrow balance (if any)
- Total earned and spent
- Quick link to full wallet page

**Usage:**
```jsx
import WalletWidget from '../components/WalletWidget';

<WalletWidget />
```

### Navigation
- Wallet link added to user dropdown menu in navbar
- WalletWidget integrated into both Student and Client dashboards

## User Flows

### Client Workflow
1. **Add Funds**: Client adds money to wallet via payment gateway
2. **Post Job**: Client posts a job with payment amount
3. **Payment**: When hiring, funds move from available to escrow
4. **Release**: Upon project completion, funds release to student
5. **View History**: Client can see all transactions

### Student Workflow
1. **Earn Money**: Complete projects to earn money
2. **Receive Payment**: Funds added to wallet when client releases payment
3. **Withdraw**: Request withdrawal to bank/payment method
4. **Track Earnings**: View earning history and statistics

### Escrow System
1. Client funds are held in escrow when project starts
2. Protects both parties (client and student)
3. Released upon project completion/approval
4. Can be refunded if project is cancelled

## Withdrawal Process
1. Student requests withdrawal from available balance
2. System creates pending withdrawal transaction
3. Admin/automated system processes withdrawal (3-5 business days)
4. Funds transferred to specified account
5. Transaction marked as completed

## Payment Methods Supported
- Bank Transfer
- PayPal
- Stripe
- JazzCash (Pakistan)
- Easypaisa (Pakistan)

## Security Features
- Protected routes (authentication required)
- Balance validation before transactions
- Escrow protection for ongoing work
- Transaction logging for audit trail
- User can only access their own wallet

## Future Enhancements
1. **Payment Gateway Integration**: Stripe, PayPal for real fund deposits
2. **Automatic Escrow Release**: Based on project milestones
3. **Multi-wallet**: Support for multiple currencies per user
4. **Recurring Payments**: For subscription-based services
5. **Dispute Resolution**: Handle payment disputes
6. **Tax Reporting**: Generate tax documents
7. **Wallet Notifications**: Real-time notifications for transactions
8. **Admin Dashboard**: Manage withdrawals and monitor transactions

## Testing the System

### 1. Start Backend
```bash
cd backend
npm start
```

### 2. Start Frontend
```bash
cd frontend
npm start
```

### 3. Test as Student
1. Register/Login as student
2. Navigate to `/wallet`
3. Add test funds
4. View transaction history
5. Request withdrawal

### 4. Test as Client
1. Register/Login as client
2. Navigate to `/wallet`
3. Add funds to wallet
4. Post a job
5. Make payment (moves to escrow)
6. View wallet shows escrow balance

### 5. Test Escrow Release
1. Use API endpoint to release payment
2. Student receives funds
3. Client's escrow decreases

## Database Setup
Wallets are automatically created when users first access the wallet page. No manual setup required.

## Notes
- Currently, "Add Funds" is for testing purposes
- In production, integrate with payment gateway (Stripe/PayPal)
- Withdrawal processing should be handled by admin or automated system
- All amounts are stored as numbers with 2 decimal precision
- Transactions are indexed for fast queries

## Support
For issues or questions about the wallet system, check:
1. Backend logs for API errors
2. Frontend console for client-side errors
3. Database transactions collection for transaction history
4. Network tab for API request/response details
