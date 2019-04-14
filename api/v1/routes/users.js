import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import bcrypt from 'bcrypt';

const router = express.Router();
import { User } from '../../../server/model/user';
import { Role } from '../../../server/model/role';
import { validateCreateUser, validateLogin, validateEditUser } from '../../../server/validations/user';
import { authId as idAuth } from '../utils/validateId';
import adminAuth from '../utils/admin';
import tokenAuth from '../utils/auth';
import loginAuth from '../utils/isLogin';
import ifLogin from '../utils/ifLogin';

//GETS
//ALL USERS [GET /users/]

/**
 * @swagger
 * /api/users:
 *    get:
 *      description: This should return all users
 *      responses:
 *        200:
 *          description: A list of users
 *          schema:
 *            type: string
 *        400:
 *          description: Failed Request
 *          schema:
 *            type: string
 */

router.get('/', [ tokenAuth, loginAuth, adminAuth ], async (req, res) => {
	const users = await User.find({});
	res.status(200).send(users);
});

//SINGLE USER [GET /users/<id>]
router.get('/:id', idAuth, async (req, res) => {
	const user = await User.findById(req.params.id);
	if(!user) return res.status(404).send({ Error: 404, message: 'User not found' })
	res.status(200).send(user);
});

//CREATE USER [POST /users/]
router.post('/', async (req, res) => {
	//validate body content valid for usser creation
	const { error } = validateCreateUser(req.body);
	if (error) return res.status(400).send({ Error: 'Bad Request', message: error.details[0].message });
	//validate roleId has already be created else reject user creation
	const role = await Role.findById(req.body.roleId);
	if (!role) return res.status(400).send({ Error: 'Bad Request', message: 'Invalid Role Id' });

	//check if email has been taken
	let checkEmail = await User.findOne({ email: req.body.email });
	if (checkEmail) return res.status(400).send({ Error: 'Bad Request', message: 'Email is already in use' });
	//check if username has been taken
	let checkUsername = await User.findOne({ username: req.body.username });
	if (checkUsername) return res.status(400).send({ Error: 'Bad Request', message: 'Username is taken' });

	//CREATE USER
	const user = new User(req.body);

	// user = new User(_.pick(req.body, ['name', 'email', 'password']));
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	await user.save();

	//generate a token for user.
	//first parameter for isLogin and
	//second for isAdmin which will be set to true if role.publicWrite is set to true
	const token = user.generateAuthToken(true, role.publicWrite);

	//set the key 'x-auth-token' with generated token in the header
	res.status(201).header('x-auth-token', token).send(_.pick(user, [ '_id', 'username', 'email' ]));
});

//LOGIN USER [POST /users/login]
router.post('/login', [ ifLogin ], async (req, res) => {
	//check if user is not logged in [ifLogin]
	//validate the login input :400
	const { error } = validateLogin(req.body);
	if (error) return res.status(400).send({ Error: 400, message: 'Bad Request (Invalid Input)' });
	//check if user exist by email :400
	const user = await User.findOne({ username: req.body.username });
	if (!user) return res.status(400).send({ Error: 400, message: 'Wrong Username or Password' });
	//check for password :400
	//perform bcrypt check and if you need to change the salt,
	//please do so too in the signup of users

	const password = await bcrypt.compare(req.body.password, user.password);
	if (!password) return res.status(400).send({ Error: 400, message: 'Wrong Username or Password' });

	//get role of user
	const role = await Role.findOne({ _id: user.roleId });
	//create a token for user
	//user true as first parameter to make login valid, and
	//role.publicWrite as second parameter which decides if user is admin
	const token = user.generateAuthToken(true, role.publicWrite);

	//keep the user logged in = 200
	res.status(200).header('x-auth-token', token).send(_.pick(user, [ '_id', 'username', 'email', 'name' ]));
});

//LOGOUT USER [POST /users/logout]
router.post('/logout', [tokenAuth], (req, res) => {
	//check if user is logged in, send a 400 if not logged in
	if (!req.user.isLogged) return res.status(401).send({ Error: 401, message: 'Already logged out' });

	res.status(200).send({ Success: 200, message: 'Successfully logged out' });
});

// EDIT USER [PUT /users/<id>]
//[idAuth,tokenAuth, loginAuth],
router.put('/:id', [ idAuth, tokenAuth ], async (req, res) => {
	//compared id in token with id from parameter. if not same return 403
	if (req.params.id !== req.user._id) return res.status(403).send({ Error: 403, message: 'Forbidden' });
	const { error } = validateEditUser(req.body);
	if (error) return res.status(400).send({ Error: 'Bad Request', message: error.details[0].message });
	const user = await User.findById(req.params.id);

	//perform salt and bcrypt
	const passwordCheck = await bcrypt.compare(req.body.password, user.password);
	if (!passwordCheck) return res.status(400).send({ Error: 400, message: 'Wrong Password' });

	//SET NEW VALUES TO UNDEFINED
	let newPassword;
	let newFirstname;
	let newLastName;
	if(req.body.name){
		newFirstname = req.body.name.firstName
		newLastName = req.body.name.lastName
	}
	//if new password, hash it
	if (req.body.newPassword) {
		const salt = await bcrypt.genSalt(10);
		newPassword = await bcrypt.hash(req.body.newPassword, salt);
	}

	const firstName =  newFirstname || user.name.firstName;
	const lastName =  newLastName || user.name.lastName;
	const password = newPassword || user.password;

	const updatedUser = await User.findByIdAndUpdate(
		req.params.id,
		{
			name: { firstName, lastName },
			password: password,
			modifiedAt: Date.now(),
		},
		{ new: true },
	);
	if (!updatedUser) return res.status(400).send({ Error: 400, message: 'Invalid Id' });
	res.status(200).send(_.pick(updatedUser, [ '_id', 'username', 'email', 'name' ]));
});

//DELETE USER [DELETE /users/<id>]
router.delete('/:id', [ tokenAuth, loginAuth ], async (req, res) => {
	//401 if not logged in [done in token and login auth]

	//403 if logged but not the owner
	if (req.params.id !== req.user._id) return res.status(403).send({ Error: 403, message: 'Forbidden' });

	//200 should delete user
	await User.findByIdAndDelete(req.params.id);

	res.status(200).send({ Success: 200, message: 'User deleted' });
});

module.exports = router;

// module.exports = function(req, res, next) {
// 	if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send('Invalid ID.');

// 	next();
// };
