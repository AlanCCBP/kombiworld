import { prisma } from '../libs/prisma';

export const requireRole = (...roles: string[]) => {
  return async (req: any, res: any, next: any) => {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } },
    });

    if (!user) return res.status(401).json({ error: 'User not found' });

    const hasRequiredRole = user.userRoles.some((ur) =>
      roles.includes(ur.role.name),
    );

    if (!hasRequiredRole) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
};
