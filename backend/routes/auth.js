const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/admin');
const auth = require('../middleware/auth');
const { uploadProfilePicture } = require('../middleware/upload');

const router = express.Router();
const ROLE_OPTIONS = ['student', 'client'];

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const formatUser = (user) => ({
	id: user._id,
	name: user.name,
	email: user.email,
	role: user.role,
	profile: user.profile
});

const signToken = (user) => {
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET env variable is missing');
	}

	return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
		expiresIn: '7d'
	});
};

router.post('/register', async (req, res) => {
	try {
		const { name, email: rawEmail, password, role = 'student', adminPasscode } = req.body;

		if (!name || !rawEmail || !password) {
			return res.status(400).json({ msg: 'Name, email, and password are required.' });
		}

		// Validate name
		if (name.trim().length < 2) {
			return res.status(400).json({ msg: 'Name must be at least 2 characters long.' });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(rawEmail)) {
			return res.status(400).json({ msg: 'Please provide a valid email address.' });
		}

		if (password.length < 6) {
			return res.status(400).json({ msg: 'Password must be at least 6 characters long.' });
		}

		const requestedRole = role.toLowerCase();
		if (!ROLE_OPTIONS.includes(requestedRole)) {
			return res.status(400).json({ msg: 'Invalid role selected.' });
		}

		const email = normalizeEmail(rawEmail);
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ msg: 'Email is already registered.' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({
			name: name.trim(),
			email,
			password: hashedPassword,
			role: requestedRole
		});

		const token = signToken(user);
		return res.status(201).json({ token, user: formatUser(user) });
	} catch (err) {
		console.error('Register error:', err.message);
		return res.status(500).json({ msg: 'Something went wrong. Please try again.' });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { email: rawEmail, password } = req.body;

		if (!rawEmail || !password) {
			return res.status(400).json({ msg: 'Email and password are required.' });
		}

		const email = normalizeEmail(rawEmail);
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({ msg: 'Invalid credentials.' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ msg: 'Invalid credentials.' });
		}

		const token = signToken(user);
		return res.json({ token, user: formatUser(user) });
	} catch (err) {
		console.error('Login error:', err.message);
		return res.status(500).json({ msg: 'Something went wrong. Please try again.' });
	}
});

router.get('/me', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		if (!user) {
			return res.status(404).json({ msg: 'User not found.' });
		}

		return res.json({ user: formatUser(user) });
	} catch (err) {
		console.error('Profile error:', err.message);
		return res.status(500).json({ msg: 'Something went wrong. Please try again.' });
	}
});

router.patch('/profile', auth, async (req, res) => {
	try {
		const { name, profile } = req.body;
		console.log('Profile update request:', { userId: req.user.id, name, profile });
		
		const updates = {};

		if (name && name.trim().length >= 2) {
			updates.name = name.trim();
		}

		if (profile) {
			updates.profile = {
				skills: profile.skills || [],
				resume: profile.resume || '',
				bio: profile.bio || '',
				phone: profile.phone || '',
				location: profile.location || '',
				company: profile.company || '',
				website: profile.website || '',
				profilePicture: profile.profilePicture || ''
			};
		}

		console.log('Updates to apply:', updates);

		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ $set: updates },
			{ new: true, runValidators: true }
		).select('-password');

		if (!user) {
			return res.status(404).json({ msg: 'User not found.' });
		}

		console.log('Profile updated successfully:', user.profile);
		return res.json({ user: formatUser(user), msg: 'Profile updated successfully.' });
	} catch (err) {
		console.error('Profile update error:', err.message);
		return res.status(500).json({ msg: 'Failed to update profile.' });
	}
});

router.post('/upload-profile-picture', auth, uploadProfilePicture.single('profilePicture'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ msg: 'No file uploaded.' });
		}

		const profilePicturePath = req.file.path.replace(/\\/g, '/');

		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ $set: { 'profile.profilePicture': profilePicturePath } },
			{ new: true }
		).select('-password');

		if (!user) {
			return res.status(404).json({ msg: 'User not found.' });
		}

		return res.json({ 
			profilePicture: profilePicturePath,
			msg: 'Profile picture uploaded successfully.' 
		});
	} catch (err) {
		console.error('Profile picture upload error:', err.message);
		return res.status(500).json({ msg: 'Failed to upload profile picture.' });
	}
});

// Public profile route - view other users' profiles (clients only)
router.get('/public-profile/:userId', auth, async (req, res) => {
	try {
		const user = await User.findById(req.params.userId).select('-password');
		
		if (!user) {
			return res.status(404).json({ msg: 'User not found.' });
		}

		// Only show client profiles publicly
		if (user.role !== 'client') {
			return res.status(403).json({ msg: 'This profile is not public.' });
		}

		// Get job statistics for the client
		const Job = require('../models/job');
		const jobs = await Job.find({ recruiter: user._id });
		
		const totalJobsPosted = jobs.length;
		const totalInvestment = jobs.reduce((sum, job) => {
			return sum + (job.paymentAmount || 0);
		}, 0);

		// Return only public information
		const publicProfile = {
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			profile: {
				company: user.profile?.company || '',
				website: user.profile?.website || '',
				bio: user.profile?.bio || '',
				profilePicture: user.profile?.profilePicture || ''
			},
			stats: {
				totalJobsPosted,
				totalInvestment,
				activeJobs: jobs.filter(j => j.status === 'active').length
			}
		};

		return res.json(publicProfile);
	} catch (err) {
		console.error('Public profile error:', err.message);
		return res.status(500).json({ msg: 'Failed to fetch profile.' });
	}
});

module.exports = router;