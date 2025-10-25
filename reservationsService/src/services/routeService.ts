import { Prisma, PrismaClient, Route } from '@prisma/client';

const prisma = new PrismaClient();

export interface UpsertRouteDTO {
  id?: string;
  name: string;
  ticketPrice: number;
}

interface GetRouteOptions {
  page?: number;
  limit?: number;
  filterOptions?: {
    ids?: string[];
    name?: string;
  };
}

export class RouteService {
  static async upsertRoute(routeData: UpsertRouteDTO): Promise<Route> {
    const { id, ...data } = routeData;

    if (id) {
      try {
        return await prisma.route.update({
          where: { id },
          data: { ...data, updatedAt: new Date() },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          return await prisma.route.create({ data });
        }
        throw error;
      }
    }

    return await prisma.route.create({ data });
  }

  static async deleteRoute(id: string): Promise<Route> {
    return await prisma.route.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async getRouteById(id: string): Promise<Route | null> {
    return await prisma.route.findFirst({
      where: { id, deletedAt: null },
    });
  }

  static async getRoutes({
    page = 1,
    limit = 10,
    filterOptions = {},
  }: GetRouteOptions) {
    const skip = (page - 1) * limit;

    const where: Prisma.RouteWhereInput = {
      deletedAt: null,
      ...(filterOptions.ids?.length && { id: { in: filterOptions.ids } }),
      ...(filterOptions.name && {
        name: { contains: filterOptions.name, mode: 'insensitive' },
      }),
    };

    const [Routes, total] = await Promise.all([
      prisma.route.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.route.count({ where }),
    ]);

    return {
      Routes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
