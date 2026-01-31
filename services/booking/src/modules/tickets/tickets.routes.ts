import { Router } from 'express';
import { TicketsController } from './tickets.controller';
import { authenticate } from '@/src/middlewares/auth.middleware';
import { requireCompanyContext } from '@/src/middlewares/requireCompanyContext.middleware';

const router = Router();

router.use(authenticate);
router.use(requireCompanyContext);

router.post('/', TicketsController.create);
router.get('/', TicketsController.getAll);
router.get('/:ticketId', TicketsController.getById);
router.post('/:ticketId/cancel', TicketsController.cancel);

export default router;
