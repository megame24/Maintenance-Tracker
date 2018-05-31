import express from 'express';
import RequestsController from '../controllers/RequestsController';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = express.Router();

router.get('/users/requests', AuthMiddleware.verifyUser, RequestsController.getRequests);
router.post('/users/requests', AuthMiddleware.verifyUser, RequestsController.createRequest);
router.get(
  '/users/requests/:id',
  [AuthMiddleware.verifyUser, AuthMiddleware.userPass],
  RequestsController.getRequestById
);
router.put(
  '/users/requests/:id',
  [AuthMiddleware.verifyUser, AuthMiddleware.userPass],
  RequestsController.updateRequest
);
router.delete(
  '/users/requests/:id',
  [AuthMiddleware.verifyUser, AuthMiddleware.userPass],
  RequestsController.deleteRequest
);

export default router;
