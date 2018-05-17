import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';
import requests from '../../db/requests';
import testData from '../testData';

const { admin, regularUser1, regularUser2 } = testData;
let adminToken;
let regularUser1Token;
let regularUser2Token;
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
        username: regularUser1.username,
        password: regularUser1.password
      })
      .end((err, res) => {
        regularUser1Token = res.body.token;
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send({
        username: regularUser2.username,
        password: regularUser2.password
      })
      .end((err, res) => {
        regularUser2Token = res.body.token;
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
      const numOfRequests = requests.filter(elem => elem.ownerId === regularUser1.id).length;
      chai.request(server)
        .get('/api/v1/users/requests')
        .set({ authorization: regularUser1Token })
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
    it('Should return a 404 error(request not found) for invalid id', (done) => {
      chai.request(server)
        .get('/api/v1/users/requests/20')
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request not found');
          done();
        });
    });
    it('Should only allow an admin or the owner of the request to retrieve it', (done) => {
      chai.request(server)
        .get(`/api/v1/users/requests/${regularUser1.requestsId[0]}`)
        .set({ authorization: regularUser2Token })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('You do not have permission to retrieve this request');
          done();
        });
    });
    it('Should allow the owner of the request to retrieve it', (done) => {
      chai.request(server)
        .get(`/api/v1/users/requests/${regularUser1.requestsId[0]}`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.ownerId).to.equal(regularUser1.id);
          done();
        });
    });
    it('Should allow an admin to retrieve the request', (done) => {
      chai.request(server)
        .get(`/api/v1/users/requests/${regularUser1.requestsId[0]}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.ownerId).to.not.equal(admin.id);
          done();
        });
    });
  });
});
