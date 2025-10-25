import { Request, Response, NextFunction } from 'express';
import { RouteService, UpsertRouteDTO } from '../services/routeService';

interface GetRoutesQuery {
  page?: string;
  limit?: string;
  name?: string;
}

interface GetRouteByIdParams {
  routeId: string;
}

interface DeleteRouteParams {
  routeId: string;
}

export const upsertRoute = async (
  req: Request<{}, {}, UpsertRouteDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const routeData = req.body;
    const route = await RouteService.upsertRoute(routeData);
    res.status(200).json(route);
  } catch (err) {
    next(err);
  }
};

export const getRouteById = async (
  req: Request<GetRouteByIdParams, {}, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { routeId } = req.params;
    const route = await RouteService.getRouteById(routeId);
    res.status(200).json(route);
  } catch (err) {
    next(err);
  }
};

export const getRoutes = async (
  req: Request<{}, {}, {}, GetRoutesQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, name } = req.query;

    const result = await RouteService.getRoutes({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      filterOptions: { name },
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteRoute = async (
  req: Request<DeleteRouteParams, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { routeId } = req.params;
    const route = await RouteService.deleteRoute(routeId);
    res.status(200).json({ message: 'Route deleted', route });
  } catch (err) {
    next(err);
  }
};

export default {
  upsertRoute,
  getRouteById,
  getRoutes,
  deleteRoute,
};
