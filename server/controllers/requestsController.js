import requests from '../db/requests';

const requestsController = {
  getRequests(req, res) {
    const { decoded } = req.body;
    // return all untrashed requests if logged in user is an admin
    if (decoded.role === 'admin') {
      const adminRequests = requests.filter(elem => !elem.trashed);
      return res.status(200).json(adminRequests);
    }
    // return only the requests made by logged in user
    const userRequests = requests.filter(elem => elem.ownerId === decoded.id);
    return res.status(200).json(userRequests);
  },

  getRequestById(req, res) {
    const { decoded } = req.body;
    const requestId = Number(req.params.id);
    const request = requests.filter(elem => elem.id === requestId)[0];
    if (request) {
      if (decoded.role === 'admin' || decoded.id === request.ownerId) {
        return res.status(200).json(request);
      }
      return res.status(403)
        .json({ error: { message: 'You do not have permission to retrieve this request' } });
    }
    return res.status(404).json({ error: { message: 'Request not found' } });
  },

  createRequest(req, res) {
    const {
      title,
      description,
      type,
      decoded
    } = req.body;
    if (decoded.role === 'user') {
      const duplicateRequest = requests.filter(elem => elem.title === title)[0];
      switch (false) {
        case !!title: {
          return res.status(400).json({ error: { message: 'Title is required' } });
        }
        // Ensure request title is unique
        case !duplicateRequest: {
          return res.status(400)
            .json({ error: { message: 'Request with that title already exists' } });
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
            ownerId: decoded.id
          };
          // store the new request in memory
          requests.push(newRequest);
          return res.status(201).json(newRequest);
        }
      }
    }
    res.status(403).json({ error: { message: 'You do not have permission to create a request' } });
  },

  updateRequest(req, res) {
    const { decoded } = req.body;
    const requestId = Number(req.params.id);
    const request = requests.filter(elem => elem.id === requestId)[0];
    if (request) {
      // admin can update requests' status through this endpoint
      if (decoded.role === 'admin') {
        const { status } = req.body;
        const feedback = req.body.feedback || request.feedback;

        /**
         * update the status of a request(set status to approved, disapproved, or resolved)
         * @param {String} statusUpdate - update for request's status
         * @param {Boolean} condition - update status if condition is true
         */
        const updateStatus = (statusUpdate, condition) => {
          if (request.status === statusUpdate) {
            return res.status(200).json({ success: { message: `Request already ${statusUpdate}` } });
          }
          if (condition) {
            const updatedRequest = Object.assign({}, request, { status: statusUpdate, feedback });
            // store updated request in memory
            requests[requests.findIndex(elem => elem.id === request.id)] = updatedRequest;
            return res.status(200).json({ success: { message: `Request ${statusUpdate}` } });
          }
          return res.status(400)
            .json({ error: { message: `Request not ${statusUpdate} due to status conflict` } });
        };

        switch (true) {
          case (!!status && status.toLowerCase() === 'resolve'): {
            return updateStatus('resolved', (request.status === 'approved'));
          }
          case (!!status && status.toLowerCase() === 'approve'): {
            return updateStatus('approved', (request.status === 'pending'));
          }
          case (!!status && status.toLowerCase() === 'disapprove'): {
            return updateStatus('disapproved', (request.status === 'pending'));
          }
          default: {
            return res.status(400).json({ error: { message: 'Invalid request' } });
          }
        }
      }
    
      // users can only update/edit pending requests
      if (decoded.id === request.ownerId) {
        if (request.status === 'pending') {
          const title = req.body.title || request.title;
          const description = req.body.description || request.description;
          let typeUpdate = req.body.type;
          if (!typeUpdate 
            || (typeUpdate.toLowerCase() !== 'maintenance' 
            || typeUpdate.toLowerCase() !== 'repair')) {
            typeUpdate = request.type;
          }
          const updatedRequest = Object
            .assign({}, request, { title, description, type: typeUpdate.toLowerCase() });
          // store updated request in memory
          requests[requests.findIndex(elem => elem.id === request.id)] = updatedRequest;
          return res.status(200).json(updatedRequest);
        }
        return res.status(400)
          .json({ error: { message: 'You can only edit requests with status: pending' } });
      }
      return res.status(403)
        .json({ error: { message: 'You do not have permission to update this request' } });
    }
    return res.status(404).json({ error: { message: 'Request not found' } });
  },

  deleteRequest(req, res) {
    const { decoded } = req.body;
    const requestId = Number(req.params.id);
    const request = requests.filter(element => element.id === requestId)[0];
    if (request) {
      // do not delete unresolved requests
      if (request.status !== 'approved') {
        // admin can only trash resolved or disapproved requests
        if (decoded.role === 'admin') {
          if (request.status !== 'pending') {
            if (request.trashed) {
              return res.status(200).json({ success: { message: 'Request already trashed' } });
            }
            const trashedRequest = Object.assign({}, request, { trashed: true });
            // trash request in memory
            requests[requests.findIndex(elem => elem.id === request.id)] = trashedRequest;
            return res.status(200).json({ success: { message: 'Request has been trashed' } });
          }
          return res.status(400).json({ error: { message: 'Request can not be trashed yet' } });
        }

        // user can only delete a request if they made it
        if (decoded.id === request.ownerId) {
          // remove request from memory
          requests.splice(requests.findIndex(ele => ele.id === request.id), 1);
          return res.status(200).json({ success: { message: 'Request has been deleted' } });
        }
        return res.status(403)
          .json({ error: { message: 'You do not have permission to delete/trash this request' } });
      }
      return res.status(400).json({ error: { message: 'Request can not be deleted/trashed yet' } });
    }
    return res.status(404).json({ error: { message: 'Request not found' } });
  }
};

export default requestsController;
