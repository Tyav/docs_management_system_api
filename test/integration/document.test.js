import 'babel-polyfill';
import { app } from '../../index';
import mongoose from 'mongoose';
import request from 'supertest';
import { Document } from '../../server/model/document';
import { Category } from '../../server/model/category';
import { User } from '../../server/model/user';
import { Role } from '../../server/model/role';
//let app;
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
	isLogin2 = veteranUser.generateAuthToken(true);

	// beforeEach(async () => {
	// 	//app = server;
	// });
	// afterEach(async () => {
	// 	//await app.close();
	// });
	afterAll(async () => {
		await Document.deleteMany({});
		await Category.deleteMany({});
		await User.deleteMany({});
		await Role.deleteMany({});
	});

	describe('/POST: CREATE DOCUMENT', () => {
		afterEach(() => {
			Document.deleteMany({});
		});
		afterAll(async () => {
			await Document.deleteMany({});
		});
		it(
			'should create a document: /api/documents',
			async () => {
				const res = await request(app).post('/api/documents/').set('x-auth-token', isLogin).send({
					title: 'testDoc1',
					content: 'I am a basic test doc1',
					access: 'public',
					categoryId: scifi._id,
				});
				const docs = await Document.findOne({ title: 'testDoc1' });
				expect(docs).toHaveProperty('title', 'testDoc1');
			},
			50000,
		);
		it(
			'should return document object and status code of 200',
			async () => {
				const res = await request(app).post('/api/documents/').set('x-auth-token', isLogin).send({
					title: 'testDoc2',
					content: 'I am a basic test doc2',
					access: 'public',
					categoryId: scifi._id,
				});
				expect(res.body).toHaveProperty('title', 'testDoc2');
				expect(res.status).toBe(200);
			},
			50000,
		);
		it(
			'should assign a role property to the document if access is set to role',
			async () => {
				const res = await request(app).post('/api/documents/').set('x-auth-token', isLogin).send({
					title: 'testDoc3',
					content: 'I am a basic test doc3',
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
					title: 'testDoc4',
					content: 'I am a basic test doc4',
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
					content: 'I am a basic test doc5',
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
					content: 'I am a basic test doc6',
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
					title: 'test7',
					content: 'I am a basic test doc7',
					categoryId: scifi._id,
				});
				expect(res.body.access).toBe('public');
			},
			50000,
		);
	});
	describe('/GET: GET ALL DOCUMENTS', () => {
		beforeAll(() => {
			let docPayload = [
				{
					title: 'testDoc1',
					content: 'I am a basic test doc',
					creatorId: regularUser._id,
					access: 'public',
					categoryId: scifi._id,
					publishDate: '4-4-2020',
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
					role: regularUser.roleId,
					publishDate: '4-4-1990',
				},
				{
					title: 'testDoc4',
					content: 'I am a basic test doc4',
					creatorId: veteranUser._id,
					access: 'role',
					categoryId: scifi._id,
					role: veteranUser.roleId,
					publishDate: '7-7-2019',
				},
			];
			Document.insertMany(docPayload, { ordered: false }).catch((err) => {});
		});
		afterAll(() => {
			Document.deleteMany({});
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
		it(
			'should return a given number of documents by query if requested',
			async () => {
				const res = await request(app).get('/api/documents/?pageNumber=1&pageSize=2').set('x-auth-token', isAdmin);
				expect(res.body.length).toBe(2);
			},
			50000,
		);
		it(
			'should return documents sorted by published date',
			async () => {
				const res = await request(app).get('/api/documents/').set('x-auth-token', isAdmin);
				expect(res.body[0].title).toBe('testDoc3');
			},
			50000,
		);
	});
	describe('GET: GET DOCUMENT BY ID', () => {
		let publicDoc1;
		let privateDoc1;
		let roleDoc1;
		let roleDoc2;
		beforeAll(() => {
			publicDoc1 = new Document({
				title: 'testDoc5',
				content: 'I am a basic test doc5',
				creatorId: regularUser._id,
				access: 'public',
				categoryId: scifi._id,
			});
			publicDoc1.save();
			privateDoc1 = new Document({
				title: 'testDoc10',
				content: 'I am a basic test doc10',
				creatorId: regularUser._id,
				access: 'private',
				categoryId: scifi._id,
			});
			privateDoc1.save();
			roleDoc1 = new Document({
				title: 'testDoc9',
				content: 'I am a basic test doc9',
				creatorId: regularUser._id,
				access: 'role',
				categoryId: scifi._id,
				role: regularUser.roleId,
			});
			roleDoc1.save();
			roleDoc2 = new Document({
				title: 'testDoc8',
				content: 'I am a basic test doc8',
				creatorId: veteranUser._id,
				access: 'role',
				categoryId: scifi._id,
				role: veteranUser.roleId,
			});
			roleDoc2.save();
		});
		it(
			'should return the document with the given ID',
			async () => {
				const res = await request(app).get(`/api/documents/${roleDoc1._id}`).set('x-auth-token', isAdmin);
				expect(res.body._id).toBe(roleDoc1._id.toHexString());
			},
			50000,
		);
		it(
			'should return status of 200 if successful',
			async () => {
				const res = await request(app).get(`/api/documents/${roleDoc1._id}`).set('x-auth-token', isAdmin);
				expect(res.status).toBe(200);
			},
			50000,
		);
		it(
			'should return status of 404 if document is not found',
			async () => {
				const res = await request(app).get(`/api/documents/${mongoose.Types.ObjectId()}`).set('x-auth-token', isAdmin);
				expect(res.status).toBe(404);
			},
			50000,
		);
		it(
			'should return status of 401 if user is not logged in',
			async () => {
				const res = await request(app).get(`/api/documents/${mongoose.Types.ObjectId()}`);
				expect(res.status).toBe(401);
			},
			50000,
		);
		it(
			'should return status of 404 if document does not belong to user and it is private',
			async () => {
				const res = await request(app).get(`/api/documents/${privateDoc1._id}`).set('x-auth-token', isLogin3);
				expect(res.status).toBe(404);
			},
			50000,
		);
		it(
			'should return any requested document if user is admin',
			async () => {
				const res = await request(app).get(`/api/documents/${privateDoc1._id}`).set('x-auth-token', isAdmin);
				expect(res.status).toBe(200);
				expect(res.body).toHaveProperty('title', privateDoc1.title)
			},
			50000,
		);
		it(
			'should return a 404 if documents access is role and user does not belong to the set role',
			async () => {
				const res = await request(app).get(`/api/documents/${roleDoc1._id}`).set('x-auth-token', isLogin2);
				expect(res.status).toBe(404);
				expect(res.body).toBe(null)
			},
			50000,
		);
	});

	//GET: GET DOCUMENT BY ID

	//PUT: EDIT A DOCUMENT

	//DELETE: DELETE DOCUMENT
});
