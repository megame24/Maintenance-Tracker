/* eslint-disable max-len, no-useless-escape, object-curly-newline */
import usersHelper from '../helpers/usersHelper';
import userDB from '../models/userDB';
import errors from '../helpers/errorHelper';

class UsersController {
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
          const resObject = usersHelper.loginAfterValidation(emailResult, password);
          res.status(resObject.status).json(resObject.json);
        })
        .catch(() => res.status(500).json(errors.error500));
    }
    userDB.getUserByUsername(usernameOrEmail)
      .then((usernameResult) => {
        const resObject = usersHelper.loginAfterValidation(usernameResult, password);
        res.status(resObject.status).json(resObject.json);
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
