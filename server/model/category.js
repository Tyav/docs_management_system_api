import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//Create Role schema to build role model
const cateSchema = new Schema({
	title: {
		//category title
		type: String,
		required: true,
		minlength: 3,
		unique: true,
		lowercase: true,
	},
});

const Category = mongoose.model('Category', cateSchema);

export { Category };
