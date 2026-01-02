import { MembershipStatus } from '@/prisma/generated/prisma/enums';
import { prisma } from '../../libs/prisma';
import { CreateCompanyDTO, UpdateCompanyDTO } from './companies.types';

export class CompaniesService {
  static async createCompany(userId: string, data: CreateCompanyDTO) {
    return prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: data.name,
          legalName: data.legalName,
          taxId: data.taxId,
          email: data.email,
          phone: data.phone,
        },
      });

      await tx.companyUser.create({
        data: {
          userId,
          companyId: company.id,
          role: 'OWNER',
          status: 'ACTIVE',
        },
      });

      return company;
    });
  }

  static async getMyCompanies(userId: string) {
    return prisma.companyUser.findMany({
      where: {
        userId,
        status: MembershipStatus.ACTIVE,
        company: {
          deletedAt: null,
        },
      },
      select: {
        role: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async updateCompany(companyId: string, data: UpdateCompanyDTO) {
    return prisma.company.update({
      where: {
        id: companyId,
        deletedAt: null,
      },
      data,
    });
  }
}
