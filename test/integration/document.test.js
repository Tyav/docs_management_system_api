import 'babel-polyfill';
import { app } from '../../index';
import mongoose from 'mongoose';
import request from 'supertest';
import { Document } from '../../server/model/document';
import { Category } from '../../server/model/category';
import { User } from '../../server/model/user';
import { Role } from '../../server/model/role';
//let app;
Document.deleteMany({});
Category.deleteMany({});
User.deleteMany({});
Role.deleteMany({});

describe('TEST FOR DOCUMENTS', () => {
	let action;
	let adminRole;
	let regularRole;
	let adminUser
	let regularUser
	let regularUser2
	let scifi;
	beforeAll(async ()=>{

		scifi = new Category({
			title: 'scifi',
		});
		await scifi.save();
		action = new Category({
			title: 'action',
		});
		await action.save();
		regularRole = new Role({
			title: 'regular',
		});
		await regularRole.save();
		adminRole = new Role({
			title: 'admin',
		});
		await adminRole.save();
		adminUser = new User({
			username: 'adminUserName',
			name: {
				firstName: 'testFirstName',
				lastName: 'testLastName',
			},
			email: 'admin@test.com',
			password: 'testPassword',
			roleId: adminRole._id,
		})
		await adminUser.save()
		regularUser= new User({
			username: 'reg1UserName',
			name: {
				firstName: 'testFirstName',
				lastName: 'testLastName',
			},
			email: 'test@test.com',
			password: 'reg1Password',
			roleId: regularRole._id,
		})
		await regularUser.save()
		regularUser2= new User({
			username: 'reg2UserName',
			name: {
				firstName: 'testFirstName',
				lastName: 'testLastName',
			},
			email: 'reg2@test.com',
			password: 'testPassword',
			roleId: regularRole._id,
		})
		await regularUser2.save()

	})
	beforeEach(async () => {
		//app = server;
	});
	afterEach(async () => {
		//await app.close();
		await Document.deleteMany({});
	});
	afterAll(async () => {
		await Document.deleteMany({});
		await Category.deleteMany({});
		await User.deleteMany({});
		await Role.deleteMany({})
	});

	describe('/POST: CREATE DOCUMENT', () => {
		beforeEach(() => {});
		it('should create a document: /api/documents', async() => {
			await request(app).post('/api/documents/').send({
				title: 'testDoc',
				content: 'I am a basic test doc',
				creatorId: regularUser._id,
				access: 'public',
				categoryId: scifi._id
			})
			const docs = await Document.findOne({title: 'testDoc'});
			expect(docs).toHaveProperty('title','testDoc')
		},30000);
		it('should return document object and status code of 200', async() => {
			const res = await request(app).post('/api/documents/').send({
				title: 'testDoc',
				content: 'I am a basic test doc',
				creatorId: regularUser._id,
				access: 'public',
				categoryId: scifi._id
			})
			expect(res.body).toHaveProperty('title','testDoc')
			expect(res.status).toBe(200)
		},30000);

	});
	//POST: CREATE DOCUMENT

	//GET: GET ALL DOCUMENT

	//GET: GET DOCUMENT BY ID

	//PUT: EDIT A DOCUMENT

	//DELETE: DELETE DOCUMENT
});
// title: {
// 	type: String,
// 	unique: true,
// 	required: true,
// 	minlength: 1,
// 	maxlength: 255,
// },
// content: {
// 	type: String,
// 	unique: true,
// 	required: true,
// 	minlength: 1,
// 	maxlength: 5000,
// },
// creatorId: {
// 	type: mongoose.Schema.Types.ObjectId,
// 	required: true,
// },
// access: {
// 	type: String,
// 	enum: [ 'public', 'private' ],
// 	required: true,
// },
// categoryId: {
// 	type: mongoose.Schema.Types.ObjectId,
// 	required: true,
// },

