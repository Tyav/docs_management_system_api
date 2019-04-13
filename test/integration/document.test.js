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
		let isLogin;
		let isAdmin;
	
		scifi = new Category({
			title: 'scifi',
		});
		scifi.save();
		action = new Category({
			title: 'action',
		});
		action.save();
		regularRole = new Role({
			title: 'regular',
		});
		regularRole.save();
		adminRole = new Role({
			title: 'admin',
		});
		adminRole.save();
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
		adminUser.save()
		isAdmin = adminUser.generateAuthToken(true, true)
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
		regularUser.save()
		isLogin = regularUser.generateAuthToken(true)
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
		regularUser2.save()

	
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
			await request(app).post('/api/documents/').set('x-auth-token',isLogin).send({
				title: 'testDoc',
				content: 'I am a basic test doc',
				creatorId: regularUser._id,
				access: 'public',
				categoryId: scifi._id
			})
			const docs = await Document.findOne({title: 'testDoc'});
			expect(docs).toHaveProperty('title','testDoc')
		},50000);
		it('should return document object and status code of 200', async() => {
			const res = await request(app).post('/api/documents/').set('x-auth-token',isLogin).send({
				title: 'testDoc',
				content: 'I am a basic test doc',
				creatorId: regularUser._id,
				access: 'public',
				categoryId: scifi._id
			})
			expect(res.body).toHaveProperty('title','testDoc')
			expect(res.status).toBe(200)
		},50000);
		it('should return 401 if user is not logged in', async() => {
			const res = await request(app).post('/api/documents/').send({
				title: 'testDoc',
				content: 'I am a basic test doc',
				creatorId: regularUser._id,
				access: 'public',
				categoryId: scifi._id
			})
			expect(res.status).toBe(401)
		},50000);	
		it('should return 400 if users inputs are wrong', async() => {
			const res = await request(app).post('/api/documents/').set('x-auth-token',isLogin).send({
				title: '',
				content: 'I am a basic test doc',
				creatorId: regularUser._id,
				access: 'public',
				categoryId: scifi._id
			})
			expect(res.status).toBe(400)
		},50000);	
		it('created document should have a created date', async() => {
			const res = await request(app).post('/api/documents/').set('x-auth-token',isLogin).send({
				title: 'test',
				content: 'I am a basic test doc',
				creatorId: regularUser._id,
				access: 'public',
				categoryId: scifi._id
			})
			expect(res.body.createdAt).toBeDefined()
		},50000);	
		it('created document should be set to public by default if not specified', async() => {
			const res = await request(app).post('/api/documents/').set('x-auth-token',isLogin).send({
				title: 'test',
				content: 'I am a basic test doc',
				creatorId: regularUser._id,
				categoryId: scifi._id
			})
			expect(res.body.access).toBe('public')
		},50000);	
	});
	describe('/GET: all documents', () => {
		beforeEach(async ()=>{
			let docPayload = [{
				title: 'testDoc1',
				content: 'I am a basic test doc',
				creatorId: regularUser._id,
				access: 'public',
				categoryId: scifi._id
			},{
				title: 'testDoc2',
				content: 'I am a basic test doc2',
				creatorId: regularUser._id,
				access: 'private',
				categoryId: scifi._id
			}]
			await Document.insertMany(docPayload,{ordered: false}).catch((err=>{}))
		})
		it('should return all documents if request is made by an admin', async() => {
			const res = await request(app).get('/api/documents/').set('x-auth-token', isAdmin)
			expect(res.body.length).toBe(2)
		});
	});
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

