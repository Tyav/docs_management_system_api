import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import { User } from '../../../server/model/user';
import { validateCreateUser, validateLogin } from '../../../server/validations/user';

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

router.get('/', async (req, res) => {
	const users = await User.find({});
	res.status(200).send(users);
});

//SINGLE USER [GET /users/<id>]
router.get('/:id', async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send({
			Error: 'Bad Request',
			message: 'Invalid Id',
		});
	}

	const user = await User.findById(req.params.id);
	res.status(200).send(user);
});

//CREATE USER [POST /users/]
router.post('/', async (req, res) => {
	const { error } = validateCreateUser(req.body);
	if (error) return res.status(400).send({ Error: 'Bad Request', message: error.details[0].message });
	res.status(201).send({ username: 'testUserName' });
});

//LOGIN USER [POST /users/login]

//LOGOUT USER [POST /users/logout]

// EDIT USER [PUT /users/<id>]

//DELETE USER [DELETE /users/<id>]

module.exports = router;

// module.exports = function(req, res, next) {
// 	if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send('Invalid ID.');

// 	next();
// };
