import { Request, Response, NextFunction } from 'express';
import { StopService, UpsertStopDTO } from '../services/stopService';

interface GetStopsByRouteQuery {
  page?: string;
  limit?: string;
  name?: string;
}

interface GetStopsByRouteParams {
  routeId: string;
}

interface DeleteStopParams {
  stopId: string;
}

export const upsertStop = async (
  req: Request<{}, {}, UpsertStopDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stopData = req.body;
    const stop = await StopService.upsertStop(stopData);
    res.status(200).json(stop);
  } catch (err) {
    next(err);
  }
};

export const getStopsByRoute = async (
  req: Request<GetStopsByRouteParams, {}, {}, GetStopsByRouteQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { routeId } = req.params;
    const { page, limit, name } = req.query;

    const result = await StopService.getStopsByRoute({
      routeId,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      filterOptions: { name },
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteStop = async (
  req: Request<DeleteStopParams, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { stopId } = req.params;
    const stop = await StopService.deleteStop(stopId);
    res.status(200).json({ message: 'Stop deleted', stop });
  } catch (err) {
    next(err);
  }
};

export default {
  upsertStop,
  getStopsByRoute,
  deleteStop,
};
