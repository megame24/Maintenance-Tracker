/* eslint-disable no-console */

import db from '../';

db.query('CREATE TABLE users(id SERIAL PRIMARY KEY, fullname TEXT NOT NULL, username TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL)', null)
  .then(() => {
    console.log('table created');
  })
  .catch((err) => {
    console.log(err);
  });

db.query('CREATE TABLE requests(id SERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, type TEXT NOT NULL, status TEXT NOT NULL, trashed BOOLEAN NOT NULL, feedback TEXT NOT NULL, owner TEXT NOT NULL, date TEXT NOT NULL, ownerId INTEGER NOT NULL)', null)
  .then(() => {
    console.log('table created');
  })
  .catch((err) => {
    console.log(err);
  });

