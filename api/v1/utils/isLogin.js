module.exports = function(req, res, next) {
	const token = req.header('x-auth-token'); //get token

	// 401 Unauthorized
	// 403 Forbidden

	if (!req.user.isLogged) return res.status(401).send({token: null, result:{Error: 401, message:'Access denied, Log in'}});

	next();
};
