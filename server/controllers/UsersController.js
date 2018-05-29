import bcrypt from 'bcrypt';
import JWToken from '../helpers/JWToken';
import usersHelper from '../helpers/usersHelper';
import userDB from '../models/userDB';
import errors from '../helpers/errorHelper';

class UsersController {
  static login(req, res) {
    const { username, password } = req.body;
    if (username && password) {
      userDB.getUserByUsername(username)
        .then((result) => {
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
          return res.status(401).json({ error: { message: 'Invalid username or password' } });
        })
        .catch(() => {
          res.status(500).json(errors.error500);
        });
    } else {
      return res.status(400).json({ error: { message: 'Username and password required' } });
    }
  }

  static register(req, res) {
    const {
      fullname, password
    } = req.body;
    switch (false) {
      case !!fullname: 
        return res.status(400).json({ error: { message: 'fullname is required' } });
      case !!password:
        res.status(400).json({ error: { message: 'password is required' } }); break;
      default: {
        usersHelper.registerUser(req)
          .then((message) => {
            res.status(201).json(message);
          });
      }
    }
  }
}

export default UsersController;
