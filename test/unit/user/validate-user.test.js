import 'babel-polyfill';
import { validateCreateUser, validateLogin } from '../../../server/validations/user';
import mongoose from 'mongoose';
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
				roleId: new mongoose.Types.ObjectId().toHexString(),
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
				roleId: new mongoose.Types.ObjectId().toHexString(),
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
				roleId: new mongoose.Types.ObjectId().toHexString(),
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
				roleId: new mongoose.Types.ObjectId().toHexString(),
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
		});
		it('should return error if firstName is not provided', () => {
			let testData = {
				username: 'TestData',
				name: {
					lastName: 'TestData',
				},
				email: 'testdata@test.data',
				password: '12345678',
				roleId: new mongoose.Types.ObjectId().toHexString(),
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
		});
		it('should return error if lastName is not provided', () => {
			let testData = {
				username: 'TestData',
				name: {
					firstName: 'TestData',
				},
				email: 'testdata@test.data',
				password: '12345678',
				roleId: new mongoose.Types.ObjectId().toHexString(),
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
		});
	});
	describe('test cases for email', () => {
		it('should return error if email is not in the email format', () => {
			let testData = {
				username: 'TestData',
				name: {
					firstName: 'TestData',
					lastName: 'TestData',
				},
				email: 'testdata@tes',
				password: '12345678',
				roleId: new mongoose.Types.ObjectId().toHexString(),
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
		});
		it('should return error if email is not given', () => {
			let testData = {
				username: 'TestData',
				name: {
					firstName: 'TestData',
					lastName: 'TestData',
				},
				password: '12345678',
				roleId: new mongoose.Types.ObjectId().toHexString(),
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
		});
	});
	describe('test cases for password', () => {
		it('should return error if password is not provided', () => {
			let testData = {
				username: 'TestData',
				name: {
					firstName: 'TestData',
					lastName: 'TestData',
				},
				email: 'testdata@test.data',
				roleId: new mongoose.Types.ObjectId().toHexString(),
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
		});
		it('should return error if password is less that 8 characters', () => {
			let testData = {
				username: 'TestData',
				name: {
					firstName: 'TestData',
					lastName: 'TestData',
				},
				email: 'testdata@test.data',
				password: '1234567',
				roleId: new mongoose.Types.ObjectId().toHexString(),
			};
			let { error } = validateCreateUser(testData);
			expect(error).not.toBeNull();
		});
	});
	describe('test case for roleId', () => {
		it('should allow if roleId not provided', () => {
			let testData = {
				username: 'TestData',
				name: {
					firstName: 'TestData',
					lastName: 'TestData',
				},
				email: 'testdata@test.data',
				password: '12345678',
			};
			let { error } = validateCreateUser(testData);
			expect(error).toBeNull();
		});
	});
	describe('test to pass validation', () => {
		it('should pass validation and return error of null value', () => {
			let testData = {
				username: 'TestData',
				name: {
					firstName: 'TestData',
					lastName: 'TestData',
				},
				email: 'testdata@test.data',
				password: '12345678',
				roleId: new mongoose.Types.ObjectId().toHexString(),
			};
			let { error } = validateCreateUser(testData);
			expect(error).toBeNull();
		});
	});
});

describe('Validation of user Login details', () => {
	describe('test cases for username', () => {
		it('should return error if username is not given', () => {
			let testData = {
				password: '12345678',
			};
			let { error } = validateLogin(testData);
			expect(error).not.toBeNull();
		});
		it('should return error if username is less than 3', () => {
			let testData = {
				username: 'Te',
				password: '12345678',
			};
			let { error } = validateLogin(testData);
			expect(error).not.toBeNull();
		});
	});
	describe('test case for password', () => {
		it('should return error if password is less than 8', () => {
			let testData = {
				username: 'TestData',
				password: '1234567',
			};
			let { error } = validateLogin(testData);
			expect(error).not.toBeNull();
		});
	});
});
