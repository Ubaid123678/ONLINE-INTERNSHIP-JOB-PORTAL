const express = require('express');
const mongoose = require('mongoose');
const Application = require('../models/application');
const Job = require('../models/job');
const User = require('../models/user');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadProject } = require('../middleware/upload');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

const isStudent = (role) => role === 'student';
const isRecruiter = (role) => role === 'client';
const isAdmin = (role) => role === 'admin';

const trySendEmail = async (payload) => {
	try {
		await sendEmail(payload);
	} catch (err) {
		console.error('Email dispatch error:', err.message);
	}
};

router.get('/', auth, async (req, res) => {
	try {
		let filter = {};

		if (isStudent(req.user.role)) {
			filter = { student: req.user.id };
		} else if (isRecruiter(req.user.role)) {
			const jobIds = await Job.find({ recruiter: req.user.id }).distinct('_id');
			filter = jobIds.length ? { job: { $in: jobIds } } : { _id: null };
		}

		const applications = await Application.find(filter)
			.sort({ createdAt: -1 })
			.populate({
				path: 'job',
				select: 'title location recruiter',
				populate: {
					path: 'recruiter',
					select: 'name email profile'
				}
			})
			.populate('student', 'name email profile');
		res.json({ applications });
	} catch (err) {
		console.error('Applications list error:', err.message);
		res.status(500).json({ msg: 'Failed to load applications.' });
	}
});

router.post('/', auth, upload.single('resume'), async (req, res) => {
	if (!isStudent(req.user.role)) {
		return res.status(403).json({ msg: 'Only students can apply to jobs.' });
	}

	const { job: jobId } = req.body;
	if (!mongoose.Types.ObjectId.isValid(jobId)) {
		return res.status(400).json({ msg: 'Invalid job id.' });
	}

	try {
		const job = await Job.findById(jobId).populate('recruiter');
		if (!job || job.status === 'closed') {
			return res.status(404).json({ msg: 'Job not available.' });
		}

		const existing = await Application.findOne({ job: jobId, student: req.user.id });
		if (existing) {
			return res.status(409).json({ msg: 'You already applied to this job.' });
		}

		const student = await User.findById(req.user.id);

		const application = await Application.create({
			job: jobId,
			student: req.user.id,
			resume: req.file ? req.file.path.replace(/\\/g, '/') : undefined
		});

		// Create notification for recruiter
		const notificationService = req.app.get('notificationService');
		if (notificationService) {
			await notificationService.notifyNewApplication(application, job);
		}

		if (job.recruiter?.email) {
			await trySendEmail({
				to: job.recruiter.email,
				subject: `New application for ${job.title}`,
				html: `<p>Hello ${job.recruiter.name || 'Recruiter'},</p><p>${student?.name || 'A student'} just applied for <strong>${job.title}</strong>.</p>`
			});
		}
		if (student?.email) {
			await trySendEmail({
				to: student.email,
				subject: `Application received: ${job.title}`,
				html: `<p>Hi ${student.name || 'there'},</p><p>Your application for <strong>${job.title}</strong> is submitted.</p>`
			});
		}

		res.status(201).json({ application });
	} catch (err) {
		console.error('Application create error:', err.message);
		res.status(500).json({ msg: 'Failed to submit application.' });
	}
});

