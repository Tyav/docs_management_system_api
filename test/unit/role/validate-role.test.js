import validateRole from '../../../server/validations/role';

describe('Joi Validator of Role', () => {
  describe('test cases for role title validator', () => {
    it('should return an error if role title is not provided', () => {
      let TestData = {
      }
      const {testError} = validateRole(TestData)
      expect(testError).not.toBeNull();
    });
    it('should return error if role title is less than three characters', () => {
      let TestData = {
        title: "te"
      }
      const {testError} = validateRole(TestData)
      expect(testError).not.toBeNull();
    });
    it('should return an error of null value if all conditions are met', () => {
      let TestData = {
        title: "testRole"
      }
      const {testError} = validateRole(TestData)
      expect(testError).toBeNull();
    });
  });
});
