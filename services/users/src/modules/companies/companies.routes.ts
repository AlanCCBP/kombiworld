import { Router } from 'express';
import { CompaniesController } from './companies.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { companyContext } from '@/src/middlewares/companyContext.middleware';
import { requireCompanyRole } from '@/src/middlewares/requireCompanyRole.middleware';
import { CompanyRole } from '@/prisma/generated/prisma/enums';
import { MembershipsController } from '../memberships/memberships.controller';

const router = Router();

router.post('/', authMiddleware, CompaniesController.create);
router.get('/my', authMiddleware, CompaniesController.myCompanies);
router.post(
  '/invite',
  authMiddleware,
  companyContext,
  requireCompanyRole(CompanyRole.OWNER, CompanyRole.ADMIN),
  MembershipsController.invite,
);

router.post('/accept', authMiddleware, MembershipsController.accept);
router.patch(
  '/:id',
  authMiddleware,
  companyContext,
  requireCompanyRole(CompanyRole.OWNER, CompanyRole.ADMIN),
  CompaniesController.update,
);

export default router;
