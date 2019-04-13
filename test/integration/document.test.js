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
	let veteranRole;
	let adminUser;
	let regularUser;
	let veteranUser;
	let regularUser3;
	let scifi;
	let isLogin;
	let isLogin2;
	let isLogin3;
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
	veteranRole = new Role({
		title: 'veteran',
	});
	veteranRole.save();
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
	});
	adminUser.save();
	isAdmin = adminUser.generateAuthToken(true, true);
	regularUser = new User({
		username: 'reg1UserName',
		name: {
			firstName: 'testFirstName',
			lastName: 'testLastName',
		},
		email: 'test1@test.com',
		password: 'reg1Password',
		roleId: regularRole._id,
	});
	regularUser.save();
	isLogin = regularUser.generateAuthToken(true);
	regularUser3 = new User({
		username: 'reg3UserName',
		name: {
			firstName: 'testFirstName',
			lastName: 'testLastName',
		},
		email: 'test3@test.com',
		password: 'reg1Password',
		roleId: regularRole._id,
	});
	regularUser3.save();
	isLogin3 = regularUser3.generateAuthToken(true);

	veteranUser = new User({
		username: 'reg2UserName',
		name: {
			firstName: 'testFirstName',
			lastName: 'testLastName',
		},
		email: 'reg2@test.com',
		password: 'testPassword',
		roleId: veteranRole._id,
	});
	veteranUser.save();
	isLogin2 =veteranUser.generateAuthToken(true)

	beforeEach(async () => {
		//app = server;
	});
	afterEach(async () => {
		//await app.close();
	});
	afterAll(async () => {
		await Document.deleteMany({});
		await Category.deleteMany({});
		await User.deleteMany({});
		await Role.deleteMany({});
	});

	describe('/POST: CREATE DOCUMENT', () => {
		afterEach(async () => {
			await Document.deleteMany({});
		});
		it(
			'should create a document: /api/documents',
			async () => {
				await request(app).post('/api/documents/').set('x-auth-token', isLogin).send({
					title: 'testDoc',
					content: 'I am a basic test doc',
					access: 'public',
					categoryId: scifi._id,
				});
				const docs = await Document.findOne({ title: 'testDoc' });
				expect(docs).toHaveProperty('title', 'testDoc');
			},
			50000,
		);
		it(
			'should return document object and status code of 200',
			async () => {
				const res = await request(app).post('/api/documents/').set('x-auth-token', isLogin).send({
					title: 'testDoc',
					content: 'I am a basic test doc',
					access: 'public',
					categoryId: scifi._id,
				});
				expect(res.body).toHaveProperty('title', 'testDoc');
				expect(res.status).toBe(200);
			},
			50000,
		);
		it(
			'should assign a role property to the document if access is set to role',
			async () => {
				const res = await request(app).post('/api/documents/').set('x-auth-token', isLogin).send({
					title: 'testDoc',
					content: 'I am a basic test doc',
					access: 'role',
					categoryId: scifi._id,
				});
				expect(res.body.role).toBe(regularUser.roleId.toHexString());
				expect(res.status).toBe(200);
			},
			50000,
		);
		it(
			'should return 401 if user is not logged in',
			async () => {
				const res = await request(app).post('/api/documents/').send({
					title: 'testDoc',
					content: 'I am a basic test doc',
					access: 'public',
					categoryId: scifi._id,
				});
				expect(res.status).toBe(401);
			},
			50000,
		);
		it(
			'should return 400 if users inputs are wrong',
			async () => {
				const res = await request(app).post('/api/documents/').set('x-auth-token', isLogin).send({
					title: '',
					content: 'I am a basic test doc',
					access: 'public',
					categoryId: scifi._id,
				});
				expect(res.status).toBe(400);
			},
			50000,
		);
		it(
			'created document should have a created date',
			async () => {
				const res = await request(app).post('/api/documents/').set('x-auth-token', isLogin).send({
					title: 'test',
					content: 'I am a basic test doc',
					access: 'public',
					categoryId: scifi._id,
				});
				expect(res.body.createdAt).toBeDefined();
			},
			50000,
		);
		it(
			'created document should be set to public by default if not specified',
			async () => {
				const res = await request(app).post('/api/documents/').set('x-auth-token', isLogin).send({
					title: 'test',
					content: 'I am a basic test doc',
					categoryId: scifi._id,
				});
				expect(res.body.access).toBe('public');
			},
			50000,
		);
	});
	describe('/GET: all documents', () => {
		beforeAll(() => {
			let docPayload = [
				{
					title: 'testDoc1',
					content: 'I am a basic test doc',
					creatorId: regularUser._id,
					access: 'public',
					categoryId: scifi._id,
				},
				{
					title: 'testDoc2',
					content: 'I am a basic test doc2',
					creatorId: regularUser._id,
					access: 'private',
					categoryId: scifi._id,
				},
				{
					title: 'testDoc3',
					content: 'I am a basic test doc3',
					creatorId: regularUser._id,
					access: 'role',
					categoryId: scifi._id,
					role: regularUser.roleId
				},
				{
					title: 'testDoc4',
					content: 'I am a basic test doc4',
					creatorId: veteranUser._id,
					access: 'role',
					categoryId: scifi._id,
					role: veteranUser.roleId
				},


			];
			Document.insertMany(docPayload, { ordered: false }).catch((err) => {});
		});
		it(
			'should return all documents if request is made by an admin',
			async () => {
				const res = await request(app).get('/api/documents/').set('x-auth-token', isAdmin);
				expect(res.body.length).toBe(4);
			},
			50000,
		);
		it(
			'should return all only documents that a public and created by the logged in user if not admin',
			async () => {
				const res = await request(app).get('/api/documents/').set('x-auth-token', isLogin);
				expect(res.body.length).toBe(3);
			},
			50000,
		);
		it(
			'should return documents with access as role and if creator is has same role as user',
			async () => {
				const res = await request(app).get('/api/documents/').set('x-auth-token', isLogin2);
				expect(res.body.length).toBe(2);
			},
			50000,
		);

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
