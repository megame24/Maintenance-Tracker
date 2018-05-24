import express from 'express';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import AdminController from '../controllers/AdminController';

const router = express.Router();

router.get('/requests', AuthMiddleware.verifyUser, AdminController.getRequests);
router.put(
  '/requests/:id/approve',
  [AuthMiddleware.verifyUser, AuthMiddleware.adminPass],
  AdminController.approveRequest
);
router.put(
  '/requests/:id/disapprove',
  [AuthMiddleware.verifyUser, AuthMiddleware.adminPass],
  AdminController.disapproveRequest
);
// router.delete(
//   '/requests/:id/resolve',
//   [AuthMiddleware.verifyUser, AuthMiddleware.adminPass],
//   AdminController.resolveRequest
// );

export default router;
