import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';
import { accessControl } from '../../../common/middlewares/access-control.middleware';

const router = Router();
const memberController = new MemberController();

// --- Core Member Routes ---
router.get('/', accessControl('private', 'members:read'), memberController.getMembers);
router.post('/', accessControl('private', 'members:create'), memberController.createMember);
router.get('/:id', accessControl('private', 'members:read'), memberController.getMemberById);
router.put('/:id', accessControl('private', 'members:update'), memberController.updateMember);
router.delete('/:id', accessControl('private', 'members:delete'), memberController.deleteMember);

// --- Member Address Sub-routes ---
router.get('/:id/addresses', accessControl('private', 'members:read'), memberController.getMemberAddresses);
router.post('/:id/addresses', accessControl('private', 'members:update'), memberController.addMemberAddress);
router.put('/:id/addresses/:addressId', accessControl('private', 'members:update'), memberController.updateMemberAddress);
router.delete('/:id/addresses/:addressId', accessControl('private', 'members:update'), memberController.deleteMemberAddress);

// --- Member Telephone Sub-routes ---
router.get('/:id/telephones', accessControl('private', 'members:read'), memberController.getMemberTelephones);
router.post('/:id/telephones', accessControl('private', 'members:update'), memberController.addMemberTelephone);
router.put('/:id/telephones/:telephoneId', accessControl('private', 'members:update'), memberController.updateMemberTelephone);
router.delete('/:id/telephones/:telephoneId', accessControl('private', 'members:update'), memberController.deleteMemberTelephone);

export const memberRoutes = router;