router.patch('/:applicationId/status', auth, async (req, res) => {
	const { status } = req.body;
	if (!['applied', 'approved', 'rejected', 'accepted', 'in-progress', 'completed'].includes(status)) {
		return res.status(400).json({ msg: 'Invalid status value.' });
	}

	if (!isRecruiter(req.user.role) && !isAdmin(req.user.role)) {
		return res.status(403).json({ msg: 'Unauthorized.' });
	}

	if (!mongoose.Types.ObjectId.isValid(req.params.applicationId)) {
		return res.status(400).json({ msg: 'Invalid application id.' });
	}

	try {
		const application = await Application.findById(req.params.applicationId).populate({
			path: 'job',
			populate: { path: 'recruiter', select: '_id name email' }
		});

		if (!application) {
			return res.status(404).json({ msg: 'Application not found.' });
		}

		if (
			isRecruiter(req.user.role) &&
			application.job?.recruiter &&
			application.job.recruiter._id.toString() !== req.user.id
		) {
			return res.status(403).json({ msg: 'You cannot update this application.' });
		}


		// If recruiter is trying to hire/move forward, ensure sufficient wallet balance
		// We treat 'approved', 'accepted', and 'in-progress' as hiring states
		if (['approved', 'accepted', 'in-progress'].includes(status)) {
			const job = application.job;
			const requiredAmount = Number(job?.paymentAmount || 0);
			if (requiredAmount > 0) {
				const Wallet = require('../models/wallet');
				const recruiterId = job?.recruiter?._id || job?.recruiter;
				const recruiterWallet = recruiterId ? await Wallet.findOne({ user: recruiterId }) : null;
				const available = recruiterWallet?.availableBalance || 0;
				if (!recruiterWallet || available < requiredAmount) {
					const shortMsg = `Insufficient wallet balance. Please add ${job?.currency || 'USD'} ${requiredAmount.toFixed(2)} to hire for this job.`;
					return res.status(400).json({ 
						code: 'INSUFFICIENT_FUNDS_TO_HIRE',
						msg: shortMsg,
						needed: requiredAmount,
						available: available,
						currency: job?.currency || 'USD'
					});
				}
			}
		}

		application.status = status;
		await application.save();

		// When client hires/approves a student, set job status to 'processing'
		if (['approved', 'accepted', 'in-progress'].includes(status)) {
			const Job = require('../models/job');
			await Job.findByIdAndUpdate(application.job._id, { status: 'processing' });
		}

		// Create notification for student about status change
		const notificationService = req.app.get('notificationService');
		const recruiter = await User.findById(req.user.id);
		if (notificationService && recruiter) {
			await notificationService.notifyStatusChange(application, application.job, recruiter, status);
		}

		const student = await User.findById(application.student);
		if (student?.email) {
			await trySendEmail({
				to: student.email,
				subject: `Application ${status}`,
				html: `<p>Hi ${student.name || 'there'},</p><p>Your application for <strong>${application.job.title}</strong> is now marked as <strong>${status}</strong>.</p>`
			});
		}

		res.json({ application });
	} catch (err) {
		console.error('Application status error:', err.message);
		res.status(500).json({ msg: 'Failed to update application.' });
	}
});

