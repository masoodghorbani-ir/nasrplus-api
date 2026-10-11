import { Router } from 'express';
import { LookupController } from '../controllers/lookup.controller';

const router = Router();
const controller = new LookupController();

// --- Membership Types ---
router.get('/membership-types', controller.getMembershipTypes);
router.post('/membership-types', controller.createMembershipType);
router.get('/membership-types/:id', controller.getMembershipTypeById);
router.put('/membership-types/:id', controller.updateMembershipType);
router.delete('/membership-types/:id', controller.deleteMembershipType);

// --- Specializations ---
router.get('/specializations', controller.getSpecializations);
router.post('/specializations', controller.createSpecialization);
router.get('/specializations/:id', controller.getSpecializationById);
router.put('/specializations/:id', controller.updateSpecialization);
router.delete('/specializations/:id', controller.deleteSpecialization);

// --- Ranks ---
router.get('/ranks', controller.getRanks);
router.post('/ranks', controller.createRank);
router.get('/ranks/:id', controller.getRankById);
router.put('/ranks/:id', controller.updateRank);
router.delete('/ranks/:id', controller.deleteRank);

// --- Nature of Memberships ---
router.get('/nature-of-memberships', controller.getNatureOfMemberships);
router.post('/nature-of-memberships', controller.createNatureOfMembership);
router.get('/nature-of-memberships/:id', controller.getNatureOfMembershipById);
router.put('/nature-of-memberships/:id', controller.updateNatureOfMembership);
router.delete('/nature-of-memberships/:id', controller.deleteNatureOfMembership);

// --- Academic Fields ---
router.get('/academic-fields', controller.getAcademicFields);
router.post('/academic-fields', controller.createAcademicField);
router.get('/academic-fields/:id', controller.getAcademicFieldById);
router.put('/academic-fields/:id', controller.updateAcademicField);
router.delete('/academic-fields/:id', controller.deleteAcademicField);

// --- Academic Qualifications ---
router.get('/academic-qualifications', controller.getAcademicQualifications);
router.post('/academic-qualifications', controller.createAcademicQualification);
router.get('/academic-qualifications/:id', controller.getAcademicQualificationById);
router.put('/academic-qualifications/:id', controller.updateAcademicQualification);
router.delete('/academic-qualifications/:id', controller.deleteAcademicQualification);

export const lookupRoutes = router;
