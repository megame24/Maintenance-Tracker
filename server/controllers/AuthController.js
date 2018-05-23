/* eslint-disable no-console */

import users from '../db/mock/mock-users';
import db from '../db';
import JWToken from '../helpers/JWToken';
import usersHelper from '../helpers/usersHelper';

class UsersController {
  static login(req, res) {
    const { username, password } = req.body;
    if (username && password) {
      const user = users.filter(element => element.username === username)[0];
      if (user && (password === user.password)) {
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
    }
    return res.status(401).json({ error: { message: 'Username and password required' } });
  }

  static register(req, res) {
    const {
      fullname, email, username, password
    } = req.body;
    let duplicateUser;
    db.query('SELECT * FROM users WHERE username = $1', [username])
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
            usersHelper.registerUser(req)
              .then((message) => {
                res.status(201).json(message);
              });
          }
        }
      })
      .catch(() => {
        res.status(500).json({ error: { message: 'Something went wrong' } });
      });
  }
}

export default UsersController;
