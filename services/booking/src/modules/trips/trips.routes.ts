import { Router } from 'express';
import tripsController from './trips.controller';

const router = Router();

router.post('/', tripsController.upsertTrip);
router.get('/', tripsController.getTrips);
router.get('/:tripId', tripsController.getTripById);
router.delete('/:tripId', tripsController.deleteTrip);

export default router;
