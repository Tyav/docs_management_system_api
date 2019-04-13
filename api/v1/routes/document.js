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

  const doc = new Document(req.body);
  await doc.save();
  res.status(200).send(doc)
});

//GET: GET ALL DOCUMENT and with parameters [pageNumber, pagesize]
router.get('/',[tokenAuth, loginAuth], async(req, res)=> {
  //verify that user is geniue and logged in with [tokenAuth, loginAuth]

  //get pagination values
  //set pageNumber
  let pageNumber = Number(req.query.pageNumber) || 1;
  //set pageSize
  let pageSize = Number(req.query.pageSize) || 10;

console.log(pageNumber, pageSize)

  if (req.user.isAdmin === true){
    //check if user is an admin, release all documents
    const adminDocs = await Document.find()    
    //set number of values to skip
      .skip((pageNumber - 1) * pageSize)
    //number of values to display
      .limit(pageSize)
;
    return res.status(200).send(adminDocs)
  }


  const userDocs = await Document.find()
    //release only public and users private documents and documents set to same role as user
    .or([{access: 'public'},{creatorId:req.user._id}, {role: req.user.role}])
    //set number of values to skip
    .skip((pageNumber - 1) * pageSize)
    //number of values to display
    .limit(pageSize)

  console.log(userDocs)
  res.status(200).send(userDocs)
})

router.get('/gome/', (req, res)=>{

  let vaue = req.query.hope || 0
  console.log(vaue)
  res.send(typeof req.query.hope)
})
//GET: GET DOCUMENT BY ID

//PUT: EDIT A DOCUMENT

//DELETE: DELETE DOCUMENT

module.exports = router;
const pageNumber = 2;
const pageSize = 10;

		// .find({ author: 'Moses', isPublished: true })
		//.find({price: { $gte : 10, $lte: 20 }})
		//.find({price: {$in: [10, 15, 20] }})
		// .find()
		// .or([{author: 'Moses'},{isPublished: true}])
		// .and([{author: 'Moses'},{isPublished: true}])
		// .find({ author: /^Moses/ })
		// .find({ author: /ses$/i })
		// .find({ author: /.*Moses.*/ })
		// .skip((pageNumber - 1) * pageSize)
		// .limit(pageSize)
		// .sort({ name: 1 })
		// .select({ name: 1, tags: 1 });
		// .count();
