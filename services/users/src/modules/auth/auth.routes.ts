import express from 'express';
import {
  login,
  register,
  refresh,
  logout,
} from '@/src/modules/auth/auth.controller';
import { authMiddleware } from '@/src/middlewares/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', authMiddleware, logout);

export default router;
