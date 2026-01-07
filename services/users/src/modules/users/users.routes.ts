import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import * as usersController from './users.controller';

const router = Router();

router.get('/me', authMiddleware, usersController.getMe);

export default router;
