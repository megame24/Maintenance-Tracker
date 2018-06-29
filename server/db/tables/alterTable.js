/* eslint-disable no-console */

import db from '../';

db.query('ALTER TABLE requests ADD deleted BOOLEAN default false', null)
  .then(() => {
    console.log('table altered');
  })
  .catch((err) => {
    console.log(err);
  });
