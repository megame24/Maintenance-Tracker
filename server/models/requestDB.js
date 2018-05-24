import db from '../db/';

export default {
  getAllRequests() {
    return db.query('SELECT * FROM requests');
  },
  getUserRequests(id) {
    return db.query('SELECT * FROM requests WHERE ownerId = $1', [id]);
  },
  findRequestById(id) {
    return db.query('SELECT * FROM requests WHERE id = $1', [id]);
  },
  findRequestByTitle(title) {
    return db.query('SELECT * FROM requests WHERE title = $1', [title]);
  },
  createRequest(requestData) {
    return db.query('INSERT INTO requests (title, description, type, status, trashed, feedback, owner, date, ownerId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', requestData);
  },
  updateRequest(requestUpdate) {
    return db.query('UPDATE requests SET title = $1, description = $2, type = $3 WHERE id = $4', Object.values(requestUpdate).map(el => el));
  },
  updateStatus(statusDetails) {
    return db.query('UPDATE requests SET status = $1 WHERE id = $2', statusDetails);
  }
};
