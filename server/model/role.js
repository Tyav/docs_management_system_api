import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//Create Role schema to build role model
const roleSchema = new Schema({
	title: {
		//role title
		type: String,
		required: true,
		minlength: 3,
		unique: true,
		lowercase: true,
	},
	publicWrite: {
		//right to edit or delete any document
		type: Boolean,
		default: function() {
			if (this.title === 'admin') {
				return true;
			}
			return false;
		},
		required: true,
	},
	readAll: {
		//right to read all documents including deleted files
		type: Boolean,
		default: function() {
			if (this.publicWrite) {
				return true;
			}
			return false;
		},
		required: true,
	},
});

//using schema to generate Role model
const Role = mongoose.model('Role', roleSchema);

// Role.create({
// 	title: 'regular',
// });

export { Role };
