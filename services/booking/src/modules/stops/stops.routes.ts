import { Router } from 'express';
import { StopsController } from './stops.controller';
import { authenticate } from '@/src/middlewares/auth.middleware';
import { requireCompanyContext } from '@/src/middlewares/requireCompanyContext.middleware';

const router = Router();

router.use(authenticate);
router.use(requireCompanyContext);

router.post('/route/:routeId', StopsController.create);

router.get('/route/:routeId', StopsController.getAll);

router.get('/route/:routeId/:id', StopsController.getById);

router.delete('/route/:routeId/:id', StopsController.remove);

export default router;
