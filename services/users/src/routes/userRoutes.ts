import { Router } from 'express';
import { auth } from '@/src/middlewares/authMiddleware';
import userController from '@/src/controllers/userController';

const router = Router();

router.post('/', auth, userController.createUser);
router.get('/', auth, userController.getUsers);
router.get('/:userId', auth, userController.getUser);
router.put('/:userId', auth, userController.updateUser);
router.delete('/:userId', auth, userController.deleteUser);

export default router;
