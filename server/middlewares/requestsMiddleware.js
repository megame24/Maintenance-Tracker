import requests from '../db/requests';

const requestMiddlware = {
  findRequest(req, res, next) {
    const requestId = Number(req.params.id);
    const request = requests.filter(elem => elem.id === requestId)[0];
    if (request) {
      req.body.request = request;
      return next();
    }
    res.status(404).json({ error: { message: 'Request not found' } });
  },

  adminOrOwner(req, res, next) {
    const { decoded, request } = req.body;
    if (decoded.role === 'admin') {
      return next();
    }
    if (decoded.id === request.ownerId) {
      return next();
    }
    res.status(403).json({ error: { message: 'You do not have permission to do that' } });
  },

  isAUser(req, res, next) {
    const { decoded } = req.body;
    if (decoded.role === 'user') {
      return next();
    }
    res.status(403).json({ error: { message: 'You do not have permission to do that' } });
  },

  beforeUpdate(req, res, next) {
    const { decoded, request } = req.body;
    let { status } = req.body;
    if (decoded.role === 'user') {
      // user can only update a pending request
      if (request.status === 'pending') {
        return next();
      }
      return res.status(400).json({ error: { message: 'You can only edit requests with status: pending' } });
    }
    // before admin updates a request
    if (status) {
      status = status.toLowerCase();
      if (status === 'resolve' && request.status === 'approved') return next();
      if ((status === 'approve' || status === 'disapprove') && request.status === 'pending') {
        return next();
      }
      res.status(400).json({ error: { message: 'Invalid request' } });
    } else {
      res.status(400).json({ error: { message: 'Invalid request' } });
    }
  },

  beforeDelete(req, res, next) {
    const { request, decoded } = req.body;
    // do not delete unresolved requests
    if (request.status !== 'approved') {
      if (decoded.role === 'user') {
        return next();
      }
      if (request.status !== 'pending' && !request.trashed) {
        return next();
      }
      return res.status(400).json({ error: { message: 'Request can not be trashed' } });
    }
    res.status(400).json({ error: { message: 'Request can not be deleted/trashed yet' } });
  }
};

export default requestMiddlware;