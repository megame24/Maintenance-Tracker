import db from '../db/';

export default {
  getAllRequests(filter) {
    if (filter === 'repair' || filter === 'maintenance') {
      return db.query('SELECT * FROM requests WHERE trashed = false AND type = $1 ORDER BY date DESC', [filter]);
    }
    return db.query('SELECT * FROM requests WHERE trashed = false ORDER BY date DESC');
  },
  getUserRequests(id) {
    return db.query('SELECT * FROM requests WHERE ownerId = $1 AND deleted = false ORDER BY date DESC', [id]);
  },
  findRequestById(id) {
    return db.query('SELECT * FROM requests WHERE id = $1', [id]);
  },
  createRequest(requestData) {
    return db.query('INSERT INTO requests (title, description, type, status, trashed, deleted, feedback, owner, date, ownerId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', requestData);
  },
  updateRequest(requestUpdate) {
    return db.query('UPDATE requests SET title = $1, description = $2, type = $3 WHERE id = $4', Object.values(requestUpdate).map(el => el));
  },
  deleteRequest(id) {
    return db.query('DELETE FROM requests WHERE id = $1', [id]);
  },
  deleteRequestWithPersistance(id) {
    return db.query('UPDATE requests SET deleted = $1 WHERE id = $2', [true, id]);
  },
  trashRequest(id) {
    return db.query('UPDATE requests SET trashed = $1 WHERE id = $2', [true, id]);
  },
  updateStatus(statusDetails) {
    return db.query('UPDATE requests SET status = $1, feedback = $2 WHERE id = $3', statusDetails);
  }
};
