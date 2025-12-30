# Escrow Payment System Guide

## Overview

The platform now includes an automated escrow payment system that ensures secure payments for completed projects.

## How It Works

### For Students

1. **Apply for a Job**: Submit your application as usual
2. **Complete the Project**: Once approved, work on the assigned task
3. **Submit Your Work**: Upload your completed project through the dashboard
4. **Automatic Payment Hold**: When you submit, the payment amount is automatically held in escrow from the client's wallet
5. **Admin Review**: The admin reviews your submission and the payment request
6. **Payment Release**: Once approved, the payment is automatically transferred to your wallet

### For Clients

1. **Post a Job**: Create a job posting with payment amount
2. **Fund Your Wallet**: Ensure you have sufficient balance in your wallet before students complete projects
3. **Review Applications**: Approve students as usual
4. **Automatic Escrow**: When a student submits their completed project, the payment is automatically held in escrow
5. **Admin Approval**: Admin reviews the submission before releasing payment
6. **Funds Released**: Payment goes to the student or returns to your wallet if rejected

### For Admins

1. **Payment Approvals Tab**: Access pending payment approvals from the admin dashboard
2. **Review Submissions**: Check the project submission details
3. **Approve/Reject**: 
   - **Approve**: Releases payment from escrow to student's wallet
   - **Reject**: Returns funds to client's available balance

## Payment Status Types

- **not_initiated**: Payment hasn't been triggered (usually due to insufficient client balance)
- **pending_approval**: Payment held in escrow, awaiting admin approval
- **released**: Payment successfully transferred to student
- **rejected**: Payment rejected and returned to client

## Transaction Types

- **escrow_hold**: Funds moved from client's available balance to escrow
- **escrow_release**: Funds released from escrow to student
- **refund**: Funds returned to client after rejection

## Security Features

- Automatic payment processing when project is submitted
- Admin review before any payment release
- Full transaction history
- Balance verification before escrow hold
- Cannot submit project multiple times

## API Endpoints

### Admin Endpoints

- `GET /api/admin/payments/pending` - Get all pending payment approvals
- `POST /api/admin/payments/:applicationId/approve` - Approve payment release
- `POST /api/admin/payments/:applicationId/reject` - Reject payment and refund client

### Application Model Updates

The Application model now includes:
```javascript
payment: {
  status: String, // 'not_initiated', 'escrow_hold', 'pending_approval', 'approved', 'released', 'rejected'
  amount: Number,
  escrowTransaction: ObjectId, // Reference to escrow transaction
  releaseTransaction: ObjectId, // Reference to release transaction
  approvedBy: ObjectId, // Admin who approved/rejected
  approvedAt: Date,
  rejectionReason: String
}
```

## Notifications

- Student receives notification when payment is released
- Email notifications for payment status changes
- Real-time updates via socket.io

## Best Practices

1. **Clients**: Always maintain sufficient wallet balance before approving projects
2. **Students**: Submit complete, quality work to ensure payment approval
3. **Admins**: Review project submissions thoroughly before approving payments
4. **Everyone**: Check transaction history regularly for transparency
