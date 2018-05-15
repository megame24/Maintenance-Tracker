import express from 'express';
import requestsController from '../controllers/requestsController';

const router = express.Router();

router.post('/', requestsController.createRequest);
router.get('/', requestsController.getRequests);
router.get('/:id', requestsController.getRequestById);
router.put('/:id', requestsController.updateRequest);
router.delete('/:id', requestsController.deleteRequest);

export default router;
