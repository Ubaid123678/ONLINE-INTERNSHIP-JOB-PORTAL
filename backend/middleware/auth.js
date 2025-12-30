const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
	const token = req.header('Authorization')?.split(' ')[1];
	if (!token) {
		return res.status(401).json({ msg: 'No token provided.' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		return next();
	} catch (err) {
		return res.status(401).json({ msg: 'Token invalid.' });
	}
};
