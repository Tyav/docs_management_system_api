import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//Create Role schema to build role model
const cateSchema = new Schema({
	title : {
		//category title
		type      : String,
		required  : true,
		minlength : 3,
		unique    : true,
		lowercase : true,
	},
});

const Category = mongoose.model('Category', cateSchema);

	Category.insertMany([ { title: 'social' }, 
	{ title: 'technology' }, 
	{ title: 'education' }, 
	{ title: 'politics' }, 
	{ title: 'religion' } ]).catch(err=>{
	});

// Category.create({
// 	title : 'general',
// })
// 	.then(() => {})
// 	.catch(err => {
// 		//Do something with error
// 	});
// Category.create({
// 	title : 'regular',
// })
// 	.then(() => {})
// 	.catch(err => {
// 		//Do something with error
// 	});

export { Category };
