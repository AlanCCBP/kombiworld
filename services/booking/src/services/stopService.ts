import { prisma } from '../lib/prisma';
import {
  PrismaClientKnownRequestError,
  StopWhereInput,
} from '@/prisma/generated/prisma/internal/prismaNamespace';
import { Stop } from '@/prisma/generated/prisma/client';

export interface UpsertStopDTO {
  id?: string;
  routeId: string;
  name: string;
  latitude: number;
  longitude: number;
  plusMins: number;
}

interface GetStopsOptions {
  routeId: string;
  page?: number;
  limit?: number;
  filterOptions?: {
    ids?: string[];
    name?: string;
  };
}

export class StopService {
  static async upsertStop(stopData: UpsertStopDTO): Promise<Stop> {
    try {
      return await prisma.stop.upsert({
        where: { id: stopData.id ?? '' },
        update: {
          name: stopData.name,
          latitude: stopData.latitude,
          longitude: stopData.longitude,
          plusMins: stopData.plusMins,
          updatedAt: new Date(),
        },
        create: {
          name: stopData.name,
          latitude: stopData.latitude,
          longitude: stopData.longitude,
          plusMins: stopData.plusMins,
          route: { connect: { id: stopData.routeId } },
        },
      });
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(`Stop or route not found`);
        }
      }
      throw error;
    }
  }

  static async deleteStop(id: string): Promise<Stop> {
    return await prisma.stop.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async getStopByName(name: string): Promise<Stop | null> {
    return await prisma.stop.findFirst({
      where: { name, deletedAt: null },
    });
  }

  static async getStopById(id: string): Promise<Stop | null> {
    return await prisma.stop.findFirst({
      where: { id, deletedAt: null },
    });
  }

  static async getStopsByRoute({
    routeId,
    page = 1,
    limit = 10,
    filterOptions = {},
  }: GetStopsOptions) {
    const skip = (page - 1) * limit;

    const where: StopWhereInput = {
      routeId,
      deletedAt: null,
      ...(filterOptions.ids?.length && { id: { in: filterOptions.ids } }),
      ...(filterOptions.name && {
        name: { contains: filterOptions.name, mode: 'insensitive' },
      }),
    };

    const [stops, total] = await Promise.all([
      prisma.stop.findMany({
        where,
        skip,
        take: limit,
        orderBy: { plusMins: 'asc' },
      }),
      prisma.stop.count({ where }),
    ]);

    return {
      stops,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getStopsByCity(routeId: string) {
    return await prisma.stop.findMany({
      where: { routeId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }
}
