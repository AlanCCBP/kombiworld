import { Request, Response } from 'express';
import JourneyLegsService from './journeyLegs.service';

export class JourneyLegsController {
  static async create(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;
      const { journeyId, ticketId, order } = req.body;

      if (!journeyId || !ticketId || order === undefined) {
        return res.status(400).json({ message: 'Invalid payload' });
      }

      const leg = await JourneyLegsService.createLeg(
        { journeyId, ticketId, order },
        companyId,
      );

      res.status(201).json(leg);
    } catch (error: any) {
      console.error('[JourneyLegs.create]', error);
      res.status(400).json({ message: error.message });
    }
  }

  static async getByJourney(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;
      const { journeyId } = req.params;

      const legs = await JourneyLegsService.getLegsByJourney(
        journeyId,
        companyId,
      );

      res.json(legs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch journey legs' });
    }
  }
}
