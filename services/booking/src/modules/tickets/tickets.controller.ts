import { Request, Response } from 'express';
import TicketsService from './tickets.service';

export class TicketsController {
  static async create(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;
      const { tripId, passengerId, originStopId, destinationStopId } = req.body;

      if (!tripId || !passengerId || !originStopId || !destinationStopId) {
        return res.status(400).json({ message: 'Invalid payload' });
      }

      const ticket = await TicketsService.createTicket(
        {
          tripId,
          passengerId,
          originStopId,
          destinationStopId,
        },
        companyId,
      );

      res.status(201).json(ticket);
    } catch (error: any) {
      console.error('[TicketsController.create]', error);
      res.status(400).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;
      const tickets = await TicketsService.getTickets(companyId);
      res.json(tickets);
    } catch (error) {
      console.error('[TicketsController.getAll]', error);
      res.status(500).json({ message: 'Failed to fetch tickets' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;
      const { ticketId } = req.params;

      const ticket = await TicketsService.getTicketById(ticketId, companyId);
      res.json(ticket);
    } catch (error: any) {
      console.error('[TicketsController.getById]', error);
      res.status(404).json({ message: error.message });
    }
  }

  static async cancel(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;
      const { ticketId } = req.params;

      await TicketsService.cancelTicket(ticketId, companyId);
      res.status(204).send();
    } catch (error: any) {
      console.error('[TicketsController.cancel]', error);
      res.status(400).json({ message: error.message });
    }
  }
}
