import requestsHelper from '../helpers/requestsHelper';
import requestDB from '../models/requestDB';
import errors from '../helpers/errorHelper';

class RequestsController {
  /**
   * Gets all requests belonging to a logged in user
   * @param {Object} req - request from the client
   * @param {Object} res - array of Requests
   */
  static getRequests(req, res) {
    const { decoded } = req.body;
    requestDB.getUserRequests(decoded.id)
      .then((result) => {
        const userRequests = result.rows;
        return res.status(200).json(userRequests);
      })
      .catch(() => {
        res.status(500).json(errors.error500);
      });
  }

  /**
   * Gets a single request for a logged in user
   * @param {Object} req - request from client
   * @param {Object} res - Request object
   */
  static getRequestById(req, res) {
    const { request } = req.body;
    return res.status(200).json(request);
  }

  /**
   * Creates a request
   * @param {*} req - request from client
   * @param {*} res - success message
   */
  static createRequest(req, res) {
    const { title, description, type } = req.body;
    switch (false) {
      case !!title && !!title.trim(): 
        return res.status(400).json({ error: { message: 'title is required' } });
      case !!description && !!description.trim(): 
        return res.status(400).json({ error: { message: 'description is required' } });
      case !!type && !!type.trim(): 
        return res.status(400).json({ error: { message: 'type is required' } });
      case type.toLowerCase().trim() === 'maintenance' || type.toLowerCase().trim() === 'repair':
        res.status(400).json({ error: { message: 'Request must be of either type maintenance or repair' } });
        break;
      default: {
        requestsHelper.createRequest(req)
          .then(message => res.status(201).json(message));
      }
    }
  }

  /**
   * Updates a request
   * @param {*} req - request from client
   * @param {*} res - success message
   */
  static updateRequest(req, res) {
    const { request } = req.body;
    if (request.status === 'pending') {
      const title = req.body.title || request.title;
      const description = req.body.description || request.description;
      let typeUpdate = (req.body.type || '').toLowerCase();
      if (typeUpdate !== 'maintenance' && typeUpdate !== 'repair') {
        typeUpdate = request.type;
      }
      const requestUpdate = [title, description, typeUpdate, request.id];
      requestDB.updateRequest(requestUpdate)
        .then(() => res.status(200).json({ success: { message: 'Request updated successfully' } }))
        .catch(() => {
          res.status(500).json(errors.error500);
        });
    } else {
      return res.status(400).json({ error: { message: 'Only requests with status pending can be updated' } });
    }
  }

  /**
   * Deletes a request
   * @param {*} req - request from client
   * @param {*} res - success message
   */
  static deleteRequest(req, res) {
    const { status, id } = req.body.request;
    if (status === 'approved') {
      return res.status(400).json({ error: { message: 'Requests being worked on cannot be deleted' } });
    }
    requestDB.deleteRequest(id)
      .then(() => res.status(200).json({ success: { message: 'Request has been deleted' } }))
      .catch(() => res.status(500).json(errors.error500));
  }
}

export default RequestsController;
