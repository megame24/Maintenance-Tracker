/* eslint-disable no-console */

import morgan from 'morgan';
import app from './app';

const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('*', (req, res) => {
  res.status(200).json({ message: 'Welcome to m-tracker\'s api' });
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
