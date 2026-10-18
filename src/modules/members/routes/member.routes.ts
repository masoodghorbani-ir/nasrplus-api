import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';
import { MemberImportController } from '../controllers/member-import.controller';
import { accessControl } from '../../../common/middlewares/access-control.middleware';
import { excelUpload, memberPhotoUpload } from '../../../common/middlewares/upload.middleware';

const router = Router();
const memberController = new MemberController();
const memberImportController = new MemberImportController();

// --- Excel Import Routes ---
router.post(
  '/import/preview',
  accessControl('private', 'members:create'),
  excelUpload.single('file'),
  memberImportController.preview
);
router.post(
  '/import/validate',
  accessControl('private', 'members:create'),
  memberImportController.validate
);
router.post(
  '/import/confirm',
  accessControl('private', 'members:create'),
  memberImportController.confirm
);

// --- Core Member Routes ---
router.get('/', accessControl('private', 'members:read'), memberController.getMembers);
router.post('/', accessControl('private', 'members:create'), memberController.createMember);
router.get('/:id', accessControl('private', 'members:read'), memberController.getMemberById);
router.put('/:id', accessControl('private', 'members:update'), memberController.updateMember);
router.delete('/:id', accessControl('private', 'members:delete'), memberController.deleteMember);

// --- Member Photo Routes ---
router.post(
  '/:id/photo',
  accessControl('private', 'members:update'),
  memberPhotoUpload.single('photo'),
  memberController.uploadMemberPhoto
);
router.delete(
  '/:id/photo',
  accessControl('private', 'members:update'),
  memberController.deleteMemberPhoto
);

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

// --- Member Academic Qualification Sub-routes ---
router.get(
  '/:id/academic-qualifications',
  accessControl('private', 'members:read'),
  memberController.getMemberAcademicQualifications
);
router.post(
  '/:id/academic-qualifications',
  accessControl('private', 'members:update'),
  memberController.addMemberAcademicQualification
);
router.put(
  '/:id/academic-qualifications/:qualificationId',
  accessControl('private', 'members:update'),
  memberController.updateMemberAcademicQualification
);
router.delete(
  '/:id/academic-qualifications/:qualificationId',
  accessControl('private', 'members:update'),
  memberController.deleteMemberAcademicQualification
);
router.patch(
  '/:id/academic-qualifications/:qualificationId/verify',
  accessControl('private', 'members:update'),
  memberController.verifyMemberAcademicQualification
);

export const memberRoutes = router;
