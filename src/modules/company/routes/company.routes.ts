import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller';
import { accessControl } from '../../../common/middlewares/access-control.middleware';

const router = Router();
const controller = new CompanyController();

router.get('/', accessControl('private', 'companies:read'), controller.getCompanies);
router.post('/', accessControl('private', 'companies:create'), controller.createCompany);
router.get('/:id', accessControl('private', 'companies:read'), controller.getCompanyById);
router.put('/:id', accessControl('private', 'companies:update'), controller.updateCompany);
router.delete('/:id', accessControl('private', 'companies:delete'), controller.deleteCompany);

export const companyRoutes = router;
