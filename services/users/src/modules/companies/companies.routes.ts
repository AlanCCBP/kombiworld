import { Router } from 'express';
import { CompaniesController } from './companies.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireCompanyContext } from '@/src/middlewares/requireCompanyContext.middleware';
import { requireCompanyRole } from '@/src/middlewares/requireCompanyRole.middleware';
import { CompanyRole } from '@/prisma/generated/prisma/enums';
import { MembershipsController } from '../memberships/memberships.controller';

const router = Router();

router.post('/', authMiddleware, CompaniesController.create);

router.get('/my', authMiddleware, CompaniesController.myCompanies);

router.post(
  '/invite',
  authMiddleware,
  requireCompanyContext,
  requireCompanyRole(CompanyRole.OWNER, CompanyRole.ADMIN),
  MembershipsController.invite,
);

router.post('/accept', authMiddleware, MembershipsController.accept);

router.patch(
  '/:id',
  authMiddleware,
  requireCompanyContext,
  requireCompanyRole(CompanyRole.OWNER, CompanyRole.ADMIN),
  CompaniesController.update,
);

export default router;
