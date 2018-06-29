/* eslint-disable max-len */
import bcrypt from 'bcrypt';
import JWToken from '../helpers/JWToken';
import usersHelper from '../helpers/usersHelper';
import userDB from '../models/userDB';
import errors from '../helpers/errorHelper';

class UsersController {
  /**
   * Log in user after his/her credentails have been validated
   * @param {Object} result - retrieved user(s) object from the database 
   * @param {String} password - provided password
   * @param {Object} res - response object
   */
  static loginAfterValidation(result, password, res) {
    const user = result.rows[0];
    if (user && bcrypt.compareSync(password, user.password)) {
      const userDetails = {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        role: user.role
      };
      const token = JWToken.generateToken(userDetails);
      return res.status(200).json({ token, success: { message: 'Logged in successfully' } });
    }
    return res.status(401).json({ error: { message: 'Invalid username / email or password' } });
  }

  /**
   * Log in a user
   * @param {Object} req - request from a client
   * @param {Object} res - token and a success message
   */
  static login(req, res) {
    const { password } = req.body;
    let { usernameOrEmail } = req.body;
    usernameOrEmail = usernameOrEmail && usernameOrEmail.trim() ? usernameOrEmail.trim() : undefined;
    if (usernameOrEmail && password) {
      userDB.getUserByUsername(usernameOrEmail)
        .then((usernameResult) => {
          if (!usernameResult.rows[0]) {
            userDB.getUserByEmail(usernameOrEmail)
              .then((emailResult) => {
                UsersController.loginAfterValidation(emailResult, password, res);
              })
              .catch(() => res.status(500).json(errors.error500));
            return;
          }
          UsersController.loginAfterValidation(usernameResult, password, res);
        })
        .catch(() => res.status(500).json(errors.error500));
    } else {
      return res.status(400).json({ error: { message: 'Username / email and password required' } });
    }
  }

  /**
   * Sign up a user
   * @param {Object} req 
   * @param {Object} res 
   */
  static register(req, res) {
    usersHelper.registerUser(req)
      .then((message) => {
        res.status(201).json(message);
      });
  }
}

export default UsersController;
