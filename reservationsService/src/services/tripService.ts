import { Prisma, PrismaClient, Trip } from '@prisma/client';

const prisma = new PrismaClient();

interface GetTripsOptions {
  page?: number;
  limit?: number;
  filterOptions?: {
    tripIds?: string[];
    startDate?: Date;
    endDate?: Date;
    driverId?: string;
  };
}

export interface UpsertTripDTO {
  id?: string;
  routeId: string;
  departureTime: Date;
  available: boolean;
  driverId: string;
}

export class TripService {
  static async upsertTrip(tripData: UpsertTripDTO): Promise<Trip> {
    try {
      if (tripData.id) {
        return prisma.trip.upsert({
          where: { id: tripData.id },
          update: {
            routeId: tripData.routeId,
            departureTime: tripData.departureTime,
            available: tripData.available,
            driverId: tripData.driverId,
            updatedAt: new Date(),
          },
          create: {
            route: { connect: { id: tripData.routeId } },
            departureTime: tripData.departureTime,
            available: tripData.available,
            driverId: tripData.driverId,
          },
        });
      } else {
        return prisma.trip.create({
          data: {
            route: { connect: { id: tripData.routeId } },
            departureTime: tripData.departureTime,
            available: tripData.available,
            driverId: tripData.driverId,
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

  static async deleteTrip(id: string): Promise<Trip> {
    return await prisma.trip.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async getTripById(id: string): Promise<Trip | null> {
    return await prisma.trip.findFirst({
      where: { id, deletedAt: null },
    });
  }

  static async getTrips({
    page = 1,
    limit = 10,
    filterOptions = {},
  }: GetTripsOptions) {
    const skip = (page - 1) * limit;
    const { tripIds, startDate, endDate, driverId } = filterOptions || {};

    const where: Prisma.TripWhereInput = {
      deletedAt: null,

      ...(tripIds?.length && {
        id: { in: tripIds },
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
