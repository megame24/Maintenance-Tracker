/* eslint-disable max-len, no-useless-escape, object-curly-newline */
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
  static loginAfterValidation(result, password) {
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

  /**
   * Log in a user
   * @param {Object} req - request from a client
   * @param {Object} res - token and a success message
   */
  static login(req, res) {
    const { password } = req.body;
    let { usernameOrEmail } = req.body;
    usernameOrEmail = usernameOrEmail && usernameOrEmail.trim() ? usernameOrEmail.trim() : undefined;
    if (!usernameOrEmail && !password) {
      return res.status(400).json({ error: { message: 'Username / email and password required' } });
    }
    const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/;
    if (emailRegEx.test(usernameOrEmail)) {
      return userDB.getUserByEmail(usernameOrEmail)
        .then((emailResult) => {
          const resObject = UsersController.loginAfterValidation(emailResult, password);
          return res.status(resObject.status).json(resObject.json);
        })
        .catch(() => res.status(500).json(errors.error500));
    }
    userDB.getUserByUsername(usernameOrEmail)
      .then((usernameResult) => {
        const resObject = UsersController.loginAfterValidation(usernameResult, password);
        return res.status(resObject.status).json(resObject.json);
      })
      .catch(() => res.status(500).json(errors.error500));
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
