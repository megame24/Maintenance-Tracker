import express from 'express';
import UsersController from '../controllers/UsersController';

const router = express.Router();

router.post('/auth/login', UsersController.login);
router.post('/auth/signup', UsersController.register);

export default router;
