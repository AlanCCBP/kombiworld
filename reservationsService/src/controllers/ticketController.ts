import { Request, Response, NextFunction } from 'express';
import { TicketService, UpsertTicketDTO } from '../services/ticketService';

interface GetTicketsByFilter {
  page?: string;
  limit?: string;
  tripIds?: string[];
  startDate?: Date;
  endDate?: Date;
  driverId?: string;
}

interface GetTicketByIdParams {
  ticketId: string;
}

interface DeleteTicketParams {
  ticketId: string;
}

export const upsertTicket = async (
  req: Request<{}, {}, UpsertTicketDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ticketData: UpsertTicketDTO = req.body;
    const resp = await TicketService.upsertTicket(ticketData);
    res.status(200).json(resp);
  } catch (err) {
    next(err);
  }
};

export const getTicketById = async (
  req: Request<{}, {}, GetTicketByIdParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ticketId } = req.body;
    const resp = await TicketService.getTicketById(ticketId);
    res.status(200).json(resp);
  } catch (err) {
    next(err);
  }
};

export const getTickets = async (
  req: Request<{}, {}, GetTicketsByFilter>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, tripIds, startDate, endDate, driverId } = req.body;

    const resp = await TicketService.getTickets({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      filterOptions: { tripIds, startDate, endDate, driverId },
    });
    res.status(200).json(resp);
  } catch (err) {
    next(err);
  }
};

export const deleteTicket = async (
  req: Request<DeleteTicketParams, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ticketId } = req.params;
    const resp = await TicketService.deleteTicket(ticketId);
    res.status(200).json(resp);
  } catch (err) {
    next(err);
  }
};

export default {
  upsertTicket,
  getTicketById,
  getTickets,
  deleteTicket,
};
