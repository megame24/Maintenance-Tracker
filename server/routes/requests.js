import express from 'express';
import requestsController from '../controllers/requestsController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware.verifyUser, requestsController.getRequests);

export default router;
