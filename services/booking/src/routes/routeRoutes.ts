import { Router } from 'express';
import routeController from '../controllers/routeController';

const router = Router();

router.post('/', routeController.upsertRoute);
router.get('/', routeController.getRoutes);
router.get('/:routeId', routeController.getRouteById);
router.delete('/:routeId', routeController.deleteRoute);

export default router;
