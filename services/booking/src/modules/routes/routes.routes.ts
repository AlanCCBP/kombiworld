import { Router } from 'express';
import { RoutesController } from './routes.controller';
import { authenticate } from '@/src/middlewares/auth.middleware';
import { requireCompanyContext } from '@/src/middlewares/requireCompanyContext.middleware';

const router = Router();

router.use(authenticate);
router.use(requireCompanyContext);

router.post('/', RoutesController.create);
router.get('/', RoutesController.getAll);
router.get('/:id', RoutesController.getById);

router.delete('/:id', RoutesController.remove);

export default router;
