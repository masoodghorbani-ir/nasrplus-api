import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { publicRoute, authenticate } from '../../../common/middlewares/access-control.middleware';

const router = Router();
const controller = new AuthController();

// Public login route
router.post('/login', publicRoute(), controller.login);

// Authenticated current admin profile route
router.get('/me', authenticate(), controller.getProfile);

export const authRoutes = router;
