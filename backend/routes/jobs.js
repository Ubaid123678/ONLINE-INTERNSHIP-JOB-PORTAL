const express = require('express');
const mongoose = require('mongoose');
const Job = require('../models/job');
const Application = require('../models/application');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

const isRecruiterOrAdmin = (role) => ['client', 'admin'].includes(role);

const parseSkills = (skills) => {
	if (Array.isArray(skills)) return skills;
	if (typeof skills === 'string') {
		return skills
			.split(',')
			.map((skill) => skill.trim())
			.filter(Boolean);
	}
	return [];
};

const buildFilters = ({ keyword, location, skills, status }) => {
	const filter = {};
	if (keyword) {
		const regex = new RegExp(keyword.trim(), 'i');
		filter.$or = [{ title: regex }, { description: regex }];
	}
	if (location) {
		filter.location = new RegExp(location.trim(), 'i');
	}
	const parsedSkills = parseSkills(skills);
	if (parsedSkills.length > 0) {
		filter.skills = { $all: parsedSkills.map((skill) => new RegExp(skill, 'i')) };
	}
	if (status) {
		filter.status = status;
	}
	return filter;
};

router.get('/', async (req, res) => {
	try {
		const filters = buildFilters(req.query);
		const jobs = await Job.find(filters).sort({ createdAt: -1 }).populate('recruiter', 'name email');
		res.json({ jobs });
	} catch (err) {
		console.error('Jobs list error:', err.message);
		res.status(500).json({ msg: 'Failed to fetch jobs.' });
	}
});

router.post('/', auth, async (req, res) => {
	if (!isRecruiterOrAdmin(req.user.role)) {
		return res.status(403).json({ msg: 'Only recruiters or admins can post jobs.' });
	}

	const { title, company, description, location, skills, deadline, budget, status = 'active' } = req.body;

	if (!title || !description) {
		return res.status(400).json({ msg: 'Title and description are required.' });
	}

	try {
		const job = await Job.create({
			title,
			company,
			description,
			location,
			skills: parseSkills(skills),
			deadline,
			budget,
			status,
			recruiter: req.user.id
		});

		// Notify all students about the new job
		const notificationService = req.app.get('notificationService');
		if (notificationService) {
			const students = await User.find({ role: 'student' }).select('_id');
			const studentIds = students.map(s => s._id);
			await notificationService.notifyNewJob(job, studentIds);
		}

		res.status(201).json({ job });
	} catch (err) {
		console.error('Job create error:', err.message);
		res.status(500).json({ msg: 'Failed to create job.' });
	}
});

router.get('/mine', auth, async (req, res) => {
	if (!isRecruiterOrAdmin(req.user.role)) {
		return res.status(403).json({ msg: 'Only recruiters or admins can view this list.' });
	}

	try {
		const filter = req.user.role === 'client' ? { recruiter: req.user.id } : {};
		const jobs = await Job.find(filter).sort({ createdAt: -1 });
		
		// Check if each job has any completed applications
		const jobsWithStatus = await Promise.all(jobs.map(async (job) => {
			const completedApplication = await Application.findOne({ 
				job: job._id, 
				status: 'completed' 
			});
			
			const jobObj = job.toObject();
			// If there's a completed application, mark the job as completed
			if (completedApplication) {
				jobObj.status = 'completed';
			}
			return jobObj;
		}));
		
		res.json({ jobs: jobsWithStatus });
	} catch (err) {
		console.error('Jobs mine error:', err.message);
		res.status(500).json({ msg: 'Failed to load your jobs.' });
	}
});

router.get('/summary', auth, async (req, res) => {
	try {
		const jobFilter = req.user.role === 'client' ? { recruiter: req.user.id } : {};
		const jobsPostedPromise = Job.countDocuments(jobFilter);

		let applicationFilter = {};
		if (req.user.role === 'student') {
			applicationFilter = { student: req.user.id };
		} else if (req.user.role === 'client') {
			const recruiterJobIds = await Job.find({ recruiter: req.user.id }).distinct('_id');
			applicationFilter = recruiterJobIds.length ? { job: { $in: recruiterJobIds } } : { job: null };
		}

		const applicationsPromise = Application.countDocuments(applicationFilter);

		let applicantsPromise = Promise.resolve([]);
		if (['client', 'admin'].includes(req.user.role)) {
			applicantsPromise = Application.distinct('student', applicationFilter);
		}

		const [jobsPosted, applications, applicantIds] = await Promise.all([
			jobsPostedPromise,
			applicationsPromise,
			applicantsPromise
		]);

		res.json({
			jobsPosted,
			applications,
			applicants: applicantIds.length || undefined
		});
	} catch (err) {
		console.error('Jobs summary error:', err.message);
		res.status(500).json({ msg: 'Failed to load summary.' });
	}
});

router.get('/:jobId', async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.jobId)) {
		return res.status(400).json({ msg: 'Invalid job id.' });
	}
	try {
		const job = await Job.findById(req.params.jobId).populate('recruiter', 'name email');
		if (!job) {
			return res.status(404).json({ msg: 'Job not found.' });
		}
		res.json({ job });
	} catch (err) {
		console.error('Job detail error:', err.message);
		res.status(500).json({ msg: 'Failed to fetch job.' });
	}
});

router.put('/:jobId', auth, async (req, res) => {
	try {
		const job = await Job.findById(req.params.jobId);
		if (!job) {
			return res.status(404).json({ msg: 'Job not found.' });
		}

		if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
			return res.status(403).json({ msg: 'You do not have permission to update this job.' });
		}

		// Prevent editing of processing or completed jobs
		if (['processing', 'completed'].includes(job.status)) {
			return res.status(400).json({ 
				msg: `Cannot edit ${job.status} jobs. Job is already in progress or completed.` 
			});
		}

		const updates = { ...req.body };
		if (updates.skills) {
			updates.skills = parseSkills(updates.skills);
		}

		Object.assign(job, updates);
		await job.save();

		res.json({ job });
	} catch (err) {
		console.error('Job update error:', err.message);
		res.status(500).json({ msg: 'Failed to update job.' });
	}
});

router.delete('/:jobId', auth, async (req, res) => {
	try {
		const job = await Job.findById(req.params.jobId);
		if (!job) {
			return res.status(404).json({ msg: 'Job not found.' });
		}

		if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
			return res.status(403).json({ msg: 'You do not have permission to delete this job.' });
		}

		// Prevent deletion of processing or completed jobs
		if (['processing', 'completed'].includes(job.status)) {
			return res.status(400).json({ 
				msg: `Cannot delete ${job.status} jobs. Job is already in progress or completed.` 
			});
		}
	await job.deleteOne();
	res.json({ msg: 'Job deleted.' });
} catch (err) {
	console.error('Job delete error:', err.message);
	res.status(500).json({ msg: 'Failed to delete job.' });
}
});

module.exports = router;