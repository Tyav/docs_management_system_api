import 'babel-polyfill';
import mongoose from 'mongoose';
import { server } from '../../index';
import request from 'supertest';
import { User } from '../../server/model/user';
import { Role } from '../../server/model/role';
let app;
describe('Test for User', () => {
	let role = new Role({
		title: 'regular',
	});
	role.save();

	let payload = [
		{
			username: 'testUserName',
			name: {
				firstName: 'testFirstName',
				lastName: 'testLastName',
			},
			email: 'test@test.com',
			password: 'testPassword',
			roleId: role._id,
		},
		{
			username: 'testUserName1',
			name: {
				firstName: 'testFirstName1',
				lastName: 'testLastName1',
			},
			email: 'test1@test.com',
			password: 'test1Password',
			roleId: role._id,
		},
	];
	beforeEach(async () => {
		await server.close();
		app = server;
	});
	afterEach(async () => {
		await app.close();
		await User.deleteMany({});
	});
	afterAll(async () => {
		await Role.deleteMany({});
	});
	describe('GET all users', () => {
		beforeEach(async () => {
			await User.insertMany(payload);
		});

		it('should return a 200 status', async () => {
			const res = await request(app).get('/api/users');
			expect(res.statusCode).toBe(200);
		});
		it('should return two user objects', async () => {
			const res = await request(app).get('/api/users');
			expect(res.body.length).toBe(2);
		});
	});
	describe('/GET single user by id', () => {
		let user;
		beforeEach(async () => {
			user = await User.create(payload[0]);
		});
		it('should return a user with a give id', async () => {
			const res = await request(app).get(`/api/users/${user._id}`);
			expect(res.body).toHaveProperty('email', payload[0].email);
			expect(res.body).toHaveProperty('username', payload[0].username);
		});
		it('should return a 400 status if invalid id is given', async () => {
			const res = await request(app).get(`/api/users/${342}`);
			expect(res.status).toBe(400);
		});
		it('should return an INVALID ID error message if invalid id is given', async () => {
			const res = await request(app).get(`/api/users/${342}`);
			expect(res.body.message).toBe('Invalid Id');
		});
	});
	describe('/POST create user', () => {
		it('should create a user and return a status of 201 if created', async () => {
			const res = await request(app).post('/api/users/').send(payload[0]);
			expect(res.status).toBe(201);
		});
		it('should create a user and return the user object if successful', async () => {
			const res = await request(app).post('/api/users/').send(payload[0]);
			expect(res.body).toHaveProperty('username', payload[0].username);
		});
		it('should not return the user password if created', async () => {
			const res = await request(app).post('/api/users/').send(payload[0]);
			expect(res.body).not.toHaveProperty('password', payload[0].password);
		});
		it('should return a 400 if a data does not meet the input/creation requirements', async () => {
			let failedPayload = {
				//username is omitted
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test1@test.com',
				password: 'test1Password',
				roleId: role._id,
			};
			const res = await request(app).post('/api/users/').send(failedPayload);
			expect(res.status).toBe(400);
			expect(res.body.message).toBe(`"username" is required`);
		});
		it('should return a 404 error if roleId does not belong an exist role', async () => {
			let failedPayload = {
				username: 'testUserName',
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test1@test.com',
				password: 'test1Password',
				roleId: new mongoose.Types.ObjectId().toHexString(),
			};
			const res = await request(app).post('/api/users/').send(failedPayload);
			expect(res.status).toBe(400);
			expect(res.body.message).toBe('Invalid Role Id');
		});
		it('should check that username is unique or return 400', async () => {
			let payload = {
				username: 'testUserName',
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test1@test.com',
				password: 'test1Password',
				roleId: role._id,
			};
			let payload1 = {
				username: 'testUserName',
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test12@test.com',
				password: 'test1Password',
				roleId: role._id,
			};
			await User.create(payload);
			const res = await request(app).post('/api/users/').send(payload1);
			expect(res.status).toBe(400);
			expect(res.body.message).toBe('Username is taken');
		});
		it('should check that username is unique or return 400', async () => {
			let payload = {
				username: 'testUserName1',
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test1@test.com',
				password: 'test1Password',
				roleId: role._id,
			};
			let payload1 = {
				username: 'testUserName2',
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test1@test.com',
				password: 'test1Password',
				roleId: role._id,
			};
			await User.create(payload);
			const res = await request(app).post('/api/users/').send(payload1);
			expect(res.status).toBe(400);
			expect(res.body.message).toBe('Email is already in use');
		});
	});
});
