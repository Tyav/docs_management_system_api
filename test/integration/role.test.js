import 'babel-polyfill';
import { app } from '../../index';
import mongoose from 'mongoose';
import request from 'supertest';
import { Document } from '../../server/model/document';
import { Category } from '../../server/model/category';
import { User } from '../../server/model/user';
import { Role } from '../../server/model/role';

describe('TEST FOR ROLE', () => {
  const adminUser = new User({
		username : 'adminUserName',
		name     : {
			firstName : 'testFirstName',
			lastName  : 'testLastName',
		},
		email    : 'admin@test.com',
		password : 'testPassword',
		roleId   : mongoose.Types.ObjectId(),
	});
	adminUser.save();
	const isAdmin = adminUser.generateAuthToken(true, true);
	const regularUser = new User({
		username : 'reg1UserName',
		name     : {
			firstName : 'testFirstName',
			lastName  : 'testLastName',
		},
		email    : 'test1@test.com',
		password : 'reg1Password',
		roleId   : mongoose.Types.ObjectId(),
	});
	regularUser.save();
	const isLogin = regularUser.generateAuthToken(true);


  afterAll(async () => {
		await Document.deleteMany({});
		await Category.deleteMany({});
		await User.deleteMany({});
		await Role.deleteMany({});
	});
  describe('/CREATE: ROLE ONLY BY ADMIN', () => {
    it('should check if user is logged in and return 401', async () => {
      const res = await request(app).post('/api/roles/').send({
        title: 'veteran'
      })
      expect(res.status).toBe(401)
    });
    it('should return 403 if logged in user is not an admin', async () => {
      const res = await request(app).post('/api/roles/').set('x-auth-token', isLogin).send({
        title: 'veteran'
      })
      expect(res.status).toBe(403)
    });

    //check for login 401
    //check for ADMIN 403
    //create role admin, 200
    //role validation 400
  });
  
  //VIEW A CREATED ROLE : ALL USER
  //EDIT ROLE : ADMIN
  //DELETE ROLE : ADMIN
});