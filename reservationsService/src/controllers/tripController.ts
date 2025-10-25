import { Request, Response, NextFunction } from 'express';
import { TripService, UpsertTripDTO } from '../services/tripService';

interface GetTripsByFilter {
  page?: string;
  limit?: string;
  tripIds?: string[];
  startDate?: Date;
  endDate?: Date;
  driverId?: string;
}

interface GetTripByIdParams {
  tripId: string;
}

interface DeleteTripParams {
  tripId: string;
}

export const upsertTrip = async (
  req: Request<{}, {}, UpsertTripDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tripData: UpsertTripDTO = req.body;
    const resp = await TripService.upsertTrip(tripData);
    res.status(200).json(resp);
  } catch (err) {
    next(err);
  }
};

export const getTripById = async (
  req: Request<{}, {}, GetTripByIdParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tripId } = req.body;
    const resp = await TripService.getTripById(tripId);
    res.status(200).json(resp);
  } catch (err) {
    next(err);
  }
};

export const getTrips = async (
  req: Request<{}, {}, GetTripsByFilter>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, tripIds, startDate, endDate, driverId } = req.body;

    const resp = await TripService.getTrips({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      filterOptions: { tripIds, startDate, endDate, driverId },
    });
    res.status(200).json(resp);
  } catch (err) {
    next(err);
  }
};

export const deleteTrip = async (
  req: Request<DeleteTripParams, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tripId } = req.params;
    const resp = await TripService.deleteTrip(tripId);
    res.status(200).json(resp);
  } catch (err) {
    next(err);
  }
};

export default {
  upsertTrip,
  getTripById,
  getTrips,
  deleteTrip,
};
