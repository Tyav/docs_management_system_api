import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import { Document } from '../../../server/model/document';
import {validateDoc} from '../../../server/validations/document'
import adminAuth from '../utils/admin';
import tokenAuth from '../utils/auth';
import loginAuth from '../utils/isLogin';
import ifLogin from '../utils/ifLogin';


const router = express.Router();

//POST: CREATE DOCUMENT
router.post('/',[tokenAuth, loginAuth], async (req, res) => {
  //CREATE DOCUMENT
  const {error} = validateDoc(req.body)
  if (error)return res.status(400).send({ Error: 'Bad Request', message: error.details[0].message });

  //check if access is set to role then create a role property
  if (req.body.access === 'role') req.body.role = req.user.role
  //set creatorId of document
  req.body.creatorId = req.user._id

  const doc = await Document.create(req.body);
  // doc.save();
  res.status(200).send(doc)
});

//GET: GET ALL DOCUMENT and with parameters [pageNumber, pagesize]
router.get('/',[tokenAuth, loginAuth], async(req, res)=> {
  //verify that user is geniue and logged in with [tokenAuth, loginAuth]

  //get pagination values
  //set pageNumber
  let pageNumber = Number(req.query.pageNumber);
  //set pageSize
  let pageSize = Number(req.query.pageSize);


  if (req.user.isAdmin === true){
    //check if user is an admin, release all documents
    const adminDocs = await Document.find()    
    //set number of values to skip
      .skip((pageNumber - 1) * pageSize)
    //number of values to display
      .limit(pageSize).sort({ publishDate: 1 })
;
    return res.status(200).send(adminDocs)
  }


  const userDocs = await Document.find()
    //release only public and users private documents and documents set to same role as user
    .or([{access: 'public'},{creatorId:req.user._id}, {role: req.user.role}])
    //set number of values to skip
    .skip((pageNumber - 1) * pageSize)
    //number of values to display
    .limit(pageSize).sort({ publishDate: 1 })
    //select a set of informations to release
    .select('_id title content createdAt creatorId access categoryId')

  res.status(200).send(userDocs)
})

//GET: GET DOCUMENT BY ID
router.get('/:id',[tokenAuth,loginAuth], async (req, res)=>{

  if (req.user.isAdmin === true){
    const adminDoc = await Document.findOne({_id:req.params.id})
    if (!adminDoc) return res.status(404).send({ Error: 404, message: 'Document not found' })
    return res.status(200).send(adminDoc)
  }

  //query the db for the document
  const doc = await Document.findOne({_id:req.params.id})
    //release only public and users private documents and documents set to same role as user
    .or([{access: 'public'},{creatorId:req.user._id}, {role: req.user.role}])
    //select a set of informations to release
    .select('_id title content createdAt creatorId access categoryId');
  //check if doc exist
  console.log(doc)
  if (!doc) return res.status(404).send({ Error: 404, message: 'Document not found' })
  //check if doc access is private

  res.status(200).send(doc)
        

})

//PUT: EDIT A DOCUMENT
router.put('/:id',[tokenAuth,loginAuth],async (req, res)=>{
  
  return
})

//DELETE: DELETE DOCUMENT

module.exports = router;
