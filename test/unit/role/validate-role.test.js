import { validateRole } from '../../../server/validations/role';

describe('Joi Validator of Role', () => {
	describe('test cases for role title validator', () => {
		it('should return an error if role title is not provided', () => {
			let TestData = {};
			const { error } = validateRole(TestData);
			expect(error).not.toBeNull();
		});
		it('should return error if role title is less than three characters', () => {
			let TestData = {
				title: 'te',
			};
			const { error } = validateRole(TestData);
			expect(error).not.toBeNull();
		});
		it('should return an error of null value if all conditions are met', () => {
			let TestData = {
				title: 'testRole',
			};
			const { error } = validateRole(TestData);
			expect(error).toBeNull();
		});
	});
});
