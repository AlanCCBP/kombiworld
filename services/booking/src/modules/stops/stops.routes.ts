import { Router } from 'express';
import { StopsController } from './stops.controller';
import { authenticate } from '@/src/middlewares/auth.middleware';
import { requireCompanyContext } from '@/src/middlewares/requireCompanyContext.middleware';

const router = Router();

router.use(authenticate);
router.use(requireCompanyContext);

router.post('/', StopsController.create);

router.get('/route/:routeId', StopsController.getById);

router.delete('/:id', StopsController.remove);

export default router;
