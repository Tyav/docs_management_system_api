import 'babel-polyfill';
import { server } from '../../index';
import request from 'supertest';
import { User } from '../../server/model/user';
import mongoose from 'mongoose';

let app;
describe('Test for User', () => {
	beforeEach(() => {
		app = server;
	});
	afterEach(async () => {
		await app.close();
		await User.deleteMany({});
	});

	let userGroup = [
		{
			username: 'testUserName',
			name: {
				firstName: 'testFirstName',
				lastName: 'testLastName',
			},
			email: 'test@test.com',
			password: 'testPassword',
			roleId: new mongoose.Types.ObjectId().toHexString(),
		},
		{
			username: 'testUserName1',
			name: {
				firstName: 'testFirstName1',
				lastName: 'testLastName1',
			},
			email: 'test1@test.com',
			password: 'test1Password',
			roleId: new mongoose.Types.ObjectId().toHexString(),
		},
	];
	describe('GET all users', () => {
		it('should return a 200 status', async () => {
			User.insertMany(userGroup);

			const res = await request(app).get('/api/users');
			expect(res.statusCode).toBe(200);
		});
		it('should return two user objects', async () => {
			User.insertMany(userGroup);

			const res = await request(app).get('/api/users');
			expect(res.body.length).toBe(2);
		});
	});
	describe('/GET single user by id', () => {
		it('should return a user with a give id', async () => {
			const user = await User.create(userGroup[0]);
			const res = await request(app).get(`/api/users/${user._id}`);
			expect(res.body).toMatchObject(userGroup[0]);
		});
		it('should return a 400 status if invalid id is given', async () => {
			const user = await User.create(userGroup[0]);
			const res = await request(app).get(`/api/users/${342}`);
			expect(res.status).toBe(400);
		});
		// it('should return an INVALID ID error message if invalid id is given', async () => {
		// 	const user = await User.create(userGroup[0]);
		// 	const res = await request(app).get(`/api/users/${342}`);
		// 	expect(res.body.message).toBe('Invalid Id');
		// });
	});
});
