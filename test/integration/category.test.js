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
		afterAll(async ()=>{
			await Category.deleteMany({});
		})
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

	});
	//CREATE CATEGORY
	
	describe('/GET: Test to get all categories', () => {
		beforeAll(async()=>{
			await Category.insertMany([{title: 'games'}, {title: 'tech'}]);
		})
		afterAll(async ()=>{
			await Category.deleteMany({});
		})

		it('should return a 200 status code on success', async () => {
			const res = await request(app).get('/api/categories/')
			expect(res.status).toBe(200);
		});
		it('should get all categories', async () => {
			const res = await request(app).get('/api/categories/')
			expect(res.body.length).toEqual(2);
		});
	})
	describe('/GET BY ID: Test to get category by id', () => {
		let category;
		beforeAll(async()=>{
			category = new Category({title: 'music'});
			category.save()
		})
		afterAll(async ()=>{
			await Category.deleteMany({});
		})

		it('should return a 200 status code on success', async () => {
			const res = await request(app).get(`/api/categories/${category._id}`)
			expect(res.status).toBe(200);
		});
		it('should get category by id', async () => {
			const res = await request(app).get(`/api/categories/${category._id}`)
			expect(res.body).toHaveProperty('title', 'music');
		});
		it('should return 404 status if category is not available', async () => {
			const res = await request(app).get(`/api/categories/${mongoose.Types.ObjectId()}`)
			expect(res.body.Error).toBe(404);
		});
		it('should return 400 status if category id is not valid', async () => {
			const res = await request(app).get(`/api/categories/${'sdfesdfdsfd'}`)
			expect(res.body.Error).toBe(400);
		});
	})
	describe('/PUT: Test to edit Category by id', () => {
		afterAll(async ()=>{
			await Category.deleteMany({});
		})
		let category;
		beforeAll(async()=>{
			category = new Category({title: 'movics'});
			category.save()
		})
		it('should return a 401 if user is not logged in', async () => {
			const res = await request(app).put(`/api/categories/${category._id}`)
			expect(res.body.Error).toBe(401);
		});
		it('should return a 403 status code if logged in user is not an admin', async () => {
			const res = await request(app).put(`/api/categories/${category._id}`).set('x-auth-token', isLogin).send({
				title : 'moive',
			});
			expect(res.body.Error).toBe(403);
		});
		it('should return a 200 status code on success', async () => {
			const res = await request(app).put(`/api/categories/${category._id}`).set('x-auth-token', isAdmin).send({
				title : 'muvies',
			});
			expect(res.status).toBe(200);
		});
		it('should return the editted category on success', async () => {
			const res = await request(app).put(`/api/categories/${category._id}`).set('x-auth-token', isAdmin).send({
				title : 'movies',
			});
			expect(res.status).toBe(200);
		});
		it('should return 404 status if category is not available', async () => {
			const res = await request(app).put(`/api/categories/${mongoose.Types.ObjectId()}`).set('x-auth-token', isAdmin).send({
				title : 'header',
			});
			expect(res.body.Error).toBe(404);
		});
		it('should return 400 status if category id is not valid', async () => {
			const res = await request(app).put(`/api/categories/${'sdfesdfdsfd'}`).set('x-auth-token', isAdmin).send({
				title : 'header',
			});
			expect(res.body.Error).toBe(400);
		});
	});

	//GET CATEGORY BY ID
	//DELETE CATEGORY
});
