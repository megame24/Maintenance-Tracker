import bcrypt from 'bcrypt';
import JWToken from '../helpers/JWToken';
import authHelper from '../helpers/authHelper';
import userDB from '../models/userDB';

class UsersController {
  static login(req, res) {
    const { username, password } = req.body;
    if (username && password) {
      userDB.getUser(username)
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
        });
    } else {
      return res.status(401).json({ error: { message: 'Username and password required' } });
    }
  }

  static register(req, res) {
    const {
      fullname, email, username, password
    } = req.body;
    let duplicateUser;
    userDB.getUser(username)
      .then((result) => {
        if (result.rows[0]) {
          duplicateUser = result.rows[0].username;
        } else {
          duplicateUser = null;
        }
        switch (false) {
          case !!fullname: 
            return res.status(400).json({ error: { message: 'fullname is required' } });
          case !!email: 
            return res.status(400).json({ error: { message: 'email is required' } });
          case !!username: 
            return res.status(400).json({ error: { message: 'username is required' } });
          case !duplicateUser: 
            return res.status(400).json({ error: { message: 'User with that username already exists' } });
          case !!password:
            res.status(400).json({ error: { message: 'password is required' } }); break;
          default: {
            authHelper.registerUser(req)
              .then((message) => {
                res.status(201).json(message);
              });
          }
        }
      });
  }
}

export default UsersController;
