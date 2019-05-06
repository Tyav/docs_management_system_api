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

describe('Test for Data Seeding Routes', () => {
	// let role1 = new Role({
	// 	title: 'regular1',
	// });
	// role1.save();
	// const roleId = role1._id.toHexString()

	// let payload = {
	// 	username: 'testUserName',
	// 	name: {
	// 		firstName: 'testFirstName',
	// 		lastName: 'testLastName',
	// 	},
	// 	email: 'test@test.com',
	// 	password: 'testPassword',
	// 	roleId: roleId,
	// };
	afterAll(() => {
		Role.deleteMany({});
	}, 50000);

	describe('POST ROUTE: /users to create users and admins', () => {
    let adminRole
    let userRole
		it('should return a created status 201 if successful', async () => {
			let res = await request(app).post('/api/seed/users');
			expect(res.status).toBe(201);
		});
		it('should create a default collection of users and admins', async () => {
      let res = await request(app).post('/api/seed/users');
      let users = await User.find({})
			expect(users.length).toBe(20);
		});
		it('should use a default creation amount for users if not provided', async () => {
      let res = await request(app).post('/api/seed/users?adminSeed=2');
      userRole = await Role.findOne({title: 'regular'})
      let users = await User.find({roleId: userRole._id})
			expect(users.length).toBe(16);
    });
    it('should use a default creation amount for admins if not provided', async () => {
      let res = await request(app).post('/api/seed/users');
      adminRole = await Role.findOne({title: 'admin'});
      let users = await User.find({roleId: adminRole._id})
			expect(users.length).toBe(4);
		});
	});
	//POST for documents
});
