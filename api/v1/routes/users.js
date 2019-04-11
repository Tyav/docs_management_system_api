import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import bcrypt from 'bcrypt';

const router = express.Router();
import { User } from '../../../server/model/user';
import { Role } from '../../../server/model/role';
import { validateCreateUser, validateLogin } from '../../../server/validations/user';
import { authId as idAuth } from '../utils/validateId';
import adminAuth from '../utils/admin';
import tokenAuth from '../utils/auth';
import loginAuth from '../utils/login'

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

router.get('/',[tokenAuth, loginAuth, adminAuth], async (req, res) => {

	const users = await User.find({});
	res.status(200).send(users);
});

//SINGLE USER [GET /users/<id>]
router.get('/:id',idAuth, async (req, res) => {
	const user = await User.findById(req.params.id);
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

  // console.log(role)
  // const token = user.generateAuthToken();
	//res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

	res.status(201).send(_.pick(user, [ '_id', 'username', 'email' ]));
});

//LOGIN USER [POST /users/login]

//LOGOUT USER [POST /users/logout]

// EDIT USER [PUT /users/<id>]
//[idAuth,tokenAuth, loginAuth], if(req.params.id == req.user._id) console.log(true)
router.put('/:id',idAuth, (req, res) => {
  
});

//DELETE USER [DELETE /users/<id>]

module.exports = router;

// module.exports = function(req, res, next) {
// 	if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send('Invalid ID.');

// 	next();
// };
