const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phone: String,
		notes: String
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Admin', AdminSchema);
