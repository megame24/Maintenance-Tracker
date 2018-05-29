import express from 'express';
import UsersController from '../controllers/UsersController';
import validationMiddleware from '../middlewares/validationMiddleware';

const router = express.Router();

router.post('/auth/login', UsersController.login);
router.post('/auth/signup', validationMiddleware.validateUser, UsersController.register);

export default router;
