import express from 'express';
import bodyParser from 'body-parser';
import users from './routes/users';
import requests from './routes/requests';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/users', users);
app.use('/api/v1/users/requests', requests);

export default app;
