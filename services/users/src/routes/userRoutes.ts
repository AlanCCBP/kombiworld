import { Router } from 'express';
import * as userController from '@/controllers/userController';
import { authenticate } from '@/middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, userController.createUser);
router.get('/', authenticate, userController.getUsers);
router.get('/:userId', authenticate, userController.getUser);
router.put('/:userId', authenticate, userController.updateUser);
router.delete('/:userId', authenticate, userController.deleteUser);

export default router;
