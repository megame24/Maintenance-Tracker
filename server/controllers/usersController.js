import users from '../db/users';
import JWToken from '../helpers/JWToken';

const usersController = {
  login(req, res) {
    const { username, password } = req.body;
    if (username && password) {
      const user = users.filter(element => element.username === username)[0];
      if (user && (password === user.password)) {
        const userDetails = {
          id: user.id,
          username: user.username,
          role: user.role
        };
        const token = JWToken.generateToken(userDetails);
        return res.status(200).json({ token, success: { message: 'Logged in successfully' } });
      }
      return res.status(401).json({ error: { message: 'Invalid username or password' } });
    }
    return res.status(401).json({ error: { message: 'Username and password required' } });
  }
};

export default usersController;
