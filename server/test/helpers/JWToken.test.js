import chai from 'chai';
import JWToken from '../../helpers/JWToken';
import testData from '../testData';

const { regularUser1, invalidToken } = testData;
const { expect } = chai;

describe('JWToken', () => {
  describe('generateToken', () => {
    it('Should generate a token', () => {
      const token = JWToken.generateToken({
        id: regularUser1.id,
        username: regularUser1.username
      });
      expect(token).to.be.a('string');
    });
  });
  describe('verifyToken', () => {
    it('Should return false if invalid token is provided', () => {
      const tokenObject = JWToken.verifyToken(invalidToken);
      expect(tokenObject).to.equal(false);
    });
    it('Should return a decoded object if valid token is provided', () => {
      const token = JWToken.generateToken({
        id: regularUser1.id,
        username: regularUser1.username
      });
      const tokenObject = JWToken.verifyToken(token);
      expect(tokenObject).to.be.a('object');
      expect(tokenObject.id).to.equal(regularUser1.id);
      expect(tokenObject.username).to.equal(regularUser1.username);
    });
  });
});
