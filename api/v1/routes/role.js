import express from 'express';
import { Role } from '../../../server/model/role';
import { validateRole } from '../../../server/validations/role';
import adminAuth from '../utils/admin';
import tokenAuth from '../utils/auth';
import loginAuth from '../utils/isLogin';
import ifLogin from '../utils/ifLogin';
import { authId } from '../utils/validateId';

const router = express.Router();

//POST: CREATE ROLE ONLY BY ADMIN
router.post('/', [ tokenAuth, adminAuth ], async(req, res) => {
	//check for login 401 check for ADMIN 403 : [tokenAuth, adminAuth]
	//role validation 400
	const { error } = validateRole(req.body);
	if (error) return res.status(400).send({ Error: 400, message: error.details[0].message });

	//create role admin, 200
	//using trycatch block to handle duplication error
	try {
    const role = await Role.create(req.body)

    res.status(200).send(role)
	} catch (error) {
    res.status(400).send({Error: 400, message: `Cannot create duplicate role of ${req.body.title}`})
	}
});

//GET: VIEW ALL ROLE
router.get('/',[tokenAuth],async (req, res)=>{
  if (req.user.isAdmin === true){//if user is an admin return all
    const adminResult = await Role.find()
    return res.status(200).send(adminResult);
  }
  const userResult = await Role.find().where('title').ne('admin') //return all and exclude admin role
  res.status(200).send(userResult)
})

//VIEW A CREATED ROLE : ALL USER
router.get('/:id', [tokenAuth],async(req, res)=>{
  const userAdminResult = await Role.findOne({_id: req.params.id})

  if (req.user.isAdmin){
    return  userAdminResult ? res.status(200).send(userAdminResult): res.status(404).send({ Error: 404, message: 'Role not available' })
  }

  const userResult = await Role.findOne({_id: req.params.id}).where('title').ne('admin')

  if(!userResult) return res.status(404).send({ Error: 404, message: 'Role not available' })
  res.status(200).send(userResult)
})
//EDIT ROLE : ADMIN
//DELETE ROLE : ADMIN

module.exports = router;
