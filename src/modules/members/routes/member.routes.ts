import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';

const router = Router();
const memberController = new MemberController();

// --- Core Member Routes ---
router.get('/', memberController.getMembers);
router.post('/', memberController.createMember);
router.get('/:id', memberController.getMemberById);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

// --- Member Address Sub-routes ---
router.get('/:id/addresses', memberController.getMemberAddresses);
router.post('/:id/addresses', memberController.addMemberAddress);
router.put('/:id/addresses/:addressId', memberController.updateMemberAddress);
router.delete('/:id/addresses/:addressId', memberController.deleteMemberAddress);

// --- Member Telephone Sub-routes ---
router.get('/:id/telephones', memberController.getMemberTelephones);
router.post('/:id/telephones', memberController.addMemberTelephone);
router.put('/:id/telephones/:telephoneId', memberController.updateMemberTelephone);
router.delete('/:id/telephones/:telephoneId', memberController.deleteMemberTelephone);

export const memberRoutes = router;
