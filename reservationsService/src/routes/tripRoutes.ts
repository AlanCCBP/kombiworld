import { Router } from 'express';
import tripController from '../controllers/tripController';

const router = Router();

router.post('/', tripController.upsertTrip);
router.get('/', tripController.getTrips);
router.get('/:tripId', tripController.getTripById);
router.delete('/:tripId', tripController.deleteTrip);

export default router;
