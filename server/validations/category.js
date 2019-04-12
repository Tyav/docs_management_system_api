import Joi from 'joi';

//Validation of Role Creation Inputs;
let validateCate = (categoryData) => {
	let schema = Joi.object().keys({
		title: Joi.string().min(3).max(255).required(),
	});
	return Joi.validate(categoryData, schema);
};

export { validateCate };
