const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose')

module.exports = function(req, res, next) {
	const token = req.header('x-auth-token');
	if (token) {
		try {
			const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
			req.user = decoded;
			next();
		} catch (ex) {
			return res.status(400).send({ token: null,result:{Error: 400, message: 'Invalid token' }});
		}
	} else {
		req.user = {};
		req.user.role = mongoose.Types.ObjectId()
		next();
	}
};
