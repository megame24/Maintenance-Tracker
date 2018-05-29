import db from '../db/';

export default {
  getUserByUsername(username) {
    return db.query('SELECT * FROM users WHERE username = $1', [username]);
  },
  getUserByEmail(email) {
    return db.query('SELECT * FROM users WHERE email = $1', [email]);
  },
  registerUser(userdetails) {
    return db.query('INSERT INTO users (fullname, username, email, password, role) VALUES ($1, $2, $3, $4, $5)', userdetails);
  }
};
