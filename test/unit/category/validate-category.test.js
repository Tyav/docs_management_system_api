import { validateCate } from '../../../server/validations/category';

describe('Joi Validator of Category', () => {
	describe('test cases for category title', () => {
		it('should return an error if category title is not provided', () => {
			let TestData = {};
			const { error } = validateCate(TestData);
			expect(error).not.toBeNull();
		});
		it('should return error if category title is less than three characters', () => {
			let TestData = {
				title: 'te',
			};
			const { error } = validateCate(TestData);
			expect(error).not.toBeNull();
		});
		it('should return an error of null value if all conditions are met', () => {
			let TestData = {
				title: 'testRole',
			};
			const { error } = validateCate(TestData);
			expect(error).toBeNull();
		});
	});
});
