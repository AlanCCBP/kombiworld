import { CompanyRole, MembershipStatus } from '@/prisma/generated/prisma/enums';
import { prisma } from '@/src/libs/prisma';

export class MembershipsService {
  static async inviteMember(
    companyId: string,
    email: string,
    role: CompanyRole,
  ) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const existing = await prisma.companyUser.findUnique({
        where: {
          userId_companyId: {
            userId: user.id,
            companyId,
          },
        },
      });

      if (existing) {
        throw new Error('User already belongs to this company');
      }

      return prisma.companyUser.create({
        data: {
          userId: user.id,
          companyId,
          role,
          status: MembershipStatus.INVITED,
        },
      });
    }

    return prisma.companyUser.create({
      data: {
        userId: '00000000-0000-0000-0000-000000000000', // placeholder
        companyId,
        role,
        status: MembershipStatus.INVITED,
      },
    });
  }

  static async acceptInvite(userId: string, companyId: string) {
    const membership = await prisma.companyUser.findFirst({
      where: {
        userId,
        companyId,
        status: MembershipStatus.INVITED,
      },
    });

    if (!membership) {
      throw new Error('Invitation not found');
    }

    return prisma.companyUser.update({
      where: { id: membership.id },
      data: {
        status: MembershipStatus.ACTIVE,
      },
    });
  }
}
