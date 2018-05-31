import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app';
import requests from '../../db/mock/mock-requests';
import testData from '../testData';

const {
  admin,
  regularUser1,
  request3,
  request2,
  request1,
  request6,
  request4,
  invalidId
} = testData;
let adminToken;
let regularUser1Token;
const { expect } = chai;
chai.use(chaiHttp);

const baseUrl = '/api/v1';

describe('Admin', () => {
  before((done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
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
      .post('/api/v1/auth/login')
      .send({
        username: regularUser1.username,
        password: regularUser1.password
      })
      .end((err, res) => {
        regularUser1Token = res.body.token;
        done();
      });
  });
 
  // Get requests route
  describe('Making a GET request to /requests', () => {
    it('Should return all requests if user is an admin', (done) => {
      const numOfRequests = requests.length;
      chai.request(server)
        .get(`${baseUrl}/requests`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(numOfRequests);
          done();
        });
    });
    it('Should return error for user with role not equal to admin', (done) => {
      chai.request(server)
        .get(`${baseUrl}/requests`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('You do not have permission to do that');
          done();
        });
    });
  });

  // Approve request route
  describe('Making a PUT request to /requests/<requestId>/approve', () => {
    it('Should not allow a regular user to approve request', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${request3.id}/approve`)
        .set({ authorization: regularUser1Token })
        .send({ status: 'approve' })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('You do not have permission to do that');
          done();
        });
    });
    it('Should return an error if provided status is not equal to approve', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${request3.id}/approve`)
        .set({ authorization: adminToken })
        .send({ status: 'disapprove' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('status is required to be equal to \'approve\'');
          done();
        });
    });
    it('Should return an error if request is already approved', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${request2.id}/approve`)
        .set({ authorization: adminToken })
        .send({ status: 'approve' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request already approved');
          done();
        });
    });
    it('Should return an error if request\'s status is not pending', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${request1.id}/approve`)
        .set({ authorization: adminToken })
        .send({ status: 'approve' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Only requests with status pending can be approved');
          done();
        });
    });
    it('Should return an error if an invalid id is passed', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${invalidId}/approve`)
        .set({ authorization: adminToken })
        .send({ status: 'approve' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request not found');
          done();
        });
    });
    it('Should approve the request if no error was encountered', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${request3.id}/approve`)
        .set({ authorization: adminToken })
        .send({ status: 'approve' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.success.message).to.equal('Request has been approved');
          done();
        });
    });
  });

  // Disapprove request route
  describe('Making a PUT request to /requests/<requestId>/disapprove', () => {
    it('Should return an error if provided status is not equal to disapprove', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${request3.id}/disapprove`)
        .set({ authorization: adminToken })
        .send({ status: 'approve' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('status is required to be equal to \'disapprove\'');
          done();
        });
    });
    it('Should return an error if request is already disapproved', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${request1.id}/disapprove`)
        .set({ authorization: adminToken })
        .send({ status: 'disapprove' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request already disapproved');
          done();
        });
    });
    it('Should return an error if request\'s status is not pending', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${request2.id}/disapprove`)
        .set({ authorization: adminToken })
        .send({ status: 'disapprove' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Only requests with status pending can be approved');
          done();
        });
    });
    it('Should disapprove the request if no error was encountered', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${request6.id}/disapprove`)
        .set({ authorization: adminToken })
        .send({ status: 'disapprove' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.success.message).to.equal('Request has been disapproved');
          done();
        });
    });
  });

  // Resolve request route
  describe('Making a PUT request to /requests/<requestId>/resolve', () => {
    it('Should return an error if provided status is not equal to resolve', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${request3.id}/resolve`)
        .set({ authorization: adminToken })
        .send({ status: 'approve' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('status is required to be equal to \'resolve\'');
          done();
        });
    });
    it('Should return an error if request is already resolved', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${request4.id}/resolve`)
        .set({ authorization: adminToken })
        .send({ status: 'resolve' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request already resolved');
          done();
        });
    });
    it('Should return an error if request\'s status is not approved', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${request1.id}/resolve`)
        .set({ authorization: adminToken })
        .send({ status: 'resolve' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Only requests with status approved can be resolved');
          done();
        });
    });
    it('Should return a 500 error(Internal server error) if id passed is not an integer', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/abc/disapprove`)
        .set({ authorization: adminToken })
        .send({ status: 'resolve' })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Internal server error, check your request parameters or check back later');
          done();
        });
    });
    it('Should resolve the request if no error was encountered', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${request2.id}/resolve`)
        .set({ authorization: adminToken })
        .send({ status: 'resolve' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.success.message).to.equal('Request has been resolved');
          done();
        });
    });
  });
});
