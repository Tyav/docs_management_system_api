import 'babel-polyfill';
import mongoose from 'mongoose'
import { validateDoc } from '../../../server/validations/document'

describe('Test for Document data validator', () => {
  it('should pass validation if all required data are given', () => {
    let testDoc = {
      title: 'Title',
      content: 'Some test content',
      creatorId: new mongoose.Types.ObjectId().toHexString(),
      access: 'public',
      categoryId: new mongoose.Types.ObjectId().toHexString(),
    }
    const {error} = validateDoc(testDoc);
    expect(error).toBeNull()
  });
  it('should fail validation if any required data is not given', () => {
    let testDoc = {
      //title is not given
      content: 'Some test content',
      creatorId: new mongoose.Types.ObjectId().toHexString(),
      access: 'public',
      categoryId: new mongoose.Types.ObjectId().toHexString(),
    }
    const {error} = validateDoc(testDoc);
    expect(error).not.toBeNull()
  });
});

