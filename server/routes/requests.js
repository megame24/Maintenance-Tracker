import express from 'express';
import requestsController from '../controllers/requestsController';

const router = express.Router();

router.get('/', requestsController.getRequests);
router.post('/', requestsController.createRequest);
router.get('/:id', requestsController.getRequestById);

export default router;
