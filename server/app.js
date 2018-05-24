import express from 'express';
import bodyParser from 'body-parser';
import auth from './routes/auth';
import requests from './routes/requests';
import admin from './routes/admin';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', auth);
app.use('/api/v1', requests);
app.use('/api/v1', admin);

export default app;
