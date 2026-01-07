import { prisma } from '@/src/libs/prisma';
import { CompanyRole, MembershipStatus } from '@/prisma/generated/prisma/enums';
import { v4 as uuid } from 'uuid';
import { BadRequestError } from '@/src/errors/http-errors';

export class MembershipsService {
  static async inviteMember(
    companyId: string,
    email: string,
    role: CompanyRole,
  ) {
    const allowedRoles = [
      CompanyRole.OWNER,
      CompanyRole.ADMIN,
      CompanyRole.DRIVER,
      CompanyRole.STAFF,
    ];
    if (!allowedRoles.includes(role)) {
      throw new BadRequestError('Invalid role');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const existing = await prisma.companyUser.findUnique({
        where: { userId_companyId: { userId: user.id, companyId } },
      });
      if (existing)
        throw new BadRequestError('User already belongs to this company');
    }

    const token = uuid();
    return prisma.companyInvite.create({
      data: {
        companyId,
        email,
        role,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
        status: 'PENDING',
      },
    });
  }

  static async acceptInvite(token: string, userId: string) {
    const invite = await prisma.companyInvite.findFirst({
      where: { token, status: 'PENDING' },
    });

    if (!invite) throw new BadRequestError('Invalid or expired invitation');

    const membership = await prisma.companyUser.create({
      data: {
        companyId: invite.companyId,
        userId,
        role: invite.role,
        status: MembershipStatus.ACTIVE,
      },
    });

    await prisma.companyInvite.update({
      where: { id: invite.id },
      data: { status: 'ACCEPTED' },
    });

    return membership;
  }
}
