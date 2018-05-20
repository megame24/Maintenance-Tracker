import users from '../db/users';
import JWToken from '../helpers/JWToken';
import usersHelper from '../helpers/usersHelper';

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
  },

  register(req, res) {
    const {
      fullname, email, username, password
    } = req.body;
    const duplicateUser = users.filter(elem => elem.username === username)[0];
    switch (false) {
      case !!fullname: 
        return res.status(400).json({ error: { message: 'Fullname is required' } });
      case !!email: 
        return res.status(400).json({ error: { message: 'Email is required' } });
      case !!username: 
        return res.status(400).json({ error: { message: 'Username is required' } });
      case !duplicateUser: 
        return res.status(400).json({ error: { message: 'User with that username already exists' } });
      case !!password:
        res.status(400).json({ error: { message: 'Password is required' } }); break;
      default: {
        const successResponse = usersHelper.registerUser(req);
        res.status(201).json(successResponse);
      }
    }
  }
};

export default usersController;
