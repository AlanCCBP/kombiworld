import { BadRequestError } from '@/src/errors/http-errors';
import { NextFunction, Request, Response } from 'express';
import { MembershipsService } from './memberships.service';

export class MembershipsController {
  static async invite(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.auth?.activeCompany?.companyId;
      if (!companyId) throw new BadRequestError('Company context missing');

      const { email, role } = req.body;

      const invite = await MembershipsService.inviteMember(
        companyId,
        email,
        role,
      );

      return res.status(201).json(invite);
    } catch (err) {
      next(err);
    }
  }

  static async accept(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) throw new BadRequestError('Unauthorized');

      const { token } = req.body;
      if (!token) throw new BadRequestError('Token required');

      const membership = await MembershipsService.acceptInvite(token, userId);

      return res.status(200).json(membership);
    } catch (err) {
      next(err);
    }
  }
}
