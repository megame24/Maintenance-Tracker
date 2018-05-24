import requestDB from '../models/requestDB';
import RequestsController from './RequestsController';

class AdminController extends RequestsController {
  static getRequests(req, res) {
    const { decoded } = req.body;
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: { message: 'You do not have permission to do that' } });
    }
    requestDB.getAllRequests()
      .then(result => res.status(200).json(result.rows));
  }

  static approveRequest(req, res) {
    const { request, status } = req.body;
    switch (true) {
      case status !== 'approve':
        return res.status(400).json({ error: { message: 'status is required to be equal to \'approve\'' } });
      case request.status === 'approved':
        return res.status(400).json({ error: { message: 'Request already approved' } });
      case request.status !== 'pending':
        return res.status(400).json({ error: { message: 'Only requests with status pending can be approved' } });
      default: 
        requestDB.updateStatus(['approved', request.id])
          .then(() => res.status(200).json({ success: { message: 'Request has been approved' } }));
    }
  }

  static disapproveRequest(req, res) {
    const { request, status } = req.body;
    switch (true) {
      case status !== 'disapprove':
        return res.status(400).json({ error: { message: 'status is required to be equal to \'disapprove\'' } });
      case request.status === 'disapproved':
        return res.status(400).json({ error: { message: 'Request already disapproved' } });
      case request.status !== 'pending':
        return res.status(400).json({ error: { message: 'Only requests with status pending can be approved' } });
      default: 
        requestDB.updateStatus(['disapproved', request.id])
          .then(() => res.status(200).json({ success: { message: 'Request has been disapproved' } }));
    }
  }

  static resolveRequest(req, res) {
    const { request, status } = req.body;
    switch (true) {
      case status !== 'resolve':
        return res.status(400).json({ error: { message: 'status is required to be equal to \'resolve\'' } });
      case request.status === 'resolved':
        return res.status(400).json({ error: { message: 'Request already resolved' } });
      case request.status !== 'approved':
        return res.status(400).json({ error: { message: 'Only requests with status approved can be resolved' } });
      default: 
        requestDB.updateStatus(['resolved', request.id])
          .then(() => res.status(200).json({ success: { message: 'Request has been resolved' } }));
    }
  }
}

export default AdminController;