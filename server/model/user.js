import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from 'config';

const Schema = mongoose.Schema;

//USER FULL NAME SCHEMA FOR DB LEVEL VALIDATION
const nameSchema = new Schema({
	firstName: {
		type: String,
		minlength: 3,
		maxlength: 255,
		required: [ true, 'firstName is required' ],
	},
	lastName: {
		type: String,
		minlength: 3,
		maxlength: 255,
		required: [ true, 'lastName is required' ],
	},
});

//USER SCHEMA FOR MODEL BUILD-UP
const userSchema = new Schema({
	username: {
		type: String,
		required: [ true, 'Username is required' ],
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
		required: [ true, 'email is required' ],
		unique: true,
	},
	password: {
		type: String,
		minlength: 8,
		required: [ true, 'password is required' ],
	},
	roleId: {
		type: Schema.Types.ObjectId,
		required: [ true, 'roleId is required' ],
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	modifiedAt: {
		type: Date,
	},
});
userSchema.methods.generateAuthToken = function(log = false, adm = false) {
	const token = jwt.sign({ _id: this._id, isAdmin: adm, isLogged: log, role: this.roleId }, config.get('jwtPrivateKey'));
	return token;
};

const User = mongoose.model('users', userSchema);

export { User };
