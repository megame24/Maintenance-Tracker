import requests from '../db/mock/mock-requests';
import requestsHelper from '../helpers/requestsHelper';
import requestDB from '../models/requestDB';

class RequestsController {
  static getRequests(req, res) {
    const { decoded } = req.body;
    requestDB.getUserRequests(decoded.id)
      .then((result) => {
        const userRequests = result.rows;
        return res.status(200).json(userRequests);
      });
  }

  static getRequestById(req, res) {
    const { request } = req.body;
    return res.status(200).json(request);
  }

  static createRequest(req, res) {
    const {
      title, description, type
    } = req.body;
    let duplicateRequest;
    requestDB.findRequestByTitle(title)
      .then((result) => {
        if (result.rows[0]) {
          duplicateRequest = result.rows[0].title;
        } else {
          duplicateRequest = null;
        }
        switch (false) {
          case !!title: 
            return res.status(400).json({ error: { message: 'title is required' } });
          case !duplicateRequest: 
            return res.status(400).json({ error: { message: 'Request with that title already exists' } });
          case !!description: 
            return res.status(400).json({ error: { message: 'description is required' } });
          case !!type: 
            return res.status(400).json({ error: { message: 'type is required' } });
          case type.toLowerCase() === 'maintenance' || type.toLowerCase() === 'repair':
            res.status(400).json({ error: { message: 'Request must be of either type maintenance or repair' } });
            break;
          default: {
            requestsHelper.createRequest(req)
              .then(message => res.status(201).json(message));
          }
        }
      });
  }

  static updateRequest(req, res) {
    const { request } = req.body;
    if (request.status === 'pending') {
      const title = req.body.title || request.title;
      const description = req.body.description || request.description;
      let typeUpdate = (req.body.type || '').toLowerCase();
      if (typeUpdate !== 'maintenance' || typeUpdate !== 'repair') {
        typeUpdate = request.type;
      }
      const requestUpdate = [title, description, typeUpdate, request.id];
      requestDB.updateRequest(requestUpdate)
        .then(() => res.status(200).json({ success: { message: 'Request updated successfully' } }));
    } else {
      return res.status(400).json({ error: { message: 'Only requests with status pending can be updated' } });
    }
  }

  static deleteRequest(req, res) {
    const canDelete = requestsHelper.canDelete(req);
    if (canDelete.error) {
      return res.status(400).json({ error: { message: canDelete.message } });
    }
    const { decoded, request } = req.body;
    if (decoded.role === 'admin') {
      // trash request in mock db by setting trashed to true
      const trashedRequest = Object.assign({}, request, { trashed: true });
      requests[requests.findIndex(elem => elem.id === request.id)] = trashedRequest;
      return res.status(200).json({ success: { message: 'Request has been trashed' } });
    }
    requests.splice(requests.findIndex(ele => ele.id === request.id), 1);
    return res.status(200).json({ success: { message: 'Request has been deleted' } });
  }
}

export default RequestsController;
