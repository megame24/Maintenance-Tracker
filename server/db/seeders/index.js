/* eslint-disable no-console */

import db from '../';
import users from '../users';
import requests from '../requests';


db.query('DELETE FROM users', [])
  .then(() => {
    users.forEach((elem) => {
      db.query(
        'INSERT INTO users (fullname, username, email, password, role) VALUES ($1, $2, $3, $4, $5)',
        Object.values(elem).map(el => el)
      )
        .catch((err) => {
          console.log(err);
        });
    });
  })
  .catch((err) => {
    console.log(err);
  });

db.query('DELETE FROM requests', [])
  .then(() => {
    requests.forEach((elem) => {
      db.query(
        'INSERT INTO requests (title, description, type, status, trashed, feedback, owner, date, ownerId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        Object.values(elem).map(el => el)
      )
        .catch((err) => {
          console.log(err);
        });
    });
  })
  .catch((err) => {
    console.log(err);
  });

