import { Router } from 'express';
import { CompaniesController } from './companies.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, CompaniesController.create);
router.get('/my', authMiddleware, CompaniesController.myCompanies);

export default router;
