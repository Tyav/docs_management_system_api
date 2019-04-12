import 'babel-polyfill';
import { Document } from '../../../server/model/document';
import mongoose from 'mongoose';

describe('Test for Role model', () => {
	describe('Creation Test', () => {
		it('should pass validation if all required infomation is supplied', async () => {
			let testDoc = new Document({
				title: 'Fiction',
				content: 'Some test content',
				creatorId: new mongoose.Types.ObjectId().toHexString(),
				access: 'public',
				categoryId: new mongoose.Types.ObjectId().toHexString(),
			});
			expect(testDoc.validateSync()).not.toBeDefined();
		});
		it('should fail validation if required infomation is not supplied', async () => {
			let testDoc = new Document({
				//title is not supplied
				content: 'Some test content',
				creatorId: new mongoose.Types.ObjectId().toHexString(),
				access: 'public',
				categoryId: new mongoose.Types.ObjectId().toHexString(),
			});
			expect(testDoc.validateSync()).toBeDefined();
		});
	});
});
