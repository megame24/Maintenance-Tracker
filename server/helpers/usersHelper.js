import bcrypt from 'bcrypt';
import userDB from '../models/userDB';

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
      fullname,
      username,
      email,
      hashedPassword,
      'user'
    ];
    return userDB.registerUser(newUser)
      .then(() => ({ success: { message: 'Registered successfully, login to make a request' } }));
  }
};
