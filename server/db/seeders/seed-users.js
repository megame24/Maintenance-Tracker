import bcrypt from 'bcrypt';

require('dotenv').config();

const salt = Number(process.env.SALT);

export default [
  {
    fullname: 'John Wick',
    username: 'john',
    email: 'johnwick@gmail.com',
    password: bcrypt.hashSync(process.env.adminPass, salt),
    role: 'admin'
  },
  {
    fullname: 'Monkey D. Luffy',
    username: 'strawhat',
    email: 'monkeydluffy@gmail.com',
    password: bcrypt.hashSync(process.env.user1pass, salt),
    role: 'user'
  },
  {
    fullname: 'Harry Potter',
    username: 'wizard12',
    email: 'harrypotter@gmail.com',
    password: bcrypt.hashSync(process.env.user2pass, salt),
    role: 'user'
  },
  {
    fullname: 'Uzumaki Naruto',
    username: 'uzumaki',
    email: 'uzumakinaruto@gmail.com',
    password: bcrypt.hashSync(process.env.user3pass, salt),
    role: 'user'
  }
];
