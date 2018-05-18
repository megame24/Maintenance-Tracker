import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';
import requests from '../../db/requests';
import testData from '../testData';

const {
  admin,
  regularUser1,
  regularUser2,
  request1,
  request2,
  request3,
  request4,
  invalidId
} = testData;
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
  describe('Making a GET request to /users/requests', () => {
    it('Should return all untrashed requests if user is an admin', (done) => {
      const numOfRequests = requests.filter(elem => !elem.trashed).length;
      chai.request(server)
        .get('/api/v1/users/requests')
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(numOfRequests);
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
  describe('Making a GET request to /users/requests/<requestId>', () => {
    it('Should return a 404 error(request not found) if id is invalid', (done) => {
      chai.request(server)
        .get(`/api/v1/users/requests/${invalidId}`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request not found');
          done();
        });
    });
    it('Should only allow an admin or the owner of a request to retrieve it', (done) => {
      chai.request(server)
        .get(`/api/v1/users/requests/${regularUser1.requestsId[0]}`)
        .set({ authorization: regularUser2Token })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('You do not have permission to do that');
          done();
        });
    });
    it('Should allow the owner of a request to retrieve it', (done) => {
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
    it('Should not retrieve a trashed request for an admin', (done) => {
      chai.request(server)
        .get(`/api/v1/users/requests/${regularUser1.requestsId[0]}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Cannot retrieve trashed request');
          done();
        });
    });
    it('Should allow admin to retrieve any request if it is not trashed', (done) => {
      chai.request(server)
        .get(`/api/v1/users/requests/${regularUser1.requestsId[1]}`)
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.ownerId).to.not.equal(admin.id);
          done();
        });
    });
  });

  // Create request route
  describe('Making a POST request to /users/requests', () => {
    it('Should only allow users to create a request', (done) => {
      chai.request(server)
        .post('/api/v1/users/requests')
        .set({ authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('You do not have permission to do that');
          done();
        });
    });
    it('Should not create a request if no \'title\' was provided', (done) => {
      chai.request(server)
        .post('/api/v1/users/requests')
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Title is required');
          done();
        });
    });
    it('Should not create a request if provided \'title\' is not unique', (done) => {
      chai.request(server)
        .post('/api/v1/users/requests')
        .send({ title: request1.title })
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request with that title already exists');
          done();
        });
    });
    it('Should not create a request if no \'description\' was provided', (done) => {
      chai.request(server)
        .post('/api/v1/users/requests')
        .send({ title: 'New request' })
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Description is required');
          done();
        });
    });
    it('Should not create a request if no \'type\' was provided', (done) => {
      chai.request(server)
        .post('/api/v1/users/requests')
        .send({
          title: 'New request',
          description: 'This is a new request'
        })
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request type is required');
          done();
        });
    });
    it('Should not create a request if \'type\' is niether \'maintenance\' nor \'repair\'', (done) => {
      chai.request(server)
        .post('/api/v1/users/requests')
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
        .post('/api/v1/users/requests')
        .send({
          title: 'New request',
          description: 'This is a new request',
          type: 'maintenance'
        })
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body.type).to.equal('maintenance');
          done();
          // remove the created request from memory after test
          requests.splice((requests.length - 1), 1);
        });
    });
    it('Should create a request if title and description are provide and type equals repair', (done) => {
      chai.request(server)
        .post('/api/v1/users/requests')
        .send({
          title: 'New request',
          description: 'This is a new request',
          type: 'repair'
        })
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body.type).to.equal('repair');
          done();
          // remove the created request from memory after test
          requests.splice((requests.length - 1), 1);
        });
    });
  });

  // Update a request
  describe('Making a PUT request to /users/requests/<requestId>', () => {
    it('Should return a 404 error(request not found) if id is invalid', (done) => {
      chai.request(server)
        .put(`/api/v1/users/requests/${invalidId}`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request not found');
          done();
        });
    });
    it('Should only allow an admin or the owner of a request to update it', (done) => {
      chai.request(server)
        .put(`/api/v1/users/requests/${regularUser1.requestsId[0]}`)
        .set({ authorization: regularUser2Token })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('You do not have permission to do that');
          done();
        });
    });
    describe('Admin making a PUT request to /users/requests/<requestId>', () => {
      describe('Error', () => {
        it('Should return a 400 error(Invalid request) if no \'status\' was provided', (done) => {
          chai.request(server)
            .put(`/api/v1/users/requests/${request1.id}`)
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body).to.be.a('object');
              expect(res.body.error.message).to.equal('Invalid request');
              done();
            });
        });
        it('Should return a 400 error(Invalid request) if provided \'status\' does not have value equal to \'approve\', \'disapprove\', nor \'resolve\'', (done) => {
          chai.request(server)
            .put(`/api/v1/users/requests/${request1.id}`)
            .send({ status: 'invalid' })
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body).to.be.a('object');
              expect(res.body.error.message).to.equal('Invalid request');
              done();
            });
        });
        it('Should not approve a request if the request is already disapproved or resolved', (done) => {
          chai.request(server)
            .put(`/api/v1/users/requests/${request1.id}`)
            .send({ status: 'approve' })
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body).to.be.a('object');
              expect(res.body.error.message).to.equal('Invalid request');
              done();
            });
        });
        it('Should not disapprove a request if the request is already approved or resolved', (done) => {
          chai.request(server)
            .put(`/api/v1/users/requests/${request2.id}`)
            .send({ status: 'disapprove' })
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body).to.be.a('object');
              expect(res.body.error.message).to.equal('Invalid request');
              done();
            });
        });
        it('Should not resolve a request if the request is not approved', (done) => {
          chai.request(server)
            .put(`/api/v1/users/requests/${request1.id}`)
            .send({ status: 'resolve' })
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body).to.be.a('object');
              expect(res.body.error.message).to.equal('Invalid request');
              done();
            });
        });
      });
      describe('Success', () => {
        afterEach((done) => {
          // reset request status after testing
          let resetRequest = requests.filter(elem => elem.id === request3.id)[0];
          resetRequest = Object.assign({}, resetRequest, { status: 'pending' });
          requests[requests.findIndex(elem => elem.id === resetRequest.id)] = resetRequest;
          done();
        });
        it('Should disapprove a pending request if provided \'status\' has a value of \'disapprove\'', (done) => {
          chai.request(server)
            .put(`/api/v1/users/requests/${request3.id}`)
            .send({ status: 'disapprove' })
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body.success.message).to.equal('Request disapproved');
              done();
            });
        });
        it('Should approve a pending request if provided \'status\' has a value of \'approve\'', (done) => {
          chai.request(server)
            .put(`/api/v1/users/requests/${request3.id}`)
            .send({ status: 'approve' })
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body.success.message).to.equal('Request approved');
              done();
            });
        });
        it('Should resolve an approved request if provided \'status\' has a value of \'resolve\'', (done) => {
          chai.request(server)
            .put(`/api/v1/users/requests/${request2.id}`)
            .send({ status: 'resolve' })
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body.success.message).to.equal('Request resolved');
              done();
            });
        });
      });
      describe('A user making a PUT request to /users/requests/<requestId>', () => {
        it('Should not update if request do not belong to user', (done) => {
          chai.request(server)
            .put(`/api/v1/users/requests/${regularUser1.requestsId[0]}`)
            .set({ authorization: regularUser2Token })
            .end((err, res) => {
              expect(res.status).to.equal(403);
              expect(res.body).to.be.a('object');
              expect(res.body.error.message).to.equal('You do not have permission to do that');
              done();
            });
        });
        it('Should not update if the request\'s status do not have a value of pending', (done) => {
          chai.request(server)
            .put(`/api/v1/users/requests/${regularUser1.requestsId[0]}`)
            .set({ authorization: regularUser1Token })
            .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body).to.be.a('object');
              expect(res.body.error.message).to.equal('You can only edit requests with status: pending');
              done();
            });
        });
        it('Should update if the request\'s status has a value of pending', (done) => {
          chai.request(server)
            .put(`/api/v1/users/requests/${regularUser1.requestsId[3]}`)
            .send({ title: 'updated title' })
            .set({ authorization: regularUser1Token })
            .end((err, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body.title).to.equal('updated title');
              done();
            });
        });
      });
    });
  });

  // Delete a single request route
  describe('Making a DELETE request to /users/requests/<requestId>', () => {
    it('Should return a 404 error(request not found) if id is invalid', (done) => {
      chai.request(server)
        .delete(`/api/v1/users/requests/${invalidId}`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request not found');
          done();
        });
    });
    it('Should not delete or trash a request if the request\'s status has a value of approved', (done) => {
      chai.request(server)
        .delete(`/api/v1/users/requests/${regularUser1.requestsId[1]}`)
        .set({ authorization: regularUser1Token })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('Request can not be deleted/trashed yet');
          done();
        });
    });
    it('Should only allow an admin or the owner to trash or delete the request respectively', (done) => {
      chai.request(server)
        .delete(`/api/v1/users/requests/${regularUser1.requestsId[0]}`)
        .set({ authorization: regularUser2Token })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.a('object');
          expect(res.body.error.message).to.equal('You do not have permission to do that');
          done();
        });
    });
    describe('Admin making a DELETE request to /users/requests/<requestId>', () => {
      it('Should not trash a pending request', (done) => {
        chai.request(server)
          .delete(`/api/v1/users/requests/${request3.id}`)
          .set({ authorization: adminToken })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.be.a('object');
            expect(res.body.error.message).to.equal('Request can not be trashed');
            done();
          });
      });
      it('Should return message(Request already trashed) if request\'s trash has a value of true', (done) => {
        chai.request(server)
          .delete(`/api/v1/users/requests/${request4.id}`)
          .set({ authorization: adminToken })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.be.a('object');
            expect(res.body.error.message).to.equal('Request can not be trashed');
            done();
          });
      });
      it('Should trash a request that has been dissaproved or resolved', (done) => {
        chai.request(server)
          .delete(`/api/v1/users/requests/${request2.id}`)
          .set({ authorization: adminToken })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.a('object');
            expect(res.body.success.message).to.equal('Request has been trashed');
            done();
          });
      });
    });
    describe('A user making a DELETE request to /users/requests/<requestId>', () => {
      it('Should delete the request if the user made the request', (done) => {
        chai.request(server)
          .delete(`/api/v1/users/requests/${regularUser1.requestsId[2]}`)
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
});
