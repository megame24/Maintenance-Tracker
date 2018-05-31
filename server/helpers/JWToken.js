import jwt from 'jsonwebtoken';

require('dotenv').config();

const secret = process.env.SECRET;

const JWToken = {
  /**
   * Generate a user token
   * @param {Object} userDetails - public user details
   * @returns {String} a token
   */
  generateToken(userDetails) {
    return jwt.sign(userDetails, secret, { expiresIn: 60 * 60 * 24 });
  },

  /**
   * Verify token
   * @param {Object} token
   * @returns {Object} an object containing user details
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      return false;
    }
  }
};

export default JWToken;
