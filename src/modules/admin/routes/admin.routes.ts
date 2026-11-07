import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { superadminRoute } from '../../../common/middlewares/access-control.middleware';

const router = Router();
const controller = new AdminController();

// Permissions endpoints (Superadmin only)
router.get('/permissions', superadminRoute(), controller.getPermissions);
router.post('/permissions', superadminRoute(), controller.createPermission);

// Admin management endpoints (Superadmin only)
router.get('/', superadminRoute(), controller.getAdmins);
router.post('/', superadminRoute(), controller.createAdmin);
router.get('/login-logs', superadminRoute(), controller.getLoginLogs);
router.get('/:id', superadminRoute(), controller.getAdminById);
router.put('/:id', superadminRoute(), controller.updateAdmin);
router.delete('/:id', superadminRoute(), controller.deleteAdmin);
router.put('/:id/permissions', superadminRoute(), controller.assignPermissions);

export const adminRoutes = router;
