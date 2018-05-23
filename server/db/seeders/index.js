/* eslint-disable no-console */

import db from '../';
import users from './seed-users';
import requests from './seed-requests';


db.query('DELETE FROM users', [])
  .then(() => db.query('TRUNCATE TABLE users RESTART IDENTITY', []))
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
  .then(() => db.query('TRUNCATE TABLE requests RESTART IDENTITY', []))
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

