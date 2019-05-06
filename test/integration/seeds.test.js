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
    it('should return a created status 201 if successful', async() => {
      let res = await request(app).post('/api/seed/users')
      expect(res.status).toBe(201);
    });
    //return a success message on creation
    //should create a collection of users and admins
    //should use a default creation amount for users if not provided
    //should use a default creation amount for admins if not provided
    //should use a default password for users if not provided
    //should use a default password for admins if not provided
    //should clear the seeding users database and recreate a new database
  });
  //POST for documents
});