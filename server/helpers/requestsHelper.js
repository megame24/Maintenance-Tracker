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
  }
};
