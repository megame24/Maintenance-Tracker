import jwt from 'jsonwebtoken';

const secret = 'hehehe';

const JWToken = {
  generateToken(userDetails) {
    return jwt.sign(userDetails, secret, { expiresIn: 60 * 60 * 24 });
  },
  verifyToken(token) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      return false;
    }
  }
};

export default JWToken;
