import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';

const router = Router();
const memberController = new MemberController();

router.get('/', memberController.getMembers);
router.post('/', memberController.createMember);
router.get('/:id', memberController.getMemberById);

export const memberRoutes = router;
