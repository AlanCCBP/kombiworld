import { Request, Response, NextFunction } from 'express';
import { prisma } from '../libs/prisma';
import { MembershipStatus } from '@/prisma/generated/prisma/enums';

export async function companyContext(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;
    const companyId = req.header('X-Company-Id');

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!companyId) {
      return res.status(400).json({ message: 'X-Company-Id header missing' });
    }

    const membership = await prisma.companyUser.findFirst({
      where: {
        userId,
        companyId,
        status: MembershipStatus.ACTIVE,
      },
      select: {
        role: true,
        company: {
          select: { id: true },
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        message: 'You do not belong to this company',
      });
    }

    req.company = {
      id: membership.company.id,
      role: membership.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}
