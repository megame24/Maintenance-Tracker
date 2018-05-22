import express from 'express';
import RequestsController from '../controllers/RequestsController';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = express.Router();

router.get('/users/requests', AuthMiddleware.verifyUser, RequestsController.getRequests);
router.post('/users/requests', AuthMiddleware.verifyUser, RequestsController.createRequest);
router.get(
  '/users/requests/:id',
  [AuthMiddleware.verifyUser, AuthMiddleware.authorized],
  RequestsController.getRequestById
);
router.put(
  '/users/requests/:id',
  [AuthMiddleware.verifyUser, AuthMiddleware.authorized],
  RequestsController.updateRequest
);
router.delete(
  '/users/requests/:id',
  [AuthMiddleware.verifyUser, AuthMiddleware.authorized],
  RequestsController.deleteRequest
);

export default router;
