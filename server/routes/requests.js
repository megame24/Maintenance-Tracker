import express from 'express';
import requestsController from '../controllers/requestsController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware.verifyUser, requestsController.createRequest);
router.get('/', authMiddleware.verifyUser, requestsController.getRequests);
router.get('/:id', authMiddleware.verifyUser, requestsController.getRequestById);
router.put('/:id', authMiddleware.verifyUser, requestsController.updateRequest);
router.delete('/:id', authMiddleware.verifyUser, requestsController.deleteRequest);

export default router;
