import { Router } from 'express';
import { authenticate } from '@/src/middlewares/authMiddleware';
import userController from '@/src/controllers/userController';

const router = Router();

router.post('/', authenticate, userController.createUser);
router.get('/', authenticate, userController.getUsers);
router.get('/:userId', authenticate, userController.getUser);
router.put('/:userId', authenticate, userController.updateUser);
router.delete('/:userId', authenticate, userController.deleteUser);
router.post('/login', authenticate, userController.loginUser);
router.post('/register', authenticate, userController.registerUser);

export default router;
