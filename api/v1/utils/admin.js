module.exports = function(req, res, next) {
	// 401 Unauthorized
	// 403 Forbidden
	const token = req.header('x-auth-token')

	if (!req.user.isAdmin) return res.status(403).header('x-auth-token', token).send({ Error: 403, message: 'Forbidden' });

	next();
};
