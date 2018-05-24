import db from '../db/';

export default {
  getUser(username) {
    return db.query('SELECT * FROM users WHERE username = $1', [username]);
  },
  registerUser(userdetails) {
    return db.query('INSERT INTO users (fullname, username, email, password, role) VALUES ($1, $2, $3, $4, $5)', userdetails);
  }
};
