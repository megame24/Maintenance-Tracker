import requestDB from '../models/requestDB';
import RequestsController from './RequestsController';
import errors from '../helpers/errorHelper';

class AdminController extends RequestsController {  
  /**
  * Gets all requests for an admin
  * @param {Object} req - request from client
  * @param {Object} res - array of Requests
  */
  static getRequests(req, res) {
    const { decoded } = req.body;
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: { message: 'You do not have permission to do that' } });
    }
    requestDB.getAllRequests()
      .then(result => res.status(200).json(result.rows))
      .catch(() => {
        res.status(500).json(errors.error500);
      });
  }

  /**
   * Approves a request
   * @param {Object} req - request from client
   * @param {Object} res - success message
   */
  static approveRequest(req, res) {
    const { request } = req.body;
    let { status, feedback } = req.body;
    feedback = feedback && feedback.trim() ? feedback.trim() : '';
    status = status && status.trim() ? status.trim() : undefined;
    switch (true) {
      case status !== 'approve':
        return res.status(400).json({ error: { message: 'status is required to be equal to \'approve\'' } });
      case request.status === 'approved':
        return res.status(400).json({ error: { message: 'Request already approved' } });
      case request.status !== 'pending':
        return res.status(400).json({ error: { message: 'Only requests with status pending can be approved' } });
      default: 
        requestDB.updateStatus(['approved', feedback, request.id])
          .then(() => res.status(200).json({ success: { message: 'Request has been approved' } }))
          .catch(() => {
            res.status(500).json(errors.error500);
          });
    }
  }

  /**
   * Disapproves a request
   * @param {Object} req - request from client
   * @param {Object} res - success message
   */
  static disapproveRequest(req, res) {
    const { request } = req.body;
    let { status, feedback } = req.body;
    feedback = feedback && feedback.trim() ? feedback.trim() : '';
    status = status && status.trim() ? status.trim() : undefined;
    switch (true) {
      case status !== 'disapprove':
        return res.status(400).json({ error: { message: 'status is required to be equal to \'disapprove\'' } });
      case request.status === 'disapproved':
        return res.status(400).json({ error: { message: 'Request already disapproved' } });
      case request.status !== 'pending':
        return res.status(400).json({ error: { message: 'Only requests with status pending can be approved' } });
      default: 
        requestDB.updateStatus(['disapproved', feedback, request.id])
          .then(() => res.status(200).json({ success: { message: 'Request has been disapproved' } }))
          .catch(() => {
            res.status(500).json(errors.error500);
          });
    }
  }

  /**
   * Resolves a request
   * @param {Object} req - request from client
   * @param {Object} res - success message
   */
  static resolveRequest(req, res) {
    const { request } = req.body;
    let { status, feedback } = req.body;
    feedback = feedback && feedback.trim() ? feedback.trim() : '';
    status = status && status.trim() ? status.trim() : undefined;
    switch (true) {
      case status !== 'resolve':
        return res.status(400).json({ error: { message: 'status is required to be equal to \'resolve\'' } });
      case request.status === 'resolved':
        return res.status(400).json({ error: { message: 'Request already resolved' } });
      case request.status !== 'approved':
        return res.status(400).json({ error: { message: 'Only requests with status approved can be resolved' } });
      default: 
        requestDB.updateStatus(['resolved', feedback, request.id])
          .then(() => res.status(200).json({ success: { message: 'Request has been resolved' } }))
          .catch(() => {
            res.status(500).json(errors.error500);
          });
    }
  }

  /**
   * Trash a request
   * @param {Object} req - request from client
   * @param {Object} res - success message
   */
  static trashRequest(req, res) {
    const { status, id } = req.body.request;
    switch (true) {
      case status === 'pending':
        return res.status(400).json({ error: { message: 'Requests with status pending cannot be trashed' } });
      case status === 'approved':
        return res.status(400).json({ error: { message: 'Requests with status approved cannot be trashed' } });
      default:
        requestDB.trashRequest(id)
          .then(() => res.status(200).json({ success: { message: 'Request has been trashed' } }))
          .catch(() => {
            res.status(500).json(errors.error500);
          });
    }
  }
}

export default AdminController;
