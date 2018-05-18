import requests from '../db/requests';

const requestsController = {
  getRequests(req, res) {
    const { decoded } = req.body;
    if (decoded.role === 'admin') {
      const adminRequests = requests.filter(elem => !elem.trashed);
      return res.status(200).json(adminRequests);
    }
    const userRequests = requests.filter(elem => elem.ownerId === decoded.id);
    return res.status(200).json(userRequests);
  },

  getRequestById(req, res) {
    const { decoded, request } = req.body;
    if (decoded.id === request.ownerId) {
      return res.status(200).json(request);
    }
    if (decoded.role === 'admin' && !request.trashed) {
      res.status(200).json(request);
    } else {
      res.status(400).json({ error: { message: 'Cannot retrieve trashed request' } });
    }
  },

  createRequest(req, res) {
    const { title, description, type } = req.body;
    const duplicateRequest = requests.filter(elem => elem.title === title)[0];
    switch (false) {
      case !!title: {
        return res.status(400).json({ error: { message: 'Title is required' } });
      }
      // Ensure request title is unique
      case !duplicateRequest: {
        return res.status(400).json({ error: { message: 'Request with that title already exists' } });
      }
      case !!description: {
        return res.status(400).json({ error: { message: 'Description is required' } });
      }
      case !!type: {
        return res.status(400).json({ error: { message: 'Request type is required' } });
      }
      case type.toLowerCase() === 'maintenance' || type.toLowerCase() === 'repair': {
        return res.status(400).json({ error: { message: 'Request must be of either type maintenance or repair' } });
      }
      default: {
        // create id for new request by incrementing the id of the last request
        const id = requests[requests.length - 1].id + 1;
        const newRequest = {
          id,
          title,
          description,
          type: type.toLowerCase(),
          status: 'pending',
          trashed: false,
          feedback: '',
          ownerId: req.body.decoded.id
        };
        // store the new request in memory
        requests.push(newRequest);
        res.status(201).json(newRequest);
      }
    }
  },

  updateRequest(req, res) {
    const { decoded, request } = req.body;
    // admin can update requests' status through this endpoint
    if (decoded.role === 'admin') {
      const { status } = req.body;
      const feedback = req.body.feedback || request.feedback;
      if (status === 'resolve') {
        const updatedRequest = Object.assign({}, request, { status: 'resolved', feedback });
        requests[requests.findIndex(elem => elem.id === request.id)] = updatedRequest;
        return res.status(200).json({ success: { message: 'Request resolved' } });
      }
      if ((status === 'approve') || (status === 'disapprove')) {
        const updatedRequest = Object.assign({}, request, { status: `${status}d`, feedback });
        requests[requests.findIndex(elem => elem.id === request.id)] = updatedRequest;
        return res.status(200).json({ success: { message: `Request ${status}d` } });
      }
    }
    if (decoded.id === request.ownerId) {
      const title = req.body.title || request.title;
      const description = req.body.description || request.description;
      let typeUpdate = req.body.type || request.type;
      if (typeUpdate.toLowerCase() !== 'maintenance' || typeUpdate.toLowerCase() !== 'repair') {
        typeUpdate = request.type;
      }
      const updatedRequest = Object
        .assign({}, request, { title, description, type: typeUpdate.toLowerCase() });
      // store updated request in memory
      requests[requests.findIndex(elem => elem.id === request.id)] = updatedRequest;
      return res.status(200).json(updatedRequest);
    }
  },

  deleteRequest(req, res) {
    const { decoded, request } = req.body;
    // admin can only trash resolved or disapproved requests
    if (decoded.role === 'admin') {
      const trashedRequest = Object.assign({}, request, { trashed: true });
      // trash request in memory
      requests[requests.findIndex(elem => elem.id === request.id)] = trashedRequest;
      return res.status(200).json({ success: { message: 'Request has been trashed' } });
    }
    if (decoded.id === request.ownerId) {
      // remove request from memory
      requests.splice(requests.findIndex(ele => ele.id === request.id), 1);
      return res.status(200).json({ success: { message: 'Request has been deleted' } });
    }
  }
};

export default requestsController;
