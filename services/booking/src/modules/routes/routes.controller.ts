import { Request, Response } from 'express';
import { RoutesService } from './routes.service';

export class RoutesController {
  static async create(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;

      const { name, basePrice } = req.body;
      if (!name || basePrice == null) {
        return res.status(400).json({ message: 'Invalid payload' });
      }

      const route = await RoutesService.create(companyId, {
        name,
        basePrice,
      });

      res.status(201).json(route);
    } catch (error) {
      res.status(400).json({ message: 'Could not create route' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;
      const routes = await RoutesService.getAll(companyId);
      res.json(routes);
    } catch {
      res.status(500).json({ message: 'Could not fetch routes' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;
      const { id } = req.params;

      const route = await RoutesService.getById(companyId, id);
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }

      res.json(route);
    } catch {
      res.status(500).json({ message: 'Could not fetch route' });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const companyId = req.companyId!;
      const { id } = req.params;

      const result = await RoutesService.softDelete(companyId, id);
      if (result.count === 0) {
        return res.status(404).json({ message: 'Route not found' });
      }

      res.status(204).send();
    } catch {
      res.status(500).json({ message: 'Could not delete route' });
    }
  }
}
