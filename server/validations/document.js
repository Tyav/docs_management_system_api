import Joi from 'joi';
//import obj from 'joi-objectid';
Joi.objectId = require('joi-objectid')(Joi);

//console.log(Joi);

let validateDoc = (docData) => {
	let schema = Joi.object().keys({
		title: Joi.string().min(1).max(255).required(),
		content: Joi.string().min(1).max(5000).required(),
		creatorId: Joi.objectId(),
		access: Joi.string().valid('private', 'public').required(),
		categoryId: Joi.objectId(),
		createdAt: Joi.date(),
	});
	return Joi.validate(docData, schema);
};

export { validateDoc };
