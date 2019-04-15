import express from 'express';
import { Role } from '../../../server/model/role';
import { validateRole } from '../../../server/validations/role';
import adminAuth from '../utils/admin';
import tokenAuth from '../utils/auth';
import loginAuth from '../utils/isLogin';
import ifLogin from '../utils/ifLogin';
import { authId } from '../utils/validateId';

const router = express.Router();

//CREATE: ROLE ONLY BY ADMIN
router.post('/', [tokenAuth, adminAuth],(req, res)=>{

    //check for login 401 check for ADMIN 403 : [tokenAuth, adminAuth]
    //role validation 400 
    const {error} = validateRole(req.body)
    if (error) return res.status(400).send({ Error: 400, message: error.details[0].message })

    //create role admin, 200
})
//VIEW A CREATED ROLE : ALL USER
//EDIT ROLE : ADMIN
//DELETE ROLE : ADMIN


module.exports = router