import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//USER FULL NAME SCHEMA FOR DB LEVEL VALIDATION
const nameSchema = new Schema({
	firstName: {
		type: String,
		minlength: 3,
		maxlength: 255,
		required: true,
	},
	LastName: {
		type: String,
		minlength: 3,
		maxlength: 255,
		required: true,
	},
});

//USER SCHEMA FOR MODEL BUILD-UP
const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 255,
		unique: true,
	},
	name: {
		type: nameSchema,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		minlength: 8,
		required: true,
	},
	roleId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	createAt: {
		type: Date,
		required: true,
		default: Date.now(),
	},
});

const Users = mongoose.model('users', userSchema);

export { Users };
