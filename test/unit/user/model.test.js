import 'babel-polyfill'
import { User } from "../../../server/model/user";
import mongoose from 'mongoose'

describe('Test for User model', () => {
  describe('Creation Test', () => {
    it('should pass validation if all required infomation is supplied', async () => {
      let user = new User({
        username: 'testUser',
        name: {
          firstName: 'firstName',
          lastName : 'lastName'
        },
        email: 'test@email.com',
        password: '12345678',
        roleId: new mongoose.Types.ObjectId()
      });
      expect(user.validateSync()).not.toBeDefined()
    });
    it('should fail validation if any required infomation is not supplied', async () => {
      let user = new User({
        //username is omitted
        name: {
          firstName: 'firstName',
          lastName : 'lastName'
        },
        email: 'test@email.com',
        password: '12345678',
        roleId: new mongoose.Types.ObjectId()
      });
      expect(user.validateSync()).toBeDefined()
    });

  });
});
  // console.log(user.validateSync().errors[Object.keys(user.validateSync().errors)[0]].message)




