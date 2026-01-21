import { Request, Response } from 'express';
import { StopsService } from './stops.service';

export class StopsController {
  static async create(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;
      const { routeId } = req.params;

      const stop = await StopsService.create(companyId, routeId, req.body);

      res.status(201).json(stop);
    } catch (error) {
      console.error('[StopsController.create]', error);
      res.status(500).json({ message: 'Failed to create stop' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;
      const { routeId } = req.params;

      const stops = await StopsService.getAll(companyId, routeId);
      res.json(stops);
    } catch (error) {
      console.error('[StopsController.getAll]', error);
      res.status(500).json({ message: 'Failed to fetch stops' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;
      const { routeId, id } = req.params;

      const stop = await StopsService.getById(companyId, routeId, id);

      if (!stop) {
        return res.status(404).json({ message: 'Stop not found' });
      }

      res.json(stop);
    } catch (error) {
      console.error('[StopsController.getById]', error);
      res.status(500).json({ message: 'Failed to fetch stop' });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;
      const { routeId, id } = req.params;

      await StopsService.softDelete(companyId, routeId, id);
      res.status(204).send();
    } catch (error) {
      console.error('[StopsController.remove]', error);
      res.status(500).json({ message: 'Failed to delete stop' });
    }
  }
}
