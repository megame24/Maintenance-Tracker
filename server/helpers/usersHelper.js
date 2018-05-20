import users from '../db/users';
import JWToken from '../helpers/JWToken';

export default {
  registerUser(req) {
    const {
      fullname, email, username, password
    } = req.body;
    // create new user's id by increasing the id of the last user in mock db(users)
    const id = users[users.length - 1].id + 1;
    const newUser = {
      id,
      fullname,
      email,
      username,
      password,
      role: 'user'
    };
    users.push(newUser);
    const token = JWToken.generateToken({
      id: newUser.id, username: newUser.username, role: newUser.role
    });
    return { token, success: { message: 'Registered successfully' } };
  }
};
