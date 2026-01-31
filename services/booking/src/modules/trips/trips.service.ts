import { prisma } from '@/src/libs/prisma';
import { UpsertTripInput } from './trips.types';
import { TripStatus } from '@/prisma/generated/prisma/enums';

class TripService {
  async upsertTrip(data: UpsertTripInput, companyId: string) {
    const route = await prisma.route.findFirst({
      where: {
        id: data.routeId,
        companyId,
        deletedAt: null,
      },
    });

    if (!route) {
      throw new Error('Route not found');
    }

    const driver = await prisma.driver.findFirst({
      where: {
        id: data.driverId,
        companyId,
        deletedAt: null,
      },
    });

    if (!driver) {
      throw new Error('Driver not found');
    }

    if (data.id) {
      const existingTrip = await prisma.trip.findFirst({
        where: {
          id: data.id,
          route: {
            companyId,
          },
          deletedAt: null,
        },
      });

      if (!existingTrip) {
        throw new Error('Trip not found');
      }

      if (data.capacity < existingTrip.capacity) {
        const sold = existingTrip.capacity - existingTrip.available;
        if (data.capacity < sold) {
          throw new Error('Capacity below sold tickets');
        }
      }

      return prisma.trip.update({
        where: { id: data.id },
        data: {
          routeId: data.routeId,
          driverId: data.driverId ?? existingTrip.driverId,
          departureTime: data.departureTime,
          capacity: data.capacity,
          status: data.status ?? existingTrip.status,
        },
      });
    }

    return prisma.trip.create({
      data: {
        routeId: data.routeId,
        driverId: data.driverId,
        departureTime: data.departureTime,
        capacity: data.capacity,
        available: data.capacity,
        status: data.status ?? TripStatus.SCHEDULED,
      },
    });
  }

  async getTrips(filters: any, companyId: string) {
    const { routeId, dateFrom, dateTo, status } = filters;

    return prisma.trip.findMany({
      where: {
        routeId: routeId || undefined,
        status: status ? status.toUpperCase() : undefined,
        deletedAt: null,
        route: {
          companyId,
        },
        departureTime: {
          gte: dateFrom ? new Date(dateFrom) : undefined,
          lte: dateTo ? new Date(dateTo) : undefined,
        },
      },
      orderBy: {
        departureTime: 'asc',
      },
    });
  }

  async getTripById(tripId: string, companyId: string) {
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        deletedAt: null,
        route: {
          companyId,
        },
      },
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    return trip;
  }

  async deleteTrip(tripId: string, companyId: string) {
    const result = await prisma.trip.updateMany({
      where: {
        id: tripId,
        deletedAt: null,
        route: {
          companyId,
        },
      },
      data: {
        deletedAt: new Date(),
      },
    });

    if (result.count === 0) {
      throw new Error('Trip not found');
    }
  }
}

export default new TripService();
