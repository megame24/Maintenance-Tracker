/* eslint-disable no-underscore-dangle */

import chai from 'chai';
import chaiHttp from 'chai-http';
import httpMocks from 'node-mocks-http';
import events from 'events';
import server from '../../app';
import testData from '../testData';
import authMiddleware from '../../middlewares/authMiddleware';

const { regularUser1, invalidToken } = testData;
let regularUser1Token;

const { expect } = chai;
chai.use(chaiHttp);

describe('AuthMiddleware', () => {
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
  describe('Calling verifyUser', () => {
    it('Should grant user access if valid token is provided', (done) => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/users/requests',
        headers: { authorization: regularUser1Token }
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
      const callback = () => {
        expect(request.body.decoded.id).to.equal(regularUser1.id);
        expect(request.body.decoded.username).to.equal(regularUser1.username);
      };
      authMiddleware.verifyUser(request, response, callback);
      expect(response.statusCode).to.equal(200);
      done();
    });
    it('Should deny user access if invalid token is provided', (done) => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/users/requests',
        headers: { authorization: invalidToken }
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
      const callback = () => {};
      authMiddleware.verifyUser(request, response, callback);
      expect(response.statusCode).to.equal(401);
      const data = JSON.parse(response._getData());
      expect(data).to.be.a('object');
      expect(data.error.message).to.equal('Authentication failed');
      done();
    });
    it('Should deny user access if no token is provided', (done) => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/users/requests'
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
      const callback = () => {};
      authMiddleware.verifyUser(request, response, callback);
      expect(response.statusCode).to.equal(401);
      const data = JSON.parse(response._getData());
      expect(data).to.be.a('object');
      expect(data.error.message).to.equal('Authentication failed');
      done();
    });
  });
});