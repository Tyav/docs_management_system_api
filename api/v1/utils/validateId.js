import mongoose from 'mongoose';

const authId = (req, res, next) => {
	const token = req.header('x-auth-token'); //get token
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send({
			token,
			Error: 400,
			message: 'Invalid Id',
		});
	}
	next();
};

export { authId };
