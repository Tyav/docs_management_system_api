import mongoose from 'mongoose';

const Schema = mongoose.Schema;
//Schema for documents
const docSchema = new Schema({
	title       : {
		type      : String,
		minlength : 1,
		maxlength : 255,
	},
	content     : {
		type      : String,
		unique    : true,
		required  : true,
		minlength : 1,
		maxlength : 5000,
	},
	creatorId   : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'User',
		// {
		// 	_id      : mongoose.Schema.Types.ObjectId,
		// 	username : String,
		// 	avatar   : String,
		// },
	},
	access      : {
		type    : String,
		enum    : [ 'public', 'private', 'role' ],
		default : 'public',
	},
	categoryId  : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'Category',
	},
	createdAt   : {
		type     : Date,
		required : true,
		default  : Date.now(),
	},
	modifiedAt  : {
		type : Date,
		set  : v => new Date(v),
	},
	deleted     : {
		type    : Boolean,
		default : false,
	},
	publishDate : {
		type    : Date,
		set     : v => new Date(v),
		default : Date.now(),
	},
	role        : {
		type :  mongoose.Schema.Types.ObjectId,
			ref : 'Role',
		},
	likes:{
		type: Number,
		default: 0
	},
	dislikes:{
		type: Number,
		default: 0
	}
});

//model for documents
const Document = mongoose.model('documents', docSchema);

export { Document };
