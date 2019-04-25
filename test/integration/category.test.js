import 'babel-polyfill';
import mongoose from 'mongoose';
import { app } from '../../index';
import request from 'supertest';
import { User } from '../../server/model/user';
import { Role } from '../../server/model/role';
import { Category } from '../../server/model/category';
import { Document } from '../../server/model/document';
import bcrypt from 'bcrypt';

describe('TEST FOR CATEGORY', () => {
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

	describe('/POST: create category', () => {
		it('should check if user is logged in and return 401 if not', async () => {
			const res = await request(app).post('/api/categories/').send({
				title : 'Scifi',
			});
			expect(res.status).toBe(401);
		});
		it('should return 403 if logged in user is not an admin', async () => {
			const res = await request(app).post('/api/categories/').set('x-auth-token', isLogin).send({
				title : 'Romance',
			});
			expect(res.status).toBe(403);
		});
		it('should return a 404 if role creation fail by data validation', async () => {
			const res = await request(app).post('/api/categories/').set('x-auth-token', isAdmin).send({
				title : 've',
			});
			expect(res.status).toBe(404);
		});
		it('logged in admin should create a new role', async () => {
			const res = await request(app).post('/api/categories/').set('x-auth-token', isAdmin).send({
				title : 'detective',
			});
			const category = await Category.findOne({ title: 'detective' });

			expect(res.status).toBe(201);
			expect(category.title).toBe('detective');
		});
		it('should return a 400 error on duplicate categories', async () => {
			const res = await request(app).post('/api/categories/').set('x-auth-token', isAdmin).send({
				title : 'detective',
			});
			expect(res.status).toBe(400);
			expect(res.body.message).toBe('Cannot create duplicate category of detective');
		});

		//user should be logged in
		//user must be an admin,
		//valdation of category, return 400 if error
		//create category 200
		//if duplication error return 400(dulicate error)
	});
	//CREATE CATEGORY
	//GET ALL CATEGORIES
	//GET CATEGORY BY ID
	//DELETE CATEGORY
});
