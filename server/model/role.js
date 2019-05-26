import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//Create Role schema to build role model
const roleSchema = new Schema({
	title       : {
		//role title
		type      : String,
		required  : true,
		minlength : 3,
		unique    : true,
		lowercase : true,
	},
	writeAll : {
		//right to edit or delete any document
		type     : Boolean,
		default  : function(v) {
			if (this.title === 'admin') {
				return true; //set writeAll to true if role is admin
			}
			return false; //else replace writeAll with false value to ensure that only admin can writeAll
		},
		required : true,
	},
	readAll     : {
		//right to read all documents including deleted files
		type     : Boolean,
		default: function() {
			if (this.writeAll) {
				return true;//set readAll to true if role is admin
			}
			return false;//else replace readAll with initial value
		},
		required : true,
	},
});

//using schema to generate Role model
const Role = mongoose.model('Role', roleSchema);

//CREATE DEFAULT ROLES REGULAR & ADMIN ROLES
	Role.create({
		title : 'admin',
	})
		.then(() => {})
		.catch(err => {
			//Do something with error
		});
	Role.create({
		title : 'regular',
	})
		.then(() => {})
		.catch(err => {
			//Do something with error
		});
//console.log(error)

// Role.create({
// 	title: 'regular',
// });

export { Role };
