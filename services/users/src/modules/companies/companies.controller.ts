import { Request, Response, NextFunction } from 'express';
import { CompaniesService } from './companies.service';

export class CompaniesController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const company = await CompaniesService.createCompany(userId, req.body);

      return res.status(201).json(company);
    } catch (error) {
      next(error);
    }
  }

  static async myCompanies(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const memberships = await CompaniesService.getMyCompanies(userId);

      const result = memberships.map((m) => ({
        id: m.company.id,
        name: m.company.name,
        role: m.role,
      }));

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const companyIdFromParams = req.params.id;
      const companyIdFromContext = req.company?.id;

      if (!companyIdFromContext) {
        return res.status(500).json({
          message: 'Company context not initialized',
        });
      }

      if (companyIdFromParams !== companyIdFromContext) {
        return res.status(403).json({
          message: 'You cannot update another company',
        });
      }

      const updatedCompany = await CompaniesService.updateCompany(
        companyIdFromContext,
        req.body,
      );

      return res.json(updatedCompany);
    } catch (error) {
      next(error);
    }
  }
}
