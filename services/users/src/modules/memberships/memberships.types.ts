import { CompanyRole } from '@/prisma/generated/prisma/enums';

export interface InviteMemberDTO {
  email: string;
  role: CompanyRole;
}
