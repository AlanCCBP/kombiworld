import { prisma } from '@/src/libs/prisma';
import { TicketStatus } from '@/prisma/generated/prisma/enums';
import { CreateJourneyLegInput } from './journeyLegs.types';
import { SELLABLE_TRIP_STATUSES } from '../trips/trips.types';

class JourneyLegsService {
  async createLeg(data: CreateJourneyLegInput, companyId: string) {
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: data.ticketId,
        deletedAt: null,
        status: TicketStatus.CONFIRMED,
        trip: {
          route: {
            companyId,
          },
        },
      },
      include: {
        trip: {
          include: {
            route: {
              include: {
                stops: true,
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      throw new Error('Ticket not found or not valid');
    }

    if (!SELLABLE_TRIP_STATUSES.has(ticket.trip.status)) {
      throw new Error('Trip not available for ticketing');
    }

    const { originStopId, destinationStopId } = ticket;

    const stopIds = ticket.trip.route.stops.map((s) => s.id);

    if (
      !stopIds.includes(originStopId) ||
      !stopIds.includes(destinationStopId)
    ) {
      throw new Error('Stops do not belong to route');
    }

    return prisma.journeyLeg.create({
      data: {
        journeyId: data.journeyId,
        ticketId: ticket.id,
        sequence: data.order,
      },
    });
  }

  async getLegsByJourney(journeyId: string, companyId: string) {
    return prisma.journeyLeg.findMany({
      where: {
        journeyId,
        deletedAt: null,
      },
      orderBy: {
        sequence: 'asc',
      },
      include: {
        journey: true,
        ticket: true,
      },
    });
  }
}

export default new JourneyLegsService();
