import 'babel-polyfill';
import mongoose from 'mongoose';
import { server } from '../../index';
import request from 'supertest';
import { Document } from '../../server/model/document';
import { Category } from '../../server/model/category';
import { User } from '../../server/model/user';
let app;

describe('TEST FOR DOCUMENTS', () => {
  let publics = new Category({
		title: 'public',
	});
  publics.save();
  let privates = new Category({
		title: 'private',
	});
	privates.save();

	beforeEach(async () => {
		await server.close();
		app = server;
	});
	afterEach(async () => {
		await app.close();
		await Document.deleteMany({});
	});
	afterAll(async () => {
		await Category.deleteMany({});
	});

  describe('/POST: CREATE DOCUMENT', () => {
    beforeEach(() => {
      
    });
    it('should create a document', () => {
      
    });
    
  });
//POST: CREATE DOCUMENT

//GET: GET ALL DOCUMENT

//GET: GET DOCUMENT BY ID

//PUT: EDIT A DOCUMENT

//DELETE: DELETE DOCUMENT

});
