import mongoose from 'mongoose';

const Schema = mongoose.Schema;
//Schema for documents
const docSchema = new Schema({
	title: {
		type: String,
		unique: true,
		required: true,
		minlength: 1,
		maxlength: 255,
	},
	content: {
		type: String,
		unique: true,
		required: true,
		minlength: 1,
		maxlength: 5000,
	},
	creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	access: {
		type: String,
		enum: [ 'public', 'private','role' ],
		default: 'public'
	},
	categoryId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now(),
	},
	modifiedAt: {
		type: Date,
	},
	deleted: {
		type: Boolean,
		default: false,
	},
	published:{
		type: Date,
		set: v => new Date(v)
	}
});

//model for documents
const Document = mongoose.model('documents', docSchema);

export { Document };
