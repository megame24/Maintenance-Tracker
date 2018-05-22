import requests from '../db/requests';
import requestsHelper from '../helpers/requestsHelper';

class RequestsController {
  static getRequests(req, res) {
    const { decoded } = req.body;
    if (decoded.role === 'admin') {
      const adminRequests = requests.filter(elem => !elem.trashed);
      return res.status(200).json(adminRequests);
    }
    const userRequests = requests.filter(elem => elem.ownerId === decoded.id);
    return res.status(200).json(userRequests);
  }

  static getRequestById(req, res) {
    const { decoded, request } = req.body;
    if (decoded.id === request.ownerId) {
      return res.status(200).json(request);
    }
    if (decoded.role === 'admin' && !request.trashed) {
      res.status(200).json(request);
    } else {
      res.status(400).json({ error: { message: 'Cannot retrieve trashed request' } });
    }
  }

  static createRequest(req, res) {
    const {
      title, description, type, decoded
    } = req.body;
    // only allow users to make a request
    if (!requestsHelper.isAUser(decoded)) {
      return res.status(403).json({ error: { message: 'You do not have permission to do that' } });
    }
    const duplicateRequest = requests.filter(elem => elem.title === title)[0];
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
        const newRequest = requestsHelper.createRequest(req);
        res.status(201).json(newRequest);
      }
    }
  }

  static updateRequest(req, res) {
    const canUpdate = requestsHelper.canUpdate(req);
    if (canUpdate.error) {
      return res.status(400).json({ error: { message: canUpdate.message } });
    }
    const { decoded } = req.body;
    if (decoded.role === 'admin') {
      const { status } = req.body;
      switch (true) {
        case status === 'approve':
          return requestsHelper.adminUpdateSuccess(req, res, 'approved');
        case status === 'disapprove':
          return requestsHelper.adminUpdateSuccess(req, res, 'disapproved');
        default:
          return requestsHelper.adminUpdateSuccess(req, res, 'resolved');
      }
    }
    return requestsHelper.userUpdateSuccess(req, res);
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
