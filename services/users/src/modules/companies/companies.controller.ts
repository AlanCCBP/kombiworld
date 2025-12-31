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
        legalName: m.company.legalName,
        taxId: m.company.taxId,
        email: m.company.email,
        phone: m.company.phone,
        role: m.role,
        status: m.status,
      }));

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
