import bcrypt from 'bcrypt';
import userDB from '../models/userDB';
import JWToken from '../helpers/JWToken';

require('dotenv').config();

const salt = Number(process.env.SALT);

export default {
  /**
   * Send user details to the database
   * @param {Object} req - request from client
   * @returns {Object} a promise that will resolve to a success message
   */
  registerUser(req) {
    const {
      fullname, email, username, password
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = [
      fullname.trim(),
      username.trim(),
      email.trim(),
      hashedPassword,
      'user'
    ];
    return userDB.registerUser(newUser)
      .then(() => userDB.getUserByEmail(email.trim()))
      .then((user) => {
        const {
          id, role
        } = user.rows[0];
        const token = JWToken.generateToken({
          id, username, role, fullname,
        });
        return { token, success: { message: 'Registered successfully, login to make a request' } };
      });
  },

  /**
   * Log in user after his/her credentails have been validated
   * @param {Object} result - retrieved user(s) object from the database 
   * @param {String} password - provided password
   * @param {Object} res - response object
   */
  loginAfterValidation(result, password) {
    const user = result.rows[0];
    if (user && bcrypt.compareSync(password, user.password)) {
      const userDetails = {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        role: user.role
      };
      const token = JWToken.generateToken(userDetails);
      return { status: 200, json: { token, success: { message: 'Logged in successfully' } } };
    }
    return { status: 401, json: { error: { message: 'Invalid username / email or password' } } };
  }
};
