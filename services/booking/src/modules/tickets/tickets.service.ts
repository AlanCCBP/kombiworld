import { prisma } from '@/src/libs/prisma';
import { TicketStatus, TripStatus } from '@/prisma/generated/prisma/enums';
import { CreateTicketInput } from './tickets.types';
import { SELLABLE_TRIP_STATUSES } from '../trips/trips.types';

class TicketsService {
  async createTicket(data: CreateTicketInput, companyId: string) {
    return prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findFirst({
        where: {
          id: data.tripId,
          deletedAt: null,
          route: { companyId },
        },
        include: {
          route: true,
        },
      });

      if (!trip) {
        throw new Error('Trip not found');
      }

      if (!SELLABLE_TRIP_STATUSES.has(trip.status)) {
        throw new Error('Trip not available for ticketing');
      }

      if (trip.available <= 0) {
        throw new Error('No seats available');
      }

      const stops = await tx.stop.findMany({
        where: {
          id: {
            in: [data.originStopId, data.destinationStopId],
          },
          routeId: trip.routeId,
          deletedAt: null,
        },
      });

      if (stops.length !== 2) {
        throw new Error('Invalid stops');
      }

      const origin = stops.find((s) => s.id === data.originStopId)!;
      const destination = stops.find((s) => s.id === data.destinationStopId)!;

      if (origin.sequence >= destination.sequence) {
        throw new Error('Invalid stop order');
      }

      const price = trip.route.basePrice;

      const companyRevenue = price;
      const platformCommission = 0;

      const ticket = await tx.ticket.create({
        data: {
          tripId: trip.id,
          passengerId: data.passengerId,
          originStopId: origin.id,
          destinationStopId: destination.id,
          price,
          companyRevenue,
          platformCommission,
          status: TicketStatus.CONFIRMED,
        },
      });

      await tx.trip.update({
        where: { id: trip.id },
        data: {
          available: {
            decrement: 1,
          },
        },
      });

      return ticket;
    });
  }

  async getTickets(companyId: string) {
    return prisma.ticket.findMany({
      where: {
        deletedAt: null,
        trip: {
          route: {
            companyId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTicketById(ticketId: string, companyId: string) {
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        deletedAt: null,
        trip: {
          route: {
            companyId,
          },
        },
      },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return ticket;
  }

  async cancelTicket(ticketId: string, companyId: string) {
    return prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.findFirst({
        where: {
          id: ticketId,
          deletedAt: null,
          trip: {
            route: {
              companyId,
            },
          },
        },
      });

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      if (ticket.status === TicketStatus.CANCELLED) {
        return ticket;
      }

      await tx.ticket.update({
        where: { id: ticketId },
        data: {
          status: TicketStatus.CANCELLED,
        },
      });

      await tx.trip.update({
        where: { id: ticket.tripId },
        data: {
          available: {
            increment: 1,
          },
        },
      });

      return { success: true };
    });
  }
}

export default new TicketsService();
