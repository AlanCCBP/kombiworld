import { prisma } from '@/src/libs/prisma';
import { CreateRouteInput } from './routes.types';

export class RoutesService {
  static async create(companyId: string, data: CreateRouteInput) {
    return prisma.route.create({
      data: {
        companyId,
        name: data.name,
        basePrice: data.basePrice,
      },
    });
  }

  static async getAll(companyId: string) {
    return prisma.route.findMany({
      where: {
        companyId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getById(companyId: string, routeId: string) {
    return prisma.route.findFirst({
      where: {
        id: routeId,
        companyId,
        deletedAt: null,
      },
    });
  }

  static async softDelete(companyId: string, routeId: string) {
    return prisma.route.updateMany({
      where: {
        id: routeId,
        companyId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
