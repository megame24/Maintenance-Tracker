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
  }
};

export default requestsController;
