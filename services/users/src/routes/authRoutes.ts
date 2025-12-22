import { Router } from 'express';
import authController from '../controllers/authController';
import { auth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getCurrentUser);

export default router;
