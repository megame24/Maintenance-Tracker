import requests from '../db/mock/mock-requests';
import requestDB from '../models/requestDB';

export default {
  foundRequest(req) {
    const requestId = Number(req.params.id);
    return requestDB.findRequestById(requestId)
      .then((result) => {
        const request = result.rows[0];
        if (request) {
          req.body.request = request;
          return true;
        }
        return false;
      });
  },

  createRequest(req) {
    const {
      title, description, type, decoded
    } = req.body;
    const newRequest = [
      title,
      description,
      type.toLowerCase(),
      'pending',
      false,
      '',
      decoded.fullname,
      Date.now(),
      decoded.id
    ];
    return requestDB.createRequest(newRequest)
      .then(() => ({ success: { message: 'Request created successfully' } }));
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
