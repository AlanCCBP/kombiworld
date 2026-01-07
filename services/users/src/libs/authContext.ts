import { CompanyRole, GlobalRole } from '@/prisma/generated/prisma/enums';
import { JwtPayload } from './jwt';

export type AuthCompanyContext = {
  companyId: string;
  role: CompanyRole;
};

export type AuthContext = {
  userId: string;
  globalRoles: GlobalRole[];
  companies: AuthCompanyContext[];
  activeCompany?: AuthCompanyContext;
};

export function buildAuthContext(
  payload: JwtPayload,
  activeCompanyId?: string,
): AuthContext {
  const activeCompany = payload.companies.find(
    (c) => c.companyId === activeCompanyId,
  );

  return {
    userId: payload.sub,
    globalRoles: payload.globalRoles ?? [],
    companies: payload.companies,
    activeCompany,
  };
}
