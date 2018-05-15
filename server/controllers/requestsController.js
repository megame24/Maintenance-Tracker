import requests from '../db/requests';

const requestsController = {
  getRequests(req, res) {
    const { decoded } = req;
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
    const { decoded } = req;
    const requestId = Number(req.params.id);
    const request = requests.filter(element => element.id === requestId)[0];
    if (request) {
      if ((decoded.role === 'admin') || (decoded.id === request.ownerId)) {
        res.status(200).json({ request });
      } else {
        res.status(403).json({ error: { message: 'you do not have permission to view this page' } });
      }
    } else {
      res.status(404).json({ error: { message: 'request not found' } });
    }
  }
};

export default requestsController;
