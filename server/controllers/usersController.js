import users from '../db/users';
import JWToken from '../helpers/JWToken';

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
          const token = JWToken.generateToken(userDetails);
          res.status(200).json({ token, success: { messaage: 'Logged in successfully' } });
        } else {
          res.status(401).json({ error: { messaage: 'Incorrect password' } });
        }
      } else {
        res.status(404).json({ error: { messaage: 'User not found' } });
      }
    } else {
      res
        .status(401)
        .json({ error: { messaage: 'Username and password required' } });
    }
  }
};

export default usersController;
