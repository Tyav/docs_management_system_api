import 'babel-polyfill';
import { Role } from '../../../server/model/role';

describe('Test for Role model', () => {
	describe('Creation Test', () => {
		it('should pass validation if all required infomation is supplied', async () => {
			let user = new Role({
				title: 'Fiction',
			});
			expect(user.validateSync()).not.toBeDefined();
		});
		it('should fail validation if required infomation is not supplied', async () => {
			let user = new Role(
				{
					//title is not supplied
				},
			);
			expect(user.validateSync()).toBeDefined();
		});
		it('should set the publicWrite property true if title is admin', async () => {
			let user = new Role({
				title: 'admin',
			});
			expect(user.publicWrite).toBeTruthy();
		});
	});
});
