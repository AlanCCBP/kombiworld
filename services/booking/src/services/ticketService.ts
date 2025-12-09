import { Prisma, PrismaClient, Ticket, Trip } from '@prisma/client';
import { UserServiceClient } from '../clients/userServiceClient';

const prisma = new PrismaClient();

interface GetTicketOptions {
  page?: number;
  limit?: number;
  filterOptions?: {
    passengerId?: string;
    tripIds?: string[];
    startDate?: Date;
    endDate?: Date;
    driverId?: string;
  };
}

export interface UpsertTicketDTO {
  id?: string;
  tripId: string;
  passengerId: string;
  originStopId: string;
  destinationStopId: string;
  paymentStatus: boolean;
  invoiceId: string;
}

export class TicketService {
  static async upsertTicket(ticketData: UpsertTicketDTO): Promise<Ticket> {
    try {
      const users = await UserServiceClient.getUserByUserId(
        ticketData.passengerId,
      );

      if (users.length === 0) {
        throw new Error(`User not found`);
      }

      if (ticketData.id) {
        return prisma.ticket.upsert({
          where: { id: ticketData.id },
          update: {
            passengerId: users[0].id,
            originStopId: ticketData.originStopId,
            destinationStopId: ticketData.destinationStopId,
            paymentStatus: ticketData.paymentStatus,
            invoiceId: ticketData.invoiceId,
            updatedAt: new Date(),
          },
          create: {
            passengerId: users[0].id,
            paymentStatus: ticketData.paymentStatus,
            invoiceId: ticketData.invoiceId,
            trip: { connect: { id: ticketData.tripId } },
            originStop: { connect: { id: ticketData.originStopId } },
            destinationStop: { connect: { id: ticketData.destinationStopId } },
          },
        });
      } else {
        return prisma.ticket.create({
          data: {
            passengerId: users[0].id,
            paymentStatus: ticketData.paymentStatus,
            invoiceId: ticketData.invoiceId,
            trip: { connect: { id: ticketData.tripId } },
            originStop: { connect: { id: ticketData.originStopId } },
            destinationStop: { connect: { id: ticketData.destinationStopId } },
          },
        });
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(`Trip or route not found`);
        }
      }
      throw error;
    }
  }

  static async deleteTicket(id: string): Promise<Ticket> {
    return await prisma.ticket.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async getTicketById(id: string): Promise<Ticket | null> {
    return await prisma.ticket.findFirst({
      where: { id, deletedAt: null },
    });
  }

  static async getTickets({
    page = 1,
    limit = 10,
    filterOptions = {},
  }: GetTicketOptions) {
    const skip = (page - 1) * limit;
    const { tripIds, startDate, endDate, driverId, passengerId } =
      filterOptions || {};

    const where: Prisma.TripWhereInput = {
      deletedAt: null,

      ...(tripIds?.length && {
        id: { in: tripIds },
      }),

      ...(passengerId && {
        passengerId,
      }),

      ...(driverId && {
        driverId,
      }),

      ...(startDate || endDate
        ? {
            departureTime: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take: limit,
        orderBy: { departureTime: 'desc' },
      }),
      prisma.trip.count({ where }),
    ]);

    return {
      trips,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
