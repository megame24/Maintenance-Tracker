import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app';
import testData from '../testData';

const {
  regularUser1
} = testData;
const { expect } = chai;
chai.use(chaiHttp);

const url = '/api/v1/users/login';

describe('Users', () => {
  // Log in user
  describe('Making a POST request to /users/login', () => {
    it('Should fail if either username or password was not provided', (done) => {
      chai.request(server)
        .post(`${url}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.a('object');
          expect(res.body.error.message).to.equal('Username and password required');
          done();
        });
    });
    it('Should fail if user with provided username do not exist', (done) => {
      chai.request(server)
        .post(`${url}`)
        .send({ username: 'invalidUsername', password: 'password' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.a('object');
          expect(res.body.error.message).to.equal('Invalid username or password');
          done();
        });
    });
    it('Should fail if password is incorrect', (done) => {
      chai.request(server)
        .post(`${url}`)
        .send({ username: regularUser1.username, password: 'password' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.a('object');
          expect(res.body.error.message).to.equal('Invalid username or password');
          done();
        });
    });
    it('Should login a user and return a token if credentials are correct', (done) => {
      chai.request(server)
        .post(`${url}`)
        .send({
          username: regularUser1.username,
          password: regularUser1.password
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.a('object');
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });
});
