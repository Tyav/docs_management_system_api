import 'babel-polyfill';
import mongoose from 'mongoose';
import { app } from '../../index';
import request from 'supertest';
import { User } from '../../server/model/user';
import { Role } from '../../server/model/role';
import { Category } from '../../server/model/category';
import { Document } from '../../server/model/document';
import bcrypt from 'bcrypt';

Document.deleteMany({});
Category.deleteMany({});
User.deleteMany({});
Role.deleteMany({});

describe('Test for User', () => {
	let role1 = new Role({
		title: 'regular1',
	});
	role1.save();
	const roleId = role1._id.toHexString()

	let payload = {
		username: 'testUserName',
		name: {
			firstName: 'testFirstName',
			lastName: 'testLastName',
		},
		email: 'test@test.com',
		password: 'testPassword',
		roleId: roleId,
	};
	afterAll(() => {
		Role.deleteMany({});
	}, 50000);
	describe('/GET all users only by admin', () => {
		let adminToken;
		let loginToken;
		//await User.create(payload);
		let useradmin = new User({
			username: 'testAdmin1',
			name: {
				firstName: 'testFirstName1',
				lastName: 'testLastName1',
			},
			email: 'admin@test.com',
			password: 'test1Password',
			roleId: roleId,
		});
		adminToken = useradmin.generateAuthToken(true, true);
		let regular = new User();
		loginToken = regular.generateAuthToken(true);
		afterEach(async () => {
			await User.deleteMany({});
		}, 50000);

		it(
			'should return a 200 status and all users for admin',
			async () => {
				const res = await request(app).get('/api/users').set('x-auth-token', adminToken);
				//console.log(res.body)
				expect(res.statusCode).toBe(200);
			},
			50000,
		);
		it(
			'should return a 401 status if not logged in',
			async () => {
				const res = await request(app).get('/api/users');
				expect(res.statusCode).toBe(401);
			},
			50000,
		);
		it(
			'should return a 403 status if not admin',
			async () => {
				const res = await request(app).get('/api/users').set('x-auth-token', loginToken);
				expect(res.statusCode).toBe(403);
			},
			50000,
		);
		it(
			'should return a 400 status if token is invalid',
			async () => {
				const res = await request(app).get('/api/users').set('x-auth-token', 'loginToken');
				expect(res.statusCode).toBe(400);
			},
			50000,
		);
	});
	describe('/GET single user by id', () => {
		let user = new User(payload);

		beforeAll(() => {
			user.save();
		});
		afterAll(async () => {
			await User.deleteMany({});
		});
		it(
			'should return a user with a given id',
			async () => {
				const res = await request(app).get(`/api/users/${user._id}`);
				expect(res.body).toHaveProperty('email', user.email);
				expect(res.body).toHaveProperty('username', user.username);
			},
			50000,
		);
		it(
			'should return a 400 status if invalid id is given',
			async () => {
				const res = await request(app).get(`/api/users/${342}`);
				expect(res.status).toBe(400);
			},
			50000,
		);
		it(
			'should return an INVALID ID error message if invalid id is given',
			async () => {
				const res = await request(app).get(`/api/users/${342}`);
				expect(res.body.message).toBe('Invalid Id');
			},
			50000,
		);
		it(
			'should return a 404 status amd User not found error message if id has not been assigned to user',
			async () => {
				const res = await request(app).get(`/api/users/${mongoose.Types.ObjectId()}`);
				expect(res.body.message).toBe('User not found');
				expect(res.status).toBe(404);
			},
			50000,
		);

	});
	describe('/POST create user', () => {
		afterEach(async() => {
			await User.deleteMany({});
		});
		it(
			'should create a user and return a status of 201 if created',
			async () => {
				const res = await request(app).post('/api/users/').send(payload);
				expect(res.status).toBe(201);
			},
			50000,
		);
		it(
			'should create a user and return the user object if successful',
			async () => {
				const res = await request(app).post('/api/users/').send(payload);
				expect(res.body).toHaveProperty('username', payload.username);
			},
			50000,
		);
		it(
			'should not return the user password if created',
			async () => {
				const res = await request(app).post('/api/users/').send(payload);
				expect(res.body).not.toHaveProperty('password', payload.password);
			},
			50000,
		);
		it(
			'should return a 400 if a data does not meet the input/creation requirements',
			async () => {
				let failedPayload = {
					//username is omitted
					name: {
						firstName: 'testFirstName1',
						lastName: 'testLastName1',
					},
					email: 'test1@test.com',
					password: 'test1Password',
					roleId: roleId,
				};
				const res = await request(app).post('/api/users/').send(failedPayload);
				expect(res.status).toBe(400);
				expect(res.body.message).toBe(`"username" is required`);
			},
			50000,
		);
		it(
			'should return a 404 error if roleId does not belong an exist role',
			async () => {
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
			},
			50000,
		);
		it(
			'should check that username is unique or return 400',
			async () => {
				let payload2 = {
					username: 'testUserName',
					name: {
						firstName: 'testFirstName1',
						lastName: 'testLastName1',
					},
					email: 'test1@test.com',
					password: 'test1Password',
					roleId: roleId,
				};
				let payload1 = {
					username: 'testUserName',
					name: {
						firstName: 'testFirstName1',
						lastName: 'testLastName1',
					},
					email: 'test12@test.com',
					password: 'test1Password',
					roleId: roleId,
				};
				await request(app).post('/api/users/').send(payload2);
				const res = await request(app).post('/api/users/').send(payload1);
				expect(res.status).toBe(400);
				expect(res.body.message).toBe('Username is taken');
			},
			50000,
		);
		it(
			'should check that username is unique or return 400',
			async () => {
				let payload3 = {
					username: 'testUserName1',
					name: {
						firstName: 'testFirstName1',
						lastName: 'testLastName1',
					},
					email: 'test1@test.com',
					password: 'test1Password',
					roleId: roleId,
				};
				let payload1 = {
					username: 'testUserName2',
					name: {
						firstName: 'testFirstName1',
						lastName: 'testLastName1',
					},
					email: 'test1@test.com',
					password: 'test1Password',
					roleId: roleId,
				};
				await request(app).post('/api/users/').send(payload3);
				const res = await request(app).post('/api/users/').send(payload1);
				expect(res.status).toBe(400);
				expect(res.body.message).toBe('Email is already in use');
			},
			50000,
		);
	});
	describe('/PUT :Edit User information', () => {
		let user, user2;
		let editToken, editToken2;
		beforeEach(async () => {
			const salt = await bcrypt.genSalt(10);
			const testPassword = await bcrypt.hash('test1Password', salt);
			user = new User({
				username: 'testUserName2',
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test1@test.com',
				password: testPassword,
				roleId: roleId,
			});
			user2 = new User({
				username: 'testUserName',
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test@test.com',
				password: testPassword,
				roleId: roleId,
			});
			editToken = user.generateAuthToken(true);
			editToken2 = user2.generateAuthToken(true);

			await user.save();
			await user2.save();
		});
		afterEach(async() => {
			await User.deleteMany({})
		});
		it(
			'should return an INVALID ID error message if invalid id is given',
			async () => {
				const res = await request(app).put(`/api/users/${342}`);
				expect(res.body.message).toBe('Invalid Id');
			},
			50000,
		);
		it(
			'should return a 401 status code if edit is performed by User not logged in',
			async () => {
				const res = await request(app).put(`/api/users/${user._id}`);
				expect(res.status).toBe(401);
			},
			50000,
		);
		it(
			'should return a 403 status code if edit is not performed by id owner',
			async () => {
				const res = await request(app).put(`/api/users/${user._id}`).set('x-auth-token', editToken2);
				expect(res.status).toBe(403);
			},
			50000,
		);
		it(
			'should return a 400 status code if edit parameters do not meet requirement',
			async () => {
				const res = await request(app)
					.put(`/api/users/${user._id}`)
					.send({
						name: {
							firstName: 'test',
							lastName: 't',
						},
						password: 'te',
					})
					.set('x-auth-token', editToken)
					.set('Accept', 'application/json');
				expect(res.status).toBe(400);
			},
			50000,
		);
		it(
			'should return a 200 status code if edit is performed successfully',
			async () => {
				const res = await request(app)
					.put(`/api/users/${user._id}`)
					.send({
						name: {
							firstName: 'testFirstName1',
							lastName: 'testLastName1',
						},
						password: 'test1Password',
					})
					.set('x-auth-token', editToken)
					.set('Accept', 'application/json');
				expect(res.status).toBe(200);
			},
			50000,
		);
		it(
			'should return a user object if edit is successfully performed by id owner',
			async () => {
				const res = await request(app)
					.put(`/api/users/${user._id}`)
					.set('x-auth-token', editToken)
					.send({
						name: {
							firstName: 'testFirstName1',
						},
						password: 'test1Password',
					})
					.set('Accept', 'application/json');
				expect(res.body).toHaveProperty('username', user.username);
				expect(res.body).toHaveProperty('email', user.email);
			},
			50000,
		);
		it(
			'should return 400 error status if wrong password is supplyed for change of password',
			async () => {
				const res = await request(app)
					.put(`/api/users/${user._id}`)
					.set('x-auth-token', editToken)
					.send({
						password: 'test1Passwor',
						newPassword: 'newTestPassword',
					})
					.set('Accept', 'application/json');

				expect(res.status).toBe(400);
			},
			50000,
		);
		it(
			'should change the password if newPassword is specified',
			async () => {
				await request(app)
					.put(`/api/users/${user._id}`)
					.set('x-auth-token', editToken)
					.send({
						password: 'test1Password',
						newPassword: 'newTestPassword',
					})
					.set('Accept', 'application/json');
				const testUser = await User.findById(user._id);
				const result = await bcrypt.compare('newTestPassword', testUser.password);

				expect(result).toBeTruthy();
			},
			50000,
		);
	});
	describe('/DELETE a user', () => {
		let user, user2;
		let editToken, editToken2;
		beforeEach(async () => {
			user = new User({
				username: 'testUserName2',
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test1@test.com',
				password: 'test1Password',
				roleId: roleId,
			});
			user2 = new User({
				username: 'testUserName',
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test@test.com',
				password: 'test1Password',
				roleId: roleId,
			});
			editToken = user.generateAuthToken(true);
			editToken2 = user2.generateAuthToken(true);

			await user.save();
			await user2.save();
		});
		afterEach(async () => {
			await User.deleteMany({})
		});

		it(
			'should return 401 status code if user is not logged in',
			async () => {
				const res = await request(app).delete(`/api/users/${user._id}`);
				expect(res.status).toBe(401);
			},
			50000,
		);
		it(
			'should return 403 if logged in user is not the user owner of the account',
			async () => {
				const res = await request(app).delete(`/api/users/${new mongoose.Types.ObjectId()}`).set('x-auth-token', editToken);
				expect(res.status).toBe(403);
			},
			50000,
		);
		it(
			'should return 200 status if logged in user is the user owner of the account',
			async () => {
				const res = await request(app).delete(`/api/users/${user2._id}`).set('x-auth-token', editToken2);
				expect(res.status).toBe(200);
			},
			50000,
		);
	});
	describe('/POST logout', () => {
		let user, user2;
		let editToken, editToken2;
		beforeEach(async () => {
			user = new User({
				username: 'testUserName2',
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test1@test.com',
				password: 'test1Password',
				roleId: roleId,
			});
			user2 = new User({
				username: 'testUserName',
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test@test.com',
				password: 'test1Password',
				roleId: roleId,
			});
			editToken = user.generateAuthToken();
			editToken2 = user2.generateAuthToken(true);

			await user.save();
			await user2.save();
		});
		afterEach(async() => {
			await User.deleteMany({})
		});
		it(
			'should return a 401 status if user is already logged out',
			async () => {
				const res = await request(app).post('/api/users/logout').set('x-auth-token', editToken);
				expect(res.status).toBe(401);
			},
			50000,
		);
		it(
			'should delete token if user is logged in',
			async () => {
				const res = await request(app).post('/api/users/logout').set('x-auth-token', editToken2);
				expect(res.header['x-auth-token']).not.toBeDefined();
			},
			50000,
		);
		it(
			'should return a 200 status if user is successfully logged out',
			async () => {
				const res = await request(app).post('/api/users/logout').set('x-auth-token', editToken2);
				expect(res.status).toBe(200);
			},
			50000,
		);
	});
	describe('/POST login user', () => {
		let user, user2;
		let editToken, editToken2;
		beforeEach(async () => {
			const salt = await bcrypt.genSalt(10);
			const testPassword = await bcrypt.hash('test1Password', salt);
			user = new User({
				username: 'testUserName2',
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test1@test.com',
				password: testPassword,
				roleId: roleId,
			});
			user2 = new User({
				username: 'testUserName',
				name: {
					firstName: 'testFirstName1',
					lastName: 'testLastName1',
				},
				email: 'test@test.com',
				password: testPassword,
				roleId: roleId,
			});
			editToken = user.generateAuthToken();
			editToken2 = user2.generateAuthToken(true);

			await user.save();
			await user2.save();
		});
		afterEach(async() => {
			await User.deleteMany({})
		});
		it(
			'should return a 401 status if user is already logged in',
			async () => {
				const res = await request(app).post('/api/users/login').set('x-auth-token', editToken2);
				expect(res.status).toBe(401);
			},
			50000,
		);
		it(
			'should return a 400 status if user login details',
			async () => {
				const res = await request(app).post('/api/users/login').send({
					username: 't',
					password: 'test1',
				});
				expect(res.status).toBe(400);
			},
			50000,
		);
		it(
			'should return a 400 status if user email does not match any in the db',
			async () => {
				const res = await request(app).post('/api/users/login').send({
					username: 'wrongTestUserName',
					password: 'test1Password',
				});
				expect(res.status).toBe(400);
				expect(res.body.message).toBe('Wrong Username or Password');
			},
			50000,
		);
		it(
			'should return a 400 status if user password is wrong',
			async () => {
				const res = await request(app).post('/api/users/login').send({
					username: 'testUserName',
					password: 'wrongTest1Password',
				});
				expect(res.status).toBe(400);
				expect(res.body.message).toBe('Wrong Username or Password');
			},
			50000,
		);
		it(
			'should return a 200 status if user is successfully logged in',
			async () => {
				const res = await request(app).post('/api/users/login').send({
					username: 'testUserName',
					password: 'test1Password',
				});
				expect(res.status).toBe(200);
			},
			50000,
		);
	});
});
