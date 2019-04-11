import 'babel-polyfill';
import { server } from '../../index';
import request from 'supertest';
import { User } from '../../server/model/user';
import mongoose from 'mongoose';

let app;
describe('Test for User', () => {
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
		beforeEach(() => {
			app = server;
		});
		afterEach(async () => {
			await app.close();
			await User.deleteMany({});
		});

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
	describe('Name of the group', () => {
		
	});
});
