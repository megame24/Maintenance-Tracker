import requests from '../db/requests';

const requestsController = {
  getRequests(req, res) {
    const { decoded } = req.body;
    // return all requests if loggedin user is an admin
    if (decoded.role === 'admin') {
      res.status(200).json({ requests });
    } else {
      // return only the requests made by loggedin user
      const userRequests = requests.filter(element => element.ownerId === decoded.id);
      res.status(200).json({ userRequests });
    }
  },
  getRequestById(req, res) {
    const { decoded } = req.body;
    const requestId = Number(req.params.id);
    const request = requests.filter(element => element.id === requestId)[0];
    if (request) {
      if ((decoded.role === 'admin') || (decoded.id === request.ownerId)) {
        res.status(200).json({ request });
      } else {
        res.status(403).json({ error: { message: 'You do not have permission to view this page' } });
      }
    } else {
      res.status(404).json({ error: { message: 'Request not found' } });
    }
  },
  createRequest(req, res) {
    const {
      title,
      description,
      type,
      decoded
    } = req.body;
    const duplicateRequest = requests.filter(element => element.title === title)[0];
    switch (false) {
      case !!title: {
        res.status(400).json({ error: { message: 'Title is required' } });
        break;
      }
      // Ensure request title is unique
      case !duplicateRequest: {
        res.status(400).json({ error: { message: 'Request with that title already exists' } });
        break;
      }
      case !!description: {
        res.status(400).json({ error: { message: 'Description is required' } });
        break;
      }
      case !!type: {
        res.status(400).json({ error: { message: 'Request type is required' } });
        break;
      }
      default: {
        // create id for new request by incrementing the id of the last request
        const id = requests[requests.length - 1].id + 1;
        const newRequest = {
          id,
          title,
          description,
          type,
          resolved: false,
          approved: false,
          disapproved: false,
          trashed: false,
          feedback: '',
          ownerId: decoded.id
        };
        // store the new request in memory
        requests.push(newRequest);
        res.status(201).json({ newRequest });
      }
    }
  }
};

export default requestsController;
