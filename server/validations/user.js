import Joi from 'joi';

//validation for creation of a new user at the API level

let validateCreateUser = (objectValue) => {
	let schema = Joi.object()
		.keys({
			username: Joi.string().min(3).max(255).required(),
			name: Joi.object().keys({
				firstName: Joi.string().min(3).max(255).required(),
				lastName: Joi.string().min(3).max(255).required(),
			}),
			email: Joi.string().email({ minDomainAtoms: 2 }),
			password: Joi.string().min(8),
			roleId: Joi.string().token(),
		})
		.and('username', 'name', 'email', 'password', 'roleId');

	return Joi.validate(objectValue, schema);
};


// validation for login of user at API level
let validateLogin = (objectValue) => {
	let schema = Joi.object().keys({
		username: Joi.string().min(3).max(255).required(),
		password: Joi.string().min(8),
	});
	return Joi.validate(objectValue, schema);
};

export { validateCreateUser, validateLogin };
