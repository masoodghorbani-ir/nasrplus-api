import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller';

const router = Router();
const controller = new CompanyController();

router.get('/', controller.getCompanies);
router.post('/', controller.createCompany);
router.get('/:id', controller.getCompanyById);
router.put('/:id', controller.updateCompany);
router.delete('/:id', controller.deleteCompany);

export const companyRoutes = router;
