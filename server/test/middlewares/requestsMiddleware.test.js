/* eslint-disable no-underscore-dangle */

import chai from 'chai';
import chaiHttp from 'chai-http';
import httpMocks from 'node-mocks-http';
import events from 'events';
import testData from '../testData';
import requestsMiddleware from '../../middlewares/requestsMiddleware';

const {
  admin,
  regularUser1,
  regularUser2,
  invalidId,
  request1
} = testData;

const { expect } = chai;
chai.use(chaiHttp);

describe('requestsMiddleware', () => {
  // findRequest
  describe('Calling findRequest', () => {
    it('Should call the callback if request is found by id', (done) => {
      const request = httpMocks.createRequest({
        params: { id: request1.id },
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
      const callback = () => {
        expect(request.body.request).to.be.a('object');
        expect(request.body.request.id).to.equal(request1.id);
      };
      requestsMiddleware.findRequest(request, response, callback);
      expect(response.statusCode).to.equal(200);
      done();
    });
    it('Should return a 404 error if request is not found by id', (done) => {
      const request = httpMocks.createRequest({
        params: { id: invalidId },
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
      const callback = () => {
        expect(1).to.equal(2);
      };
      requestsMiddleware.findRequest(request, response, callback);
      expect(response.statusCode).to.equal(404);
      const data = JSON.parse(response._getData());
      expect(data).to.be.a('object');
      expect(data.error.message).to.equal('Request not found');
      done();
    });
  });

  // adminOrOwner
  describe('Calling adminOrOwner', () => {
    it('Should call the callback if role is admin', (done) => {
      const request = httpMocks.createRequest({
        body: { decoded: admin }
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
      const callback = () => {
        expect(1).to.equal(1);
      };
      requestsMiddleware.adminOrOwner(request, response, callback);
      expect(response.statusCode).to.equal(200);
      done();
    });
    it('Should call the callback if request belongs to user', (done) => {
      const request = httpMocks.createRequest({
        body: {
          decoded: regularUser1,
          request: { ownerId: regularUser1.id }
        }
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
      const callback = () => {
        expect(1).to.equal(1);
      };
      requestsMiddleware.adminOrOwner(request, response, callback);
      expect(response.statusCode).to.equal(200);
      done();
    });
    it('Should return a 403 error if request do not belong to user', (done) => {
      const request = httpMocks.createRequest({
        body: {
          decoded: regularUser1,
          request: { ownerId: regularUser2.id }
        }
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
      const callback = () => {
        expect(1).to.equal(2);
      };
      requestsMiddleware.adminOrOwner(request, response, callback);
      expect(response.statusCode).to.equal(403);
      const data = JSON.parse(response._getData());
      expect(data).to.be.a('object');
      expect(data.error.message).to.equal('You do not have permission to do that');
      done();
    });
  });

  // isAUser
  describe('Calling isAUser', () => {
    it('Should call the callback if role is user', (done) => {
      const request = httpMocks.createRequest({
        body: { decoded: regularUser1 }
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
      const callback = () => {
        expect(1).to.equal(1);
      };
      requestsMiddleware.isAUser(request, response, callback);
      expect(response.statusCode).to.equal(200);
      done();
    });
    it('Should return a 403 error if role is not user', (done) => {
      const request = httpMocks.createRequest({
        body: { decoded: admin }
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
      const callback = () => {
        expect(1).to.equal(2);
      };
      requestsMiddleware.isAUser(request, response, callback);
      expect(response.statusCode).to.equal(403);
      const data = JSON.parse(response._getData());
      expect(data).to.be.a('object');
      expect(data.error.message).to.equal('You do not have permission to do that');
      done();
    });
  });

  // beforeUpdate
  describe('Calling beforeUpdate', () => {
    describe('When role is user', () => {
      it('Should call the callback if request\'s status is pending', (done) => {
        const request = httpMocks.createRequest({
          body: {
            decoded: regularUser1,
            request: { status: 'pending' }
          }
        });
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter
        });
        const callback = () => {
          expect(1).to.equal(1);
        };
        requestsMiddleware.beforeUpdate(request, response, callback);
        expect(response.statusCode).to.equal(200);
        done();
      });
      it('Should return 400 error if request\'s status is not pending', (done) => {
        const request = httpMocks.createRequest({
          body: {
            decoded: regularUser1,
            request: { status: 'approved' }
          }
        });
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter
        });
        const callback = () => {
          expect(1).to.equal(2);
        };
        requestsMiddleware.beforeUpdate(request, response, callback);
        expect(response.statusCode).to.equal(400);
        const data = JSON.parse(response._getData());
        expect(data).to.be.a('object');
        expect(data.error.message).to.equal('You can only edit requests with status: pending');
        done();
      });
    });
    describe('When role is admin', () => {
      it('Should return 400 error if status is missing in request body', (done) => {
        const request = httpMocks.createRequest({
          body: { decoded: admin }
        });
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter
        });
        const callback = () => {
          expect(1).to.equal(2);
        };
        requestsMiddleware.beforeUpdate(request, response, callback);
        expect(response.statusCode).to.equal(400);
        const data = JSON.parse(response._getData());
        expect(data).to.be.a('object');
        expect(data.error.message).to.equal('Invalid request');
        done();
      });
      it('Should return 400 error if status is not resolve, disapprove nor approve', (done) => {
        const request = httpMocks.createRequest({
          body: {
            decoded: admin,
            status: 'invalid'
          }
        });
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter
        });
        const callback = () => {
          expect(1).to.equal(2);
        };
        requestsMiddleware.beforeUpdate(request, response, callback);
        expect(response.statusCode).to.equal(400);
        const data = JSON.parse(response._getData());
        expect(data).to.be.a('object');
        expect(data.error.message).to.equal('Invalid request');
        done();
      });
      it('Should return 400 error if status is \'resolve\', but request\'s status is not \'approved\'', (done) => {
        const request = httpMocks.createRequest({
          body: {
            decoded: admin,
            status: 'resolve',
            request: { status: 'disapproved' }
          }
        });
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter
        });
        const callback = () => {
          expect(1).to.equal(2);
        };
        requestsMiddleware.beforeUpdate(request, response, callback);
        expect(response.statusCode).to.equal(400);
        const data = JSON.parse(response._getData());
        expect(data).to.be.a('object');
        expect(data.error.message).to.equal('Invalid request');
        done();
      });
      it('Should call the callback if status is \'resolve\', and request\'s status is \'approved\'', (done) => {
        const request = httpMocks.createRequest({
          body: {
            decoded: admin,
            status: 'resolve',
            request: { status: 'approved' }
          }
        });
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter
        });
        const callback = () => {
          expect(1).to.equal(1);
        };
        requestsMiddleware.beforeUpdate(request, response, callback);
        expect(response.statusCode).to.equal(200);
        done();
      });
      it('Should return 400 error if status is \'approve\' or \'disapprove\', but request\'s status is not \'pending\'', (done) => {
        const request = httpMocks.createRequest({
          body: {
            decoded: admin,
            status: 'approve',
            request: { status: 'disapproved' }
          }
        });
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter
        });
        const callback = () => {
          expect(1).to.equal(2);
        };
        requestsMiddleware.beforeUpdate(request, response, callback);
        expect(response.statusCode).to.equal(400);
        const data = JSON.parse(response._getData());
        expect(data).to.be.a('object');
        expect(data.error.message).to.equal('Invalid request');
        done();
      });
      it('Should call the callback if status is \'approve\' or \'disapprove\', and request\'s status is \'pending\'', (done) => {
        const request = httpMocks.createRequest({
          body: {
            decoded: admin,
            status: 'disapprove',
            request: { status: 'pending' }
          }
        });
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter
        });
        const callback = () => {
          expect(1).to.equal(1);
        };
        requestsMiddleware.beforeUpdate(request, response, callback);
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });

  // beforeDelete
  describe('Calling beforeDelete', () => {
    it('Should return 400 error if request\'s status is \'approved\'', (done) => {
      const request = httpMocks.createRequest({
        body: { request: { status: 'approved' } }
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
      const callback = () => {
        expect(1).to.equal(2);
      };
      requestsMiddleware.beforeDelete(request, response, callback);
      expect(response.statusCode).to.equal(400);
      const data = JSON.parse(response._getData());
      expect(data).to.be.a('object');
      expect(data.error.message).to.equal('Request can not be deleted/trashed yet');
      done();
    });
    it('Should call the callback if role is user and request\'s status is not \'approved\'', (done) => {
      const request = httpMocks.createRequest({
        body: {
          decoded: regularUser1,
          request: { status: 'pending' }
        }
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
      const callback = () => {
        expect(1).to.equal(1);
      };
      requestsMiddleware.beforeDelete(request, response, callback);
      expect(response.statusCode).to.equal(200);
      done();
    });
    describe('When role is admin', () => {
      it('Should return 400 error if request\'s status is \'pending\'', (done) => {
        const request = httpMocks.createRequest({
          body: {
            decoded: admin,
            request: { status: 'pending' }
          }
        });
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter
        });
        const callback = () => {
          expect(1).to.equal(2);
        };
        requestsMiddleware.beforeDelete(request, response, callback);
        expect(response.statusCode).to.equal(400);
        const data = JSON.parse(response._getData());
        expect(data).to.be.a('object');
        expect(data.error.message).to.equal('Request can not be trashed');
        done();
      });
      it('Should return 400 error if request has trashed set to true', (done) => {
        const request = httpMocks.createRequest({
          body: {
            decoded: admin,
            request: { trashed: true }
          }
        });
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter
        });
        const callback = () => {
          expect(1).to.equal(2);
        };
        requestsMiddleware.beforeDelete(request, response, callback);
        expect(response.statusCode).to.equal(400);
        const data = JSON.parse(response._getData());
        expect(data).to.be.a('object');
        expect(data.error.message).to.equal('Request can not be trashed');
        done();
      });
      it('Should call the callback if request\'s status is not \'pending\' and its \'trashed\' is set to false', (done) => {
        const request = httpMocks.createRequest({
          body: {
            decoded: admin,
            request: {
              trashed: false,
              status: 'resolved'
            }
          }
        });
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter
        });
        const callback = () => {
          expect(1).to.equal(1);
        };
        requestsMiddleware.beforeDelete(request, response, callback);
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });
});
