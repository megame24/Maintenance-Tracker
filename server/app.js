import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import users from './routes/users';
import requests from './routes/requests';
import admin from './routes/admin';

const app = express();

app.use('/', express.static(path.resolve(__dirname, '../client/')));
app.use('/docs', express.static(path.resolve(__dirname, '../docs/')));

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', users);
app.use('/api/v1', requests);
app.use('/api/v1', admin);

export default app;
