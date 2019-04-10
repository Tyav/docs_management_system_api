import 'babel-polyfill'
import mongoose from 'mongoose';

import db from '../../../startup/db';
//db(mongoose)

import { User } from "../../../server/model/user";

describe('Test for User model', () => {
  beforeEach(async() => {
    await db(mongoose)
  });
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
    it('should fail validation if any required infomation is supplied', async () => {
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




