import requestDB from '../models/requestDB';

class AdminController {
  static getRequests(req, res) {
    const { decoded } = req.body;
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: { message: 'You do not have permission to do that' } });
    }
    requestDB.getAllRequests()
      .then(result => res.status(200).json(result.rows));
  }
}

export default AdminController;
