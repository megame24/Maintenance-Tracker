import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app';
import testData from '../testData';

const {
  regularUser1
} = testData;
const { expect } = chai;
chai.use(chaiHttp);

const baseUrl = '/api/v1/users';

describe('Users', () => {
  // Log in user
  describe('Making a POST request to /users/login', () => {
    it('Should fail if either username or password was not provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/login`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Username and password required');
          done();
        });
    });
    it('Should fail if user with provided username do not exist', (done) => {
      chai.request(server)
        .post(`${baseUrl}/login`)
        .send({ username: 'invalidUsername', password: 'password' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Invalid username or password');
          done();
        });
    });
    it('Should fail if password is incorrect', (done) => {
      chai.request(server)
        .post(`${baseUrl}/login`)
        .send({ username: regularUser1.username, password: 'password' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Invalid username or password');
          done();
        });
    });
    it('Should login a user and return a token if credentials are correct', (done) => {
      chai.request(server)
        .post(`${baseUrl}/login`)
        .send({
          username: regularUser1.username,
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
  describe('Making a POST request to /users/register', () => {
    it('Should fail if fullname was not provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/register`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('fullname is required');
          done();
        });
    });
    it('Should fail if email was not provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/register`)
        .send({
          fullname: 'Full name'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('email is required');
          done();
        });
    });
    it('Should fail if username was not provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/register`)
        .send({
          fullname: 'Full name',
          email: 'emil@gmail.com'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('username is required');
          done();
        });
    });
    it('Should fail if username is not unique', (done) => {
      chai.request(server)
        .post(`${baseUrl}/register`)
        .send({
          fullname: 'Full name',
          email: 'emil@gmail.com',
          username: regularUser1.username,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('User with that username already exists');
          done();
        });
    });
    it('Should fail if password was not provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/register`)
        .send({
          fullname: 'Full name',
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
    it('Should register a user if all the needed data was provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/register`)
        .send({
          fullname: 'Full name',
          email: 'emil@gmail.com',
          username: 'username',
          password: 'password'
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body.success.message).to.equal('Registered successfully');
          done();
        });
    });
  });
});
