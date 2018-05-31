import requestDB from '../models/requestDB';

export default {
  /**
   * Find a request using it's id
   * @param {Object} req - request from client
   * @returns {Boolean} true if Request is found or false if not
   */
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

  /**
   * Send Request details to the database
   * @param {Object} req - request from client
   * @returns {Object} a promise that will resolve to a success message
   */
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
