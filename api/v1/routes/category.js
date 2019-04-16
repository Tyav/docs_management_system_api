import express from 'express';
import { Role } from '../../../server/model/role';
import { validateRole } from '../../../server/validations/role';
import adminAuth from '../utils/admin';
import tokenAuth from '../utils/auth';
import loginAuth from '../utils/isLogin';
import ifLogin from '../utils/ifLogin';
import { authId } from '../utils/validateId';

const router = express.Router();

router.post('/',[tokenAuth, adminAuth], (req, res)=>{

    //user should be logged in
    //user must be an admin,
    //valdation of category, return 400 if error
    //create category 200
    //if duplication error return 400(dulicate error)
    res.status(201).send()
})


  //CREATE CATEGORY
  //GET ALL CATEGORIES
  //GET CATEGORY BY ID
  //DELETE CATEGORY


module.exports = router