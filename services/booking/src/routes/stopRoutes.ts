import { Router } from 'express';
import stopController from '../controllers/stopController';

const router = Router();

router.post('/', stopController.upsertStop);
router.get('/byRoute/:routeId', stopController.getStopsByRoute);
router.delete('/:stopId', stopController.deleteStop);

export default router;
