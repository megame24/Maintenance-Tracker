/* eslint-disable no-console */

import bcrypt from 'bcrypt';
import db from '../db/';

require('dotenv').config();

const salt = Number(process.env.SALT);

export default {
  registerUser(req) {
    const {
      fullname, email, username, password
    } = req.body;
    // encrypt password
    const hash = bcrypt.hashSync(password, salt);

    const newUser = [
      fullname,
      username,
      email,
      hash,
      'user'
    ];
    return db.query('INSERT INTO users (fullname, username, email, password, role) VALUES ($1, $2, $3, $4, $5)', newUser)
      .then(() => ({ success: { message: 'Registered successfully, login to make a request' } }));
  }
};
