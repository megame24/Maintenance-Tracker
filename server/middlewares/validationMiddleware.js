import userDB from '../models/userDB';
import errors from '../helpers/errorHelper';

class validationMiddleware {
  /**
   * Validate the signup credentials
   * @param {Object} req - request from client
   * @param {Object} res - error message
   * @param {Function} next - callback pointing to the next middleware/controller
   */
  static validateUser(req, res, next) {
    const { email, username } = req.body;
    if (!email) { 
      return res.status(400).json({ error: { message: 'email is required' } });
    }
    if (!username) {
      return res.status(400).json({ error: { message: 'username is required' } });
    }
    userDB.getUserByUsername(username)
      .then((result) => {
        if (result.rows[0]) {
          return res.status(400).json({ error: { message: 'User with that username already exists' } });
        }
        userDB.getUserByEmail(email)
          .then((neResult) => {
            if (neResult.rows[0]) {
              return res.status(400).json({ error: { message: 'User with that email already exists' } });
            }
            // regular expression from stackoverflow https://stackoverflow.com/a/9204568
            const emailRegx = /\S+@\S+\.\S+/;

            if (!emailRegx.test(email)) {
              return res.status(400).json({ error: { message: 'Please provide a valid email' } });
            }
            next();
          })
          .catch(() => res.status(500).json(errors.error500));
      })
      .catch(() => res.status(500).json(errors.error500));
  }
}

export default validationMiddleware;
