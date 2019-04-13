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

  const doc = new Document(req.body);
  await doc.save();
  res.status(200).send(doc)
});

//GET: GET ALL DOCUMENT
router.get('/',[tokenAuth, loginAuth], async(req, res)=> {
  //verify that user is geniue and logged in with [tokenAuth, loginAuth]
  if (req.user.isAdmin === true){
    //check if user is an admin, release all documents
    const adminDocs = await Document.find({});
    return res.status(200).send(adminDocs)
  }
  //release only public and users private documents
  const userDocs = await Document.find().or([{access: 'public'},{creatorId:req.user._id}])
  res.status(200).send(userDocs)
})

//GET: GET DOCUMENT BY ID

//PUT: EDIT A DOCUMENT

//DELETE: DELETE DOCUMENT

module.exports = router;
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
