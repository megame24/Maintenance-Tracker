/* eslint-disable no-console */

import db from '../';
import users from './seed-users';
import requests from './seed-requests';


db.query('DELETE FROM users', [])
  .then(() => db.query('TRUNCATE TABLE users RESTART IDENTITY', []))
  .then(() => 
    db.query(
      'INSERT INTO users (fullname, username, email, password, role) VALUES ($1, $2, $3, $4, $5)',
      Object.values(users[0]).map(el => el)
    ))
  .then(() => 
    db.query(
      'INSERT INTO users (fullname, username, email, password, role) VALUES ($1, $2, $3, $4, $5)',
      Object.values(users[1]).map(el => el)
    ))
  .then(() => 
    db.query(
      'INSERT INTO users (fullname, username, email, password, role) VALUES ($1, $2, $3, $4, $5)',
      Object.values(users[2]).map(el => el)
    ))
  .then(() => 
    db.query(
      'INSERT INTO users (fullname, username, email, password, role) VALUES ($1, $2, $3, $4, $5)',
      Object.values(users[3]).map(el => el)
    ))
  .catch((err) => {
    console.log(err);
  });

db.query('DELETE FROM requests', [])
  .then(() => db.query('TRUNCATE TABLE requests RESTART IDENTITY', []))
  .then(() => 
    db.query(
      'INSERT INTO requests (title, description, type, status, trashed, feedback, owner, date, ownerId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      Object.values(requests[0]).map(el => el)
    ))
  .then(() => 
    db.query(
      'INSERT INTO requests (title, description, type, status, trashed, feedback, owner, date, ownerId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      Object.values(requests[1]).map(el => el)
    ))
  .then(() => 
    db.query(
      'INSERT INTO requests (title, description, type, status, trashed, feedback, owner, date, ownerId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      Object.values(requests[2]).map(el => el)
    ))
  .then(() => 
    db.query(
      'INSERT INTO requests (title, description, type, status, trashed, feedback, owner, date, ownerId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      Object.values(requests[3]).map(el => el)
    ))
  .then(() => 
    db.query(
      'INSERT INTO requests (title, description, type, status, trashed, feedback, owner, date, ownerId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      Object.values(requests[4]).map(el => el)
    ))
  .then(() => 
    db.query(
      'INSERT INTO requests (title, description, type, status, trashed, feedback, owner, date, ownerId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      Object.values(requests[5]).map(el => el)
    ))
  .then(() => 
    db.query(
      'INSERT INTO requests (title, description, type, status, trashed, feedback, owner, date, ownerId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      Object.values(requests[6]).map(el => el)
    ))
  .then(() => 
    db.query(
      'INSERT INTO requests (title, description, type, status, trashed, feedback, owner, date, ownerId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      Object.values(requests[7]).map(el => el)
    ))
  .catch((err) => {
    console.log(err);
  });

