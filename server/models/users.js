import db from '../db/';

export default {
  getUser(username) {
    return db.query('SELECT * FROM users WHERE username = $1', [username]);
  }
};
