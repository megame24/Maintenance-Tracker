import db from '../db/';

export default {
  getUserRequests(id) {
    return db.query('SELECT * FROM requests WHERE ownerId = $1', [id]);
  },
  findRequestById(id) {
    return db.query('SELECT * FROM requests WHERE id = $1', [id]);
  }
};
