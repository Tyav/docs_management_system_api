import 'babel-polyfill';
import { validateCreateUser, validateLogin } from '../../../server/validations/user';

describe('Validation of new user creation details', () => {
	describe('test cases for username', () => {
		it('should return error if username is not given', () => {
			let testData = {
				name: {
					firstName: 'TestData',
					lastName: 'TestData',
				},
				email: 'testdata@test.data',
				password: '12345678',
				roleId: 'dfe5343fef4e3f3r4',
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
    });
    it('should return error if username is less than 3', () => {
			let testData = {
				username: 'Te',
				name: {
					firstName: 'TestData',
					lastName: 'TestData',
				},
				email: 'testdata@test.data',
				password: '12345678',
				roleId: 'dfe5343fef4e3f3r4',
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
		});
    it('should return error if username is not a string', () => {
			let testData = {
				username: 43543,
				name: {
					firstName: 'TestData',
					lastName: 'TestData',
				},
				email: 'testdata@test.data',
				password: '12345678',
				roleId: 'dfe5343fef4e3f3r4',
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
		});
  });
  describe('test case for Name', () => {
    it('should return error if Name is not provided', () => {
			let testData = {
				username: 'TestData',
				email: 'testdata@test.data',
				password: '12345678',
				roleId: 'dfe5343fef4e3f3r4',
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
    });
    it('should return error if firstName is not provided', () => {
			let testData = {
				username: 43543,
				name: {
					lastName: 'TestData',
				},
				email: 'testdata@test.data',
				password: '12345678',
				roleId: 'dfe5343fef4e3f3r4',
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
		});
    it('should return error if lastName is not provided', () => {
			let testData = {
				username: 43543,
				name: {
					firstName: 'TestData',
				},
				email: 'testdata@test.data',
				password: '12345678',
				roleId: 'dfe5343fef4e3f3r4',
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
		});
  });
  describe('test cases for email', () => {
    it('should return error if email is not in the email format', () => {
			let testData = {
				username: 43543,
				name: {
					firstName: 'TestData',
					lastName: 'TestData',
				},
				email: 'testdata@tes',
				password: '12345678',
				roleId: 'dfe5343fef4e3f3r4',
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
		});
    it('should return error if email is not given', () => {
			let testData = {
				username: 43543,
				name: {
					firstName: 'TestData',
					lastName: 'TestData',
				},
				password: '12345678',
				roleId: 'dfe5343fef4e3f3r4',
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
		});

  });
});

// let testData = {
// 	username: 'TestData',
// 	name: {
// 		firstName: 'TestData',
// 		lastName: 'TestData',
// 	},
// 	email: 'testdata@test.data',
// 	password: '12345678',
// 	roleId: 'dfe5343fef4e3f3r4',
// };
