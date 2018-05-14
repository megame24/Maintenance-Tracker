/* eslint-disable no-console */

import morgan from 'morgan';
import app from './app';

const port = process.env.PORT || 8080;

app.use(morgan('dev'));

app.get('*', (req, res) => {
  res.send(200, 'Welcome to m-tracker\'s api');
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
