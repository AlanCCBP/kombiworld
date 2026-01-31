import { Request, Response } from 'express';
import tripsService from './trips.service';

class TripController {
  async upsertTrip(req: Request, res: Response) {
    const companyId = req.companyId!;

    const trip = await tripsService.upsertTrip(req.body, companyId);
    res.json(trip);
  }

  async getTrips(req: Request, res: Response) {
    const companyId = req.companyId!;

    const trips = await tripsService.getTrips(req.query, companyId);
    res.json(trips);
  }

  async getTripById(req: Request, res: Response) {
    const companyId = req.companyId!;
    const { tripId } = req.params;

    const trip = await tripsService.getTripById(tripId, companyId);
    res.json(trip);
  }

  async deleteTrip(req: Request, res: Response) {
    const companyId = req.companyId!;
    const { tripId } = req.params;

    await tripsService.deleteTrip(tripId, companyId);
    res.status(204).send();
  }
}

export default new TripController();
