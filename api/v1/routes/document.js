import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import { Document } from '../../../server/model/document';
import { validateDoc, validateDocEdit } from '../../../server/validations/document';
import adminAuth from '../utils/admin';
import tokenAuth from '../utils/auth';
import loginAuth from '../utils/isLogin';
import ifLogin from '../utils/ifLogin';
import { authId } from '../utils/validateId';

const router = express.Router();

//POST: CREATE DOCUMENT
router.post('/', [ tokenAuth, loginAuth ], async (req, res) => {
	//CREATE DOCUMENT
	const { error } = validateDoc(req.body);
	if (error) return res.status(400).send({ Error: 'Bad Request', message: error.details[0].message });

	//check if access is set to role then create a role property
	if (req.body.access === 'role') req.body.role = req.user.role;
	//set creatorId of document
	req.body.creatorId = req.user._id;

	const doc = await Document.create(req.body);
	// doc.save();
	res.status(200).send(doc);
});

//GET: GET ALL DOCUMENT and with parameters [pageNumber, pagesize]
router.get('/', [ tokenAuth, loginAuth ], async (req, res) => {
	//verify that user is geniue and logged in with [tokenAuth, loginAuth]

	//get pagination values
	//set pageNumber
	let pageNumber = Number(req.query.pageNumber);
	//set pageSize
	let pageSize = Number(req.query.pageSize);

	if (req.user.isAdmin === true) {
		//check if user is an admin, release all documents
		const adminDocs = await Document.find()
			//set number of values to skip
			.skip((pageNumber - 1) * pageSize)
			//number of values to display
			.limit(pageSize)
			.sort({ publishDate: 1 });
		return res.status(200).send(adminDocs);
	}

	const userDocs = await Document.find()
		//release only public and users private documents and documents set to same role as user
		.or([ { access: 'public' }, { creatorId: req.user._id }, { role: req.user.role } ])
		//set number of values to skip
		.skip((pageNumber - 1) * pageSize)
		//number of values to display
		.limit(pageSize)
		.sort({ publishDate: 1 })
		//select a set of informations to release
		.select('_id title content createdAt creatorId access categoryId');

	res.status(200).send(userDocs);
});

//GET: GET DOCUMENT BY ID
router.get('/:id', [ tokenAuth, loginAuth ], async (req, res) => {
	if (req.user.isAdmin === true) {
		const adminDoc = await Document.findOne({ _id: req.params.id });
		if (!adminDoc) return res.status(404).send({ Error: 404, message: 'Document not found' });
		return res.status(200).send(adminDoc);
	}

	//query the db for the document
	const doc = await Document.findOne({ _id: req.params.id })
		//release only public and users private documents and documents set to same role as user
		.or([ { access: 'public' }, { creatorId: req.user._id }, { role: req.user.role } ])
		//select a set of informations to release
		.select('_id title content createdAt creatorId access categoryId');
	//check if doc exist
	if (!doc) return res.status(404).send({ Error: 404, message: 'Document not found' });
	//check if doc access is private

	res.status(200).send(doc);
});

//PUT: EDIT A DOCUMENT
router.put('/:id', [ tokenAuth, loginAuth ], async (req, res) => {
	//valdate payload
	const { error } = validateDocEdit(req.body);
	//update contents should be validated.
	if (error) return res.status(400).send({ Error: 'Bad Request', message: error.details[0].message });
	//find document
	const doc = await Document.findById(req.params.id);
	//check if doc exist: 404
	if (!doc) return res.status(404).send({ Error: 404, message: 'Document not found' });
	//users can only edit document created by them: fail-401 || success-200
	//check if user is creator
	if (doc.creatorId.toHexString() !== req.user._id) return res.status(401).send({ Error: 401, message: 'Access denied, Not an author' });
	//documents that are edited should have a modified date property: modifiedAt
	const title = req.body.title || doc.title;
	const content = req.body.content || doc.content;
	const creatorId = req.body.creatorId || doc.creatorId;
	const access = req.body.access || doc.access;
	const categoryId = req.body.categoryId || doc.categoryId;
	const createdAt = doc.createdAt;
	const modifiedAt = Date.now();
	const deleted = doc.deleted;
	const publishDate = doc.publishDate;
	const role =

			req.body.access === 'role' ? req.user.role :
			null;
	//Edit document.
	const editDoc = await Document.findOneAndUpdate(
		{ _id: doc._id },
		{
			$set : {
				title,
				content,
				creatorId,
				access,
				categoryId,
				modifiedAt,
				publishDate,
				role,
			},
		},
		{ new: true },
	);
	res.status(200).send(_.pick(editDoc, '_id title content creatorId access categoryId modifiedAt publishDate role'.split(' ')));
});

//DELETE: DELETE DOCUMENT
router.delete('/:id',[tokenAuth, authId],async (req, res) => {
  //401 if user is not logged in & check validity of document Id 404 :[tokenAuth, authId]

  //get document by id if document creator Id is equal to users Id
  const doc = await Document.findOne({_id:req.params.id,creatorId: req.user._id,deleted: false});
  //return 400 if no document
  if (!doc) return res.status(404).send({ Error: 404, message: 'Document not found' })
  //check if user is the document creator else 401
  
  
	//404 if user is not document creator aside admin
	//if document has been soft deleted, return 404 to yes
	//completely delete if action is performed by admin
	//make a soft delete if user is not admin 
	//200 on successful delete
	res.status(200).send({ Error: 200, message: 'Document Deleted' });
});

module.exports = router;
