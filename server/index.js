/* eslint-disable no-console */

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import users from './routes/users';
import requests from './routes/requests';
import authMiddleware from './middlewares/authMiddleware';

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/v1/users', users);

// verify user on all '/requests/' endpoints
app.use(authMiddleware.verifyUser);
app.use('/api/v1/users/requests', requests);

// allow unverified users to hit the get-all route
app.use(authMiddleware.allowUnverified);
app.get('*', (req, res) => {
  res.status(200).json({ message: 'Welcome to m-tracker\'s api' });
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
