import { Router } from 'express';
import { JourneyLegsController } from './journeyLegs.controller';
import { authenticate } from '@/src/middlewares/auth.middleware';
import { requireCompanyContext } from '@/src/middlewares/requireCompanyContext.middleware';

const router = Router();

router.use(authenticate);
router.use(requireCompanyContext);

router.post('/', JourneyLegsController.create);
router.get('/journey/:journeyId', JourneyLegsController.getByJourney);

export default router;
