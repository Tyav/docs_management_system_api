import express from 'express';
const router = express.Router();
import { User } from '../../../server/model/user';

//GETS
//ALL USERS [GET /users/]
router.get('/', async (req, res)=>{
  const users = await User.find()
 res.status(200).send(users)
})

//SINGLE USER [GET /users/<id>]

//CREATE USER [POST /users/]

//LOGIN USER [POST /users/login]

//LOGOUT USER [POST /users/logout]

// EDIT USER [PUT /users/<id>]

//DELETE USER [DELETE /users/<id>]

module.exports = router;
