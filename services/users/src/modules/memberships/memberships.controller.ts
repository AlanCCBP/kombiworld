import { Request, Response, NextFunction } from 'express';
import { MembershipsService } from './memberships.service';

export class MembershipsController {
  static async invite(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.company?.id;

      if (!companyId) {
        return res.status(500).json({
          message: 'Company context not initialized',
        });
      }

      const { email, role } = req.body;

      const membership = await MembershipsService.inviteMember(
        companyId,
        email,
        role,
      );

      return res.status(201).json(membership);
    } catch (error) {
      next(error);
    }
  }

  static async accept(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { companyId } = req.body;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const membership = await MembershipsService.acceptInvite(
        userId,
        companyId,
      );

      return res.json(membership);
    } catch (error) {
      next(error);
    }
  }
}
