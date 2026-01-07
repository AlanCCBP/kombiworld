import { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service';

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await usersService.getMe(req.auth.userId);

    res.json(user);
  } catch (err) {
    next(err);
  }
}
