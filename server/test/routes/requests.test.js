import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app';
import requests from '../../db/mock/mock-requests';
import testData from '../testData';

const {
  regularUser1,
  regularUser2,
  request1,
  invalidId
} = testData;
let regularUser1Token;
let regularUser2Token;
const { expect } = chai;
chai.use(chaiHttp);

const baseUrl = '/api/v1/users';

describe('Requests', () => {
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
  before((done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
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
  describe('Making a GET request to /users/requests', () => {
    it('Should return all requests belonging to a logged in user', (done) => {
      const numOfRequests = requests.filter(elem => elem.ownerId === regularUser1.id).length;
      chai.request(server)
        .get(`${baseUrl}/requests`)
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
  describe('Making a GET request to /users/requests/<requestId>', () => {
    it('Should return a 404 error(request not found) if id is invalid', (done) => {
      chai.request(server)
        .get(`${baseUrl}/requests/${invalidId}`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request not found');
          done();
        });
    });
    it('Should return a 500 error(Internal server error) if id is not an integer', (done) => {
      chai.request(server)
        .get(`${baseUrl}/requests/abc`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Internal server error, check your request parameters or check back later');
          done();
        });
    });
    it('Should not allow any user other than the owner of a request to retrieve it', (done) => {
      chai.request(server)
        .get(`${baseUrl}/requests/${regularUser1.requestsId[0]}`)
        .set({ authorization: regularUser2Token })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('You do not have permission to do that');
          done();
        });
    });
    it('Should fail if the id is not an integer', (done) => {
      chai.request(server)
        .get(`${baseUrl}/requests/abc`)
        .set({ authorization: regularUser2Token })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Internal server error, check your request parameters or check back later');
          done();
        });
    });
    it('Should allow the owner of a request to retrieve it', (done) => {
      chai.request(server)
        .get(`${baseUrl}/requests/${regularUser1.requestsId[0]}`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(Number(res.body.ownerid)).to.equal(regularUser1.id);
          done();
        });
    });
  });

  // Create request route
  describe('Making a POST request to /users/requests', () => {
    it('Should not create a request if no \'title\' was provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/requests`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('title is required');
          done();
        });
    });
    it('Should not create a request if no \'description\' was provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/requests`)
        .send({ title: 'New request' })
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('description is required');
          done();
        });
    });
    it('Should not create a request if no \'type\' was provided', (done) => {
      chai.request(server)
        .post(`${baseUrl}/requests`)
        .send({
          title: 'New request',
          description: 'This is a new request'
        })
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('type is required');
          done();
        });
    });
    it('Should not create a request if \'type\' is niether \'maintenance\' nor \'repair\'', (done) => {
      chai.request(server)
        .post(`${baseUrl}/requests`)
        .send({
          title: 'New request',
          description: 'This is a new request',
          type: 'not-maintenance-nor-repair'
        })
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request must be of either type maintenance or repair');
          done();
        });
    });
    it('Should create a request if title and description are provide and type equals maintenance', (done) => {
      chai.request(server)
        .post(`${baseUrl}/requests`)
        .send({
          title: 'New request',
          description: 'This is a new request',
          type: 'maintenance'
        })
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body.success.message).to.equal('Request created successfully');
          done();
        });
    });
    it('Should create a request if title and description are provide and type equals repair', (done) => {
      chai.request(server)
        .post(`${baseUrl}/requests`)
        .send({
          title: 'New request still',
          description: 'This is a new request',
          type: 'repair'
        })
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body.success.message).to.equal('Request created successfully');
          done();
        });
    });
  });

  // Update a request
  describe('Making a PUT request to /users/requests/<requestId>', () => {
    it('Should return a 404 error(request not found) if id is invalid', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${invalidId}`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request not found');
          done();
        });
    });
    it('Should only the owner of a request to update it', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${regularUser1.requestsId[0]}`)
        .set({ authorization: regularUser2Token })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('You do not have permission to do that');
          done();
        });
    });
    it('Should not update if the request is not pending', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${regularUser1.requestsId[0]}`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Only requests with status pending can be updated');
          done();
        });
    });
    it('Should update if the request\'s status has a value of pending', (done) => {
      chai.request(server)
        .put(`${baseUrl}/requests/${regularUser1.requestsId[3]}`)
        .send({ title: 'updated title' })
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.success.message).to.equal('Request updated successfully');
          done();
        });
    });
  });
  
  // Delete a request
  describe('Making a DELETE request to /users/requests/<requestId>', () => {
    it('Should not delete if the request has a status of approved', (done) => {
      chai.request(server)
        .delete(`${baseUrl}/requests/${regularUser1.requestsId[1]}`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Requests being worked on cannot be deleted');
          done();
        });
    });
    it('Should delete if the request\'s status has a value other than approved', (done) => {
      chai.request(server)
        .delete(`${baseUrl}/requests/${regularUser1.requestsId[3]}`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.success.message).to.equal('Request has been deleted');
          done();
        });
    });
  });
});
