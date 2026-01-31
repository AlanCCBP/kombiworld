import { prisma } from '@/src/libs/prisma';
import { CreateStopInput } from './stops.types';

export class StopsService {
  static async create(
    companyId: string,
    routeId: string,
    data: CreateStopInput,
  ) {
    return prisma.stop.create({
      data: {
        nameRaw: data.nameRaw,
        nameNormalized: data.nameNormalized,
        city: data.city,
        province: data.province,
        latitude: data.latitude,
        longitude: data.longitude,
        plusMinutes: data.plusMinutes ?? 0,
        sequence: data.sequence ?? 0,

        route: {
          connect: {
            id: routeId,
            companyId,
          },
        },
      },
    });
  }

  static async getAll(companyId: string, routeId: string) {
    return prisma.stop.findMany({
      where: {
        routeId,
        deletedAt: null,
        route: {
          companyId,
        },
      },
      orderBy: {
        sequence: 'asc',
      },
    });
  }

  static async getById(companyId: string, routeId: string, stopId: string) {
    return prisma.stop.findFirst({
      where: {
        id: stopId,
        routeId,
        deletedAt: null,
        route: {
          companyId,
        },
      },
    });
  }

  static async softDelete(companyId: string, routeId: string, stopId: string) {
    return prisma.stop.updateMany({
      where: {
        id: stopId,
        routeId,
        deletedAt: null,
        route: {
          companyId,
        },
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
