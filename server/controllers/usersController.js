import users from '../db/users';
import auth from '../helpers/auth';

const usersController = {
  login(req, res) {
    const { username, password } = req.body;
    if (username && password) {
      const user = users.filter(element => element.username === username)[0];
      if (user) {
        if (password === user.password) {
          const userDetails = {
            id: user.id,
            username: user.username,
            role: user.role
          };
          const token = auth.generateToken(userDetails);
          res.status(200).json({ token, messaage: 'user logged in' });
        } else {
          res.status(401).json({ errors: { messaage: 'incorrect password' } });
        }
      } else {
        res.status(404).json({ errors: { messaage: 'user not found' } });
      }
    } else {
      res
        .status(401)
        .json({ errors: { messaage: 'username and password required' } });
    }
  }
};

export default usersController;
