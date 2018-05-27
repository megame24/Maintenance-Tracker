/* eslint-disable no-console */

import path from 'path';
import morgan from 'morgan';
import app from './app';

const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/api/v1/docs', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../docs/index.html'));
});

app.get('*', (req, res) => {
  res.status(200).json({ message: 'Welcome to m-tracker\'s api' });
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
