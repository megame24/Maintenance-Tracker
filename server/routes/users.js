import express from 'express';
import UsersController from '../controllers/UsersController';

const router = express.Router();

router.post('/users/login', UsersController.login);
router.post('/users/register', UsersController.register);

export default router;
