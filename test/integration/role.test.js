import 'babel-polyfill';
import { app } from '../../index';
import mongoose from 'mongoose';
import request from 'supertest';
import { Document } from '../../server/model/document';
import { Category } from '../../server/model/category';
import { User } from '../../server/model/user';
import { Role } from '../../server/model/role';

describe('TEST FOR ROLE', () => {
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
    //check for login 
    //check for ADMIN
    //create role admin, 
  });
  
  //VIEW A CREATED ROLE : ALL USER
  //EDIT ROLE : ADMIN
  //DELETE ROLE : ADMIN
});