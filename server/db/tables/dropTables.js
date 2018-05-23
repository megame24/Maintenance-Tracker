/* eslint-disable no-console */

import db from '../';


db.query('DROP TABLE users', null)
  .then(() => {
    console.log('table dropped');
  })
  .catch((err) => {
    console.log(err);
  });

db.query('DROP TABLE requests', null)
  .then(() => {
    console.log('table dropped');
  })
  .catch((err) => {
    console.log(err);
  });
