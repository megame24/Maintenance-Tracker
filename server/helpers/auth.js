import jwt from 'jsonwebtoken';

const secret = 'hehehe';

const auth = {
  generateToken(userDetails) {
    return jwt.sign(userDetails, secret, { expiresIn: 60 * 60 });
  }
};

export default auth;
