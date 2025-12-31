import { prisma } from '../../libs/prisma';
import { CreateCompanyDTO } from './companies.types';

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
      where: { userId },
      include: {
        company: true,
      },
    });
  }
}
