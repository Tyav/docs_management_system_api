import 'babel-polyfill';
import { server } from '../../index';
import request from 'supertest';
import { User } from '../../server/model/user';
import { Role } from '../../server/model/role';

let app;
describe('Test for User', () => {
	let role = new Role({
		title: 'regular'
	})
	console.log(role)

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
	beforeEach(() => {
		app = server;
	});
	afterEach(async () => {
		await app.close();
		await User.deleteMany({});
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
		let user
		beforeEach(async() => {
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
});
