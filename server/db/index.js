const { Pool } = require('pg');

require('dotenv').config();

let connectionString;
if (process.env.NODE_ENV === 'development') {
  connectionString = process.env.DATABASE_URL;
}

if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.DATABASE_TEST_URL;
}

if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.DATABASE_PRODUCTION_URL;
}


const pool = new Pool({ connectionString });

export default {
  query: (text, params) => pool.query(text, params)
};
