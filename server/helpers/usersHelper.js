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
    const { fullname, email, username } = req.body;
    const password = req.body.password.trim();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = [
      fullname.trim(),
      username.trim(),
      email.trim(),
      hashedPassword,
      'user'
    ];
    return userDB.registerUser(newUser)
      .then(() => ({ success: { message: 'Registered successfully, login to make a request' } }));
  }
};
