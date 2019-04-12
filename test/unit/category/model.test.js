import 'babel-polyfill';
import { Category } from '../../../server/model/category';

describe('Test for Category model', () => {
	describe('Creation Test', () => {
		it('should pass validation if all required infomation is supplied', async () => {
			let category = new Category({
				title: 'Fiction',
			});
			expect(category.validateSync()).not.toBeDefined();
		});
		it('should fail validation if required infomation is not supplied', async () => {
			let category = new Category(
				{
					//title is not supplied
				},
			);
			expect(category.validateSync()).toBeDefined();
		});
	});
});
