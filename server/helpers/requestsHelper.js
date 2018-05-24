import requests from '../db/mock/mock-requests';
import requestss from '../models/requests';

export default {
  foundRequest(req) {
    const requestId = Number(req.params.id);
    return requestss.findRequestById(requestId)
      .then((result) => {
        const request = result.rows[0];
        if (request) {
          req.body.request = request;
          return true;
        }
        return false;
      });
  },

  isAUser(decoded) {
    if (decoded.role === 'user') {
      return true;
    }
    return false;
  },

  createRequest(req) {
    const {
      title, description, type, decoded
    } = req.body;
    // create new request's id by increasing the id of the last request in mock db(requests)
    const id = requests[requests.length - 1].id + 1;
    const newRequest = {
      id,
      title,
      description,
      type: type.toLowerCase(),
      status: 'pending',
      trashed: false,
      feedback: '',
      owner: decoded.fullname,
      date: Date.now(),
      ownerId: decoded.id
    };
    requests.push(newRequest);
    return newRequest;
  },

  canUpdate(req) {
    const { decoded, request } = req.body;
    let { status } = req.body;
    status = (status || '').toLowerCase();
    if (decoded.role === 'user') {
      if (request.status === 'pending') return { error: null };
      return { error: true, message: 'Only requests with status pending can be updated' };
    }
    if (status === 'resolve' && request.status === 'approved') return { error: null };
    if (status === 'approve' && request.status === 'pending') return { error: null };
    if (status === 'disapprove' && request.status === 'pending') return { error: null };
    return {
      error: true,
      message: {
        title: 'Invalid Request',
        detail: 'Ensure status is sent with the appropriate value(\'resolve\', \'approve\', or \'disapprove\')'
      }
    };
  },

  adminUpdateSuccess(req, res, status) {
    const { request } = req.body;
    const feedback = req.body.feedback || request.feedback;
    const updatedRequest = Object.assign({}, request, { status, feedback });
    // updating request in mock db
    requests[requests.findIndex(elem => elem.id === request.id)] = updatedRequest;
    return res.status(200).json({ success: { message: `Request ${status}` } });
  },

  userUpdateSuccess(req, res) {
    const { request } = req.body;
    const title = req.body.title || request.title;
    const description = req.body.description || request.description;
    let typeUpdate = (req.body.type || '').toLowerCase();
    if (typeUpdate !== 'maintenance' || typeUpdate !== 'repair') {
      typeUpdate = request.type;
    }
    const updatedRequest = Object
      .assign({}, request, { title, description, type: typeUpdate.toLowerCase() });
      // updating request in mock db
    requests[requests.findIndex(elem => elem.id === request.id)] = updatedRequest;
    res.status(200).json(updatedRequest);
  },

  canDelete(req) {
    const { request, decoded } = req.body;
    // cannot delete pending requests
    if (request.status !== 'approved') {
      if (decoded.role === 'user') {
        return { error: null };
      }
      // admin cannot trash pending requests
      if (request.status !== 'pending' && !request.trashed) {
        return { error: null };
      }
      return { error: true, message: 'Request can not be trashed' };
    }
    return { error: true, message: 'Request can not be deleted/trashed yet' };
  }
};
