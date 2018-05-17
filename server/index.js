/* eslint-disable no-console */

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import users from './routes/users';
import requests from './routes/requests';

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/users', users);
app.use('/api/v1/users/requests', requests);

app.get('*', (req, res) => {
  res.status(200).json({ message: 'Welcome to m-tracker\'s api' });
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

export default app;
