import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import { Document } from '../../../server/model/document';
import { Category } from '../../../server/model/category';
import { validateDoc, validateDocEdit } from '../../../server/validations/document';
import adminAuth from '../utils/admin';
import tokenCheck from '../utils/docLog';
import tokenAuth from '../utils/auth';
import loginAuth from '../utils/isLogin';
import ifLogin from '../utils/ifLogin';
import { authId } from '../utils/validateId';

const router = express.Router();

//api/docs?pageNumber=3&pageSize=7
//POST: CREATE DOCUMENT
router.post('/', [ tokenAuth, loginAuth ], async (req, res) => {
	const token = req.header('x-auth-token');
	//CREATE DOCUMENT
	const { error } = validateDoc(req.body);
	if (error) return res.status(400).send({ token,result:{Error: 'Bad Request', message: error.details[0].message }});
	//give a default category of general if not stated
	
	if (!req.body.categoryId){
		 let general = await Category.findOne({title: 'general'});
		 req.body.categoryId = general._id
	}
	//check if access is set to role then create a role property
	if (req.body.access === 'role') req.body.role = req.user.role;
	//set creatorId of document
	req.body.creatorId = req.user._id;

	const doc = await Document.create(req.body);
	let doc1 = await Document.findOne({_id: doc._id})
		.select('_id title content creatorId access categoryId publishDate modifiedAt role likes dislikes createdAt')
		.populate({path:'creatorId', select: '_id username avatar'})
		.populate({path:'categoryId',select: '_id title'})
		.populate({path:'role', select:'_id title'})
	// doc.save();
	res.status(200).send({token, result:doc1});
});

//GET: GET ALL DOCUMENT and with parameters [pageNumber, pagesize]
router.get('/', [ tokenCheck ], async (req, res) => {
	const token = req.header('x-auth-token');
	//verify that user is geniue and logged in with [tokenAuth, loginAuth]
	//get pagination values
	//set pageNumber
	let pageNumber = Number(req.query.pageNumber);
	//set pageSize
	let pageSize = Number(req.query.pageSize);

	if (req.user.isAdmin === true) {
		//set a delete object to fetch all document if delete query is not set
		let deleted = {};
		//if query deleted is set to true, set delete object to fetch only deleted documents
		if (req.query.deleted && req.query.deleted === 'true'){
			deleted = {deleted: true}
		}
		//if query deleted is set to false, set delete object to fetch only non-deleted documents
		if (req.query.deleted && req.query.deleted === 'false'){
			deleted = {deleted: false}
		}

		//check if user is an admin, release all documents
		const adminDocs = await Document.find(deleted)
			.select('_id title content creatorId access categoryId publishDate modifiedAt role likes dislikes createdAt')
			.populate({path:'creatorId', select: '_id username avatar'})
			.populate({path:'categoryId',select: '_id title'})
			.populate({path:'role', select:'_id title'})

			//set number of values to skip
			.skip((pageNumber - 1) * pageSize)
			//number of values to display
			.limit(pageSize)
			.sort({ publishDate: 1 });

			return res.status(200).send({token, result:adminDocs});
	}
	const userDocs = await Document.find({ deleted: false })
		//release only public and users private documents and documents set to same role as user
		.or([ { access: 'public' }, { creatorId: req.user._id }, { role: req.user.role } ])
		//creatorId, categoryId, role
		.select('_id title content creatorId access categoryId publishDate modifiedAt role likes dislikes createdAt')
		.populate({path:'creatorId', select: '_id username avatar'})
		.populate({path:'categoryId',select: '_id title'})
		.populate({path:'role', select:'_id title'})
		//set number of values to skip
		.skip((pageNumber - 1) * pageSize)
		//number of values to display
		.limit(pageSize)
		.sort({ publishDate: 1 })
		//select a set of informations to release
		
	res.status(200).send({token, result:userDocs});
});

//GET: GET DOCUMENT BY ID
router.get('/:id', [ tokenAuth, loginAuth ], async (req, res) => {
	const token = req.header('x-auth-token');
	if (req.user.isAdmin === true) {
		const adminDoc = await Document.findOne({ _id: req.params.id });
		if (!adminDoc) return res.status(404).send({ token,result:{Error: 404, message: 'Document not found' }});
		return res.status(200).send({token, result:adminDoc});
	}

	//query the db for the document
	const doc = await Document.findOne({ _id: req.params.id })
		//release only public and users private documents and documents set to same role as user
		.or([ { access: 'public' }, { creatorId: req.user._id }, { role: req.user.role } ])
		//select a set of informations to release
		.select('_id title content creatorId access categoryId publishDate modifiedAt role likes dislikes createdAt')
		.populate({path:'creatorId', select: '_id username avatar'})
		.populate({path:'categoryId',select: '_id title'})
		.populate({path:'role', select:'_id title'})
	//check if doc exist
	if (!doc) return res.status(404).send({ token,result:{Error: 404, message: 'Document not found' }});
	//check if doc access is private

	res.status(200).send({token, result:doc});
});

//PUT: EDIT A DOCUMENT
router.put('/:id', [ tokenAuth, loginAuth ], async (req, res) => {
	const token = req.header('x-auth-token');
	//valdate payload
	const { error } = validateDocEdit(req.body);
	//update contents should be validated.
	if (error) return res.status(400).send({ token,result:{Error: 'Bad Request', message: error.details[0].message }});
	//find document
	const doc = await Document.findById(req.params.id);
	//check if doc exist: 404
	if (!doc) return res.status(404).send({ token,result:{Error: 404, message: 'Document not found' }});
	//users can only edit document created by them: fail-401 || success-200
	//check if user is creator
	if (doc.creatorId.toHexString() !== req.user._id) return res.status(401).send({ token,result:{Error: 401, message: 'Access denied, Not an author' }});
	//documents that are edited should have a modified date property: modifiedAt
	const title = req.body.title || doc.title;
	const content = req.body.content || doc.content;
	const creatorId = req.body.creatorId || doc.creatorId;
	const access = req.body.access || doc.access;
	const categoryId = req.body.categoryId || doc.categoryId;
	const modifiedAt = Date.now();
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
	)
	.select('_id title content creatorId access categoryId publishDate modifiedAt role likes dislikes createdAt')
	.populate({path:'creatorId', select: '_id username avatar'})
	.populate({path:'categoryId',select: '_id title'})
	.populate({path:'role', select:'_id title'})
;
	res.status(200).send({token, result:editDoc});
});

//DELETE: DELETE DOCUMENT
router.delete('/:id', [ tokenAuth, authId ], async (req, res) => {
	const token = req.header('x-auth-token');
	//401 if user is not logged in & check validity of document Id 404 :[tokenAuth, authId]
	const doc1 = await Document.findOne({ _id: req.params.id, deleted: true });

	//ADMIN
	//completely delete if action is performed by admin
	if (req.user.isAdmin && doc1) {

		await Document.findOneAndDelete({ _id: req.params.id });
		return res.status(200).send({ token,result:{Error: 200, message: 'Document Deleted' }});
	}
	//USER
	//get document by id if document creator Id is equal to users Id, and document is not delete
	const doc = await Document.findOne({ _id: req.params.id, creatorId: req.user._id, deleted: false });
	//return 404 if no document

	if (!doc) return res.status(404).send({ token,result:{Error: 404, message: 'Document not found' }});
	//make a soft delete if user is not admin
	doc.deleted = true;
	doc.save();
	//200 on successful delete
	res.status(200).send({ token, result:{success: 200, message: 'Document Deleted' }});
});

module.exports = router;
