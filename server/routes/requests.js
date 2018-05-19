import express from 'express';
import requestsController from '../controllers/requestsController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware.verifyUser, requestsController.getRequests);
router.post('/', authMiddleware.verifyUser, requestsController.createRequest);
router.get(
  '/:id',
  [authMiddleware.verifyUser, authMiddleware.authorized],
  requestsController.getRequestById
);
router.put(
  '/:id',
  [authMiddleware.verifyUser, authMiddleware.authorized],
  requestsController.updateRequest
);
router.delete(
  '/:id',
  [authMiddleware.verifyUser, authMiddleware.authorized],
  requestsController.deleteRequest
);

export default router;
