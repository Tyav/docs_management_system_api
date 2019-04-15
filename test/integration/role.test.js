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
    it('should return a 400 if role creation fail by data validation', async() => {
      const res = await request(app).post('/api/roles/').set('x-auth-token', isAdmin).send({
        title: 've'
      })
      const role = await Role.findOne({title: 'veteran'})
      expect(res.status).toBe(400)
    });
    it('logged in admin should create a new role', async() => {
      const res = await request(app).post('/api/roles/').set('x-auth-token', isAdmin).send({
        title: 'veteran'
      })
      const role = await Role.findOne({title: 'veteran'})
      expect(res.status).toBe(200)
      expect(role).toBeDefined()
    });
    it('should return a 400 error on duplicate roles', async() => {
      const res = await request(app).post('/api/roles/').set('x-auth-token', isAdmin).send({
        title: 'veteran'
      })
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Cannot create duplicate role of veteran')
    });
  });
  
  describe('/GET: VIEW ALL CREATED ROLE', () => {
    it('should return a 401 if user is not logged in', async () => {
      const res = await request(app).get('/api/roles/')
      expect(res.status).toBe(401);
    });
    //users must be logged in : 401
    //admin can view all : 200
    //users can view all without admin : 200
  });

  //VIEW A CREATED ROLE : ALL USER
  //EDIT ROLE : ADMIN
  //DELETE ROLE : ADMIN
});