router.post('/:applicationId/submit-project', auth, uploadProject.single('projectFile'), async (req, res) => {
	if (!isStudent(req.user.role)) {
		return res.status(403).json({ msg: 'Only students can submit projects.' });
	}

	if (!mongoose.Types.ObjectId.isValid(req.params.applicationId)) {
		return res.status(400).json({ msg: 'Invalid application id.' });
	}

	try {
		const application = await Application.findById(req.params.applicationId)
			.populate('job')
			.populate('student', 'name email');

		if (!application) {
			return res.status(404).json({ msg: 'Application not found.' });
		}

		if (application.student._id.toString() !== req.user.id) {
			return res.status(403).json({ msg: 'You can only submit project for your own application.' });
		}

		if (application.projectSubmission?.isSubmitted) {
			return res.status(400).json({ msg: 'You have already submitted a project for this application. You can only submit once.' });
		}

		if (!req.file) {
			return res.status(400).json({ msg: 'Project file is required.' });
		}

		const { description } = req.body;

		application.projectSubmission = {
			file: req.file.path.replace(/\\/g, '/'),
			fileName: req.file.originalname,
			fileSize: req.file.size,
			description: description || '',
			submittedAt: new Date(),
			isSubmitted: true
		};

		application.status = 'completed';

		const job = application.job;

		// Set job status to 'completed'
		const Job = require('../models/job');
		await Job.findByIdAndUpdate(job._id, { status: 'completed' });

		// Automatically hold payment in escrow when project is submitted
		const Wallet = require('../models/wallet');
		const Transaction = require('../models/transaction');
		
		const paymentAmount = job.paymentAmount;
		
		if (paymentAmount && paymentAmount > 0) {
			try {
				// Get client's wallet
				const clientWallet = await Wallet.findOne({ user: job.recruiter });
				
				if (clientWallet && clientWallet.hasSufficientBalance(paymentAmount)) {
					// Move funds to escrow
					await clientWallet.moveToEscrow(
						paymentAmount, 
						`Payment hold for job: ${job.title}`
					);
					
					// Find the escrow transaction
					const escrowTransaction = await Transaction.findOne({
						wallet: clientWallet._id,
						type: 'escrow_hold',
						amount: paymentAmount,
						status: 'pending'
					}).sort({ createdAt: -1 });
					
					if (escrowTransaction) {
						escrowTransaction.relatedJob = job._id;
						escrowTransaction.relatedApplication = application._id;
						await escrowTransaction.save();
						
						// Update application payment status
						application.payment = {
							status: 'pending_approval',
							amount: paymentAmount,
							escrowTransaction: escrowTransaction._id
						};
					}
				} else {
					console.log('Client has insufficient balance for payment hold');
					// Mark payment status but don't hold funds
					application.payment = {
						status: 'not_initiated',
						amount: paymentAmount
					};
				}
			} catch (paymentError) {
				console.error('Payment escrow error:', paymentError.message);
				// Continue with application submission even if payment fails
				application.payment = {
					status: 'not_initiated',
					amount: paymentAmount
				};
			}
		}
		
		await application.save();

		// Create notification for recruiter about project submission
		const notificationService = req.app.get('notificationService');
		if (notificationService) {
			const jobWithRecruiter = await Job.findById(application.job._id).populate('recruiter');
			await notificationService.notifyProjectSubmission(application, jobWithRecruiter, application.student);
		}

		const recruiter = await User.findById(application.job.recruiter);
		if (recruiter?.email) {
			await trySendEmail({
				to: recruiter.email,
				subject: `Project Submitted: ${application.job.title}`,
				html: `<p>Hello ${recruiter.name || 'Recruiter'},</p>
				       <p>${application.student.name} has submitted their completed project for <strong>${application.job.title}</strong>.</p>
				       <p>Please log in to your dashboard to review and download the submission.</p>`
			});
		}

		res.json({ 
			msg: 'Project submitted successfully',
			application 
		});
	} catch (err) {
		console.error('Project submission error:', err.message);
		res.status(500).json({ msg: 'Failed to submit project.' });
	}
});

router.get('/:applicationId/download-project', auth, async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.applicationId)) {
		return res.status(400).json({ msg: 'Invalid application id.' });
	}

	try {
		const application = await Application.findById(req.params.applicationId).populate('job');

		if (!application) {
			return res.status(404).json({ msg: 'Application not found.' });
		}

		const isOwner = application.student.toString() === req.user.id;
		const isJobOwner = application.job.recruiter.toString() === req.user.id;

		if (!isOwner && !isJobOwner && !isAdmin(req.user.role)) {
			return res.status(403).json({ msg: 'You are not authorized to download this project.' });
		}

		if (!application.projectSubmission?.isSubmitted) {
			return res.status(404).json({ msg: 'No project has been submitted for this application.' });
		}

		const path = require('path');
		const filePath = path.join(__dirname, '..', application.projectSubmission.file);
		
		res.download(filePath, application.projectSubmission.fileName, (err) => {
			if (err) {
				console.error('Download error:', err);
				res.status(500).json({ msg: 'Failed to download file.' });
			}
		});
	} catch (err) {
		console.error('Download project error:', err.message);
		res.status(500).json({ msg: 'Failed to download project.' });
	}
});

module.exports = router;
