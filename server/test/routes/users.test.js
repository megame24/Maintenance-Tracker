import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app';
import testData from '../testData';

const {
  regularUser1
} = testData;
const { expect } = chai;
chai.use(chaiHttp);

const baseUrl = '/api/v1/auth';

describe('Users', () => {
  // Log in user
  describe('Making a POST request to /users/login', () => {
    it('Should fail if either username or password was not provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/login`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Username / email and password required');
          done();
        });
    });
    it('Should fail if user with provided username do not exist', (done) => {
      chai.request(server)
        .post(`${baseUrl}/login`)
        .send({ usernameOrEmail: 'invalidUsername', password: 'password' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Invalid username / email or password');
          done();
        });
    });
    it('Should fail if password is incorrect', (done) => {
      chai.request(server)
        .post(`${baseUrl}/login`)
        .send({ usernameOrEmail: regularUser1.username, password: 'password' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Invalid username / email or password');
          done();
        });
    });
    it('Should login a user with the username and return a token if credentials are correct', (done) => {
      chai.request(server)
        .post(`${baseUrl}/login`)
        .send({
          usernameOrEmail: regularUser1.username,
          password: regularUser1.password
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('token');
          done();
        });
    });
    it('Should login a user with the email and return a token if credentials are correct', (done) => {
      chai.request(server)
        .post(`${baseUrl}/login`)
        .send({
          usernameOrEmail: regularUser1.email,
          password: regularUser1.password
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });

  // Signup endpoint
  describe('Making a POST request to /users/signup', () => {
    it('Should fail if fullname was not provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          username: 'username1',
          email: 'x@x.com'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('fullname is required');
          done();
        });
    });
    it('Should fail if fullname do not contain just letters', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          username: 'username1',
          email: 'x@x.com',
          fullname: 'heydkdod$$$###'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('fullname can only contain letters, and must be greater than 2 but less than 40 characters long');
          done();
        });
    });
    it('Should fail if fullname is less than 2 characters long', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          username: 'username1',
          email: 'x@x.com',
          fullname: 'h'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('fullname can only contain letters, and must be greater than 2 but less than 40 characters long');
          done();
        });
    });
    it('Should fail if fullname is more than 40 characters long', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          username: 'username1',
          email: 'x@x.com',
          fullname: 'heydieowerijeijriejriejrihsfidjfieiroqieuhcuhduwheurhksjfidfeiwriereurufduhfuhruehrwedieowerijeijriejriejrihsfidjfieiroqieuhcuhduwheurhksjfidfeiwriereurufduhfuhruehrwedieowerijeijriejriejrihsfidjfieiroqieuhcuhduwheurhksjfidfeiwriereurufduhfuhruehrwe'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('fullname can only contain letters, and must be greater than 2 but less than 40 characters long');
          done();
        });
    });
    it('Should fail if email was not provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          fullname: 'full names',
          username: 'username123'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('email is required');
          done();
        });
    });
    it('Should fail if email is not valid', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          fullname: 'full names',
          username: 'username12',
          email: 'invalidEmail'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Please provide a valid email');
          done();
        });
    });
    it('Should fail if username was not provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          fullname: 'full names',
          email: 'x@x.com',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('username is required');
          done();
        });
    });
    it('Should fail if username do not contain only numbers and letters', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          fullname: 'full names',
          email: 'x@x.com',
          username: 'username1$$'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Username can only contain letters & numbers, and must be greater than 4 but less than 30 characters long');
          done();
        });
    });
    it('Should fail if username is less than 4 characters long', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          fullname: 'full names',
          email: 'x@x.com',
          username: 'use'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Username can only contain letters & numbers, and must be greater than 4 but less than 30 characters long');
          done();
        });
    });
    it('Should fail if username is more than 30 characters long', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          fullname: 'full names',
          email: 'x@x.com',
          username: 'dieowerijeijriejriejrihsfidjfieiroqieuhcuhduwheurhksjfidfeiwriereurufduhfuhruehrwe'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Username can only contain letters & numbers, and must be greater than 4 but less than 30 characters long');
          done();
        });
    });
    it('Should fail if password was not provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          fullname: 'Full names',
          email: 'emil@gmail.com',
          username: 'username',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('password is required');
          done();
        });
    });
    it('Should fail if password is less than 4 characters long', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          fullname: 'Full names',
          email: 'emil@gmail.com',
          username: 'username',
          password: 'pass'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('password must be more than 5 characters long');
          done();
        });
    });
    it('Should fail if username is not unique', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          fullname: 'Full names',
          email: 'emil@gmail.com',
          password: 'password123',
          username: regularUser1.username,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('User with that username already exists');
          done();
        });
    });
    it('Should fail if email is not unique', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          fullname: 'Full names',
          email: regularUser1.email,
          password: 'password123',
          username: 'regularUser1username',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('User with that email already exists');
          done();
        });
    });
    it('Should signup a user if all the needed data was provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/signup`)
        .send({
          fullname: 'Full names',
          email: 'emil@gmail.com',
          username: 'username',
          password: 'password12'
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body.success.message).to.equal('Registered successfully, login to make a request');
          done();
        });
    });
  });
});
