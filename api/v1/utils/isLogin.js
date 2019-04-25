module.exports = function(req, res, next) {
	// 401 Unauthorized
	// 403 Forbidden

	if (!req.user.isLogged) return res.status(401).send({Error: 401, message:'Access denied, Log in'});

	next();
};
