import express from 'express';
import requestsController from '../controllers/requestsController';
import authMiddleware from '../middlewares/authMiddleware';
import requestsMiddleware from '../middlewares/requestsMiddleware';

const router = express.Router();

router.get('/', authMiddleware.verifyUser, requestsController.getRequests);
router.post(
  '/',
  [authMiddleware.verifyUser, requestsMiddleware.isAUser],
  requestsController.createRequest
);
router.get(
  '/:id',
  [
    authMiddleware.verifyUser,
    requestsMiddleware.findRequest,
    requestsMiddleware.adminOrOwner
  ],
  requestsController.getRequestById
);
router.put(
  '/:id',
  [
    authMiddleware.verifyUser,
    requestsMiddleware.findRequest,
    requestsMiddleware.adminOrOwner,
    requestsMiddleware.beforeUpdate
  ],
  requestsController.updateRequest
);
router.delete(
  '/:id',
  [
    authMiddleware.verifyUser,
    requestsMiddleware.findRequest,
    requestsMiddleware.adminOrOwner,
    requestsMiddleware.freeToDelete
  ],
  requestsController.deleteRequest
);

export default router;
