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

//GET: GET DOCUMENT BY ID

//PUT: EDIT A DOCUMENT

//DELETE: DELETE DOCUMENT

module.exports = router;
