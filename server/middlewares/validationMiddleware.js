/* eslint-disable no-useless-escape, object-curly-newline */
import userDB from '../models/userDB';
import errors from '../helpers/errorHelper';

class validationMiddleware {
  /**
   * Check regular expression and length
   * @param {String} username - username provided by user
   * @param {String} email - email provided by user
   * @param {String} fullname - fullname provided by user
   */
  static regExAndLength(username, email, fullname) {
    if (fullname) {
      switch (false) {
        case /^[A-Za-z\ ]+$/.test(fullname): return false;
        case fullname.length > 2: return false;
        case fullname.length < 40: return false;
        default: return true;
      }
    }
    if (username) {
      switch (false) {
        case /^[A-Za-z0-9]+$/.test(username): return false;
        case username.length > 4: return false;
        case username.length < 30: return false;
        default: return true;
      }
    }
    if (email) {
      // regular expression from stackoverflow https://stackoverflow.com/a/38137215
      return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/.test(email);
    }
  }

  /**
   * Validate username
   * @param {String} username - username provided by user
   */
  static validateUsername(username) {
    if (!(username && username.trim())) return { error: { message: 'username is required' } };
    if (!validationMiddleware.regExAndLength(username.trim(), null, null)) {
      return { error: { message: 'Username can only contain letters & numbers, and must be greater than 4 but less than 30 characters long' } };
    }
    return {};
  }

  /**
   * Validate full name
   * @param {String} fullname - fullname provided by user
   */
  static validateFullname(fullname) {
    if (!(fullname && fullname.trim())) return { error: { message: 'fullname is required' } };
    if (!validationMiddleware.regExAndLength(null, null, fullname.trim())) {
      return { error: { message: 'fullname can only contain letters, and must be greater than 2 but less than 40 characters long' } };
    }
    return {};
  }

  /**
   * Validate email
   * @param {String} email - email provided by user
   */
  static validateEmail(email) {
    if (!(email && email.trim())) return { error: { message: 'email is required' } };
    if (!validationMiddleware.regExAndLength(null, email.trim(), null)) {
      return { error: { message: 'Please provide a valid email' } };
    }
    return {};
  }

  /**
   * Validate password
   * @param {String} password - password provided by user
   */
  static validatePassword(password) {
    if (!password) return { error: { message: 'password is required' } };
    if (password.length < 5) {
      return { error: { message: 'password must be more than 5 characters long' } };
    }
    return {};
  }

  /**
   * Validate the signup credentials
   * @param {Object} req - request from client
   * @param {Object} res - error message
   * @param {Function} next - callback pointing to the next middleware/controller
   */
  static validateUser(req, res, next) {
    const { email, username, password, fullname } = req.body;
    switch (true) {
      case !!validationMiddleware.validateFullname(fullname).error:
        return res.status(400).json(validationMiddleware.validateFullname(fullname));
      case !!validationMiddleware.validateEmail(email).error:
        return res.status(400).json(validationMiddleware.validateEmail(email));
      case !!validationMiddleware.validateUsername(username).error:
        return res.status(400).json(validationMiddleware.validateUsername(username));
      case !!validationMiddleware.validatePassword(password).error:
        return res.status(400).json(validationMiddleware.validatePassword(password));
      default: {
        userDB.getUserByUsername(username.trim())
          .then((result) => {
            if (result.rows[0]) {
              return res.status(400).json({ error: { message: 'User with that username already exists' } });
            }
            userDB.getUserByEmail(email.trim())
              .then((neResult) => {
                if (neResult.rows[0]) {
                  return res.status(400).json({ error: { message: 'User with that email already exists' } });
                } next();
              }).catch(err => res.status(500).json(errors.error500(err)));
          }).catch(err => res.status(500).json(errors.error500(err)));
      }
    }
  }
}

export default validationMiddleware;
