import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import { Document } from '../../../server/model/document';

const router = express.Router();

//POST: CREATE DOCUMENT
router.post('/', async (req, res) => {
  //CREATE DOCUMENT
  const doc = new Document(req.body);
  await doc.save();
  res.send()
});

//GET: GET ALL DOCUMENT

//GET: GET DOCUMENT BY ID

//PUT: EDIT A DOCUMENT

//DELETE: DELETE DOCUMENT

module.exports = router;
