import express from 'express';
import { Role } from '../../../server/model/role';
import { validateCate } from '../../../server/validations/category';
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
    const {error} = validateCate(req.body)
  if (error) return res.status(404).send({Error: 404, message: 'Invalid title format'})
    //create category 200
    //if duplication error return 400(dulicate error)
    res.status(201).send()
})


  //CREATE CATEGORY
  //GET ALL CATEGORIES
  //GET CATEGORY BY ID
  //DELETE CATEGORY


module.exports = router