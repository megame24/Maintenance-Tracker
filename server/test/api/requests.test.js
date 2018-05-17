import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';
import requests from '../../db/requests';
import testData from '../testData';

const { admin, regularUser } = testData;
let adminToken;
let regularUserToken;
const { expect } = chai;
chai.use(chaiHttp);

describe('Requests', () => {
  before((done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send({
        username: admin.username,
        password: admin.password
      })
      .end((err, res) => {
        adminToken = res.body.token;
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send({
        username: regularUser.username,
        password: regularUser.password
      })
      .end((err, res) => {
        regularUserToken = res.body.token;
        done();
      });
  });

  // Get requests route
  describe('GET /users/requests', () => {
    it('Should return all requests if user is an admin', (done) => {
      chai.request(server)
        .get('/api/v1/users/requests')
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(requests.length);
          done();
        });
    });
    it('Should return all requests belonging to a logged in user', (done) => {
      const numOfRequests = requests.filter(elem => elem.ownerId === regularUser.id).length;
      chai.request(server)
        .get('/api/v1/users/requests')
        .set({ authorization: regularUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(numOfRequests);
          done();
        });
    });
  });

  // Get request by id route
  describe('GET /users/requests/<requestId>', () => {

  });
});
