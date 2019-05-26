import express from 'express';
import { Role } from '../../../server/model/role';
import { validateRole } from '../../../server/validations/role';
import adminAuth from '../utils/admin';
import tokenAuth from '../utils/auth';
import loginAuth from '../utils/isLogin';
import ifLogin from '../utils/ifLogin';
import { authId } from '../utils/validateId';
import docLog from '../utils/docLog';

const router = express.Router();

//POST: CREATE ROLE ONLY BY ADMIN
router.post('/', [ tokenAuth, adminAuth ], async (req, res) => {
	const token = req.header('x-auth-token'); //get token
	//check for login 401 check for ADMIN 403 : [tokenAuth, adminAuth]
	//role validation 400
	const { error } = validateRole(req.body);
	if (error) return res.status(400).send({ token, Error: 400, message: error.details[0].message });

	//create role admin, 200
	//using trycatch block to handle duplication error
	try {
		const role = await Role.create(req.body);

		res.status(200).send({ token, result: role });
	} catch (error) {
		res.status(400).send({ token, Error: 400, message: `Cannot create duplicate role of ${req.body.title}` });
	}
});

//GET: VIEW ALL ROLE
router.get('/', [ tokenAuth, docLog ], async (req, res) => {
	const token = req.header('x-auth-token'); //get token

	if (req.user.isAdmin === true) {
		//if user is an admin return all
		const adminResult = await Role.find();
		return res.status(200).send({ token, result: adminResult });
	}
	const userResult = await Role.find().where('title').ne('admin'); //return all and exclude admin role
	res.status(200).send({ token, result: userResult });
});

//VIEW A CREATED ROLE : ALL USER
router.get('/:id', [ tokenAuth ], async (req, res) => {
	const token = req.header('x-auth-token'); //get token
	const userAdminResult = await Role.findOne({ _id: req.params.id });

	if (req.user.isAdmin) {
		if (userAdminResult) {
			return res.status(200).send({ token, result: userAdminResult });
		} else {
			return res.status(404).send({ token, result: { Error: 404, message: 'Role not available' } });
		}
	}

	const userResult = await Role.findOne({ _id: req.params.id }).where('title').ne('admin');

	if (!userResult) return res.status(404).send({ token, result: { Error: 404, message: 'Role not available' } });
	res.status(200).send({ token, result: userResult });
});

//EDIT ROLE : ADMIN
router.put('/:id', [ authId, tokenAuth, adminAuth ], async (req, res) => {
	const token = req.header('x-auth-token'); //get token
	//check admin login* & check idvalidity [authId, tokenAuth, adminAuth]
	//update or 404
	//check for role
	const roleCheck = await Role.findOne({ _id: req.params.id });
	if (!roleCheck) return res.status(404).send({ token, result: { Error: 404, message: 'Role Does not exist' } });
	//get available value
	
	const updatedRole = await Role.findOneAndUpdate(
		{ _id: req.params.id },
		{
			$set : {
				title : req.body.title,
			},
		},
		{ new: true },
	);

	res.status(200).send({ token, result: updatedRole });
});

//DELETE ROLE : ADMIN
router.delete('/:id', [ tokenAuth, authId, adminAuth ], async (req, res) => {
	const token = req.header('x-auth-token'); //get token
	await Role.findOneAndDelete({ _id: req.params.id });
	res.status(200).send({ token, result: { Success: 200, message: 'Role successfully deleted' } });
});

module.exports = router;
