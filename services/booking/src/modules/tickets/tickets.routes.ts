import { Router } from 'express';
import ticketController from '../controllers/ticketController';

const router = Router();

router.post('/', ticketController.upsertTicket);
router.get('/', ticketController.getTickets);
router.get('/:ticketId', ticketController.getTicketById);
router.delete('/:ticketId', ticketController.deleteTicket);

export default router;
