import { Router } from 'express';
import { LookupController } from '../controllers/lookup.controller';
import { accessControl } from '../../../common/middlewares/access-control.middleware';

const router = Router();
const controller = new LookupController();

// --- Membership Types ---
router.get('/membership-types', accessControl('public'), controller.getMembershipTypes);
router.post('/membership-types', accessControl('private', 'lookups:manage'), controller.createMembershipType);
router.get('/membership-types/:id', accessControl('public'), controller.getMembershipTypeById);
router.put('/membership-types/:id', accessControl('private', 'lookups:manage'), controller.updateMembershipType);
router.delete('/membership-types/:id', accessControl('private', 'lookups:manage'), controller.deleteMembershipType);

// --- Specializations ---
router.get('/specializations', accessControl('public'), controller.getSpecializations);
router.post('/specializations', accessControl('private', 'lookups:manage'), controller.createSpecialization);
router.get('/specializations/:id', accessControl('public'), controller.getSpecializationById);
router.put('/specializations/:id', accessControl('private', 'lookups:manage'), controller.updateSpecialization);
router.delete('/specializations/:id', accessControl('private', 'lookups:manage'), controller.deleteSpecialization);

// --- Ranks ---
router.get('/ranks', accessControl('public'), controller.getRanks);
router.post('/ranks', accessControl('private', 'lookups:manage'), controller.createRank);
router.get('/ranks/:id', accessControl('public'), controller.getRankById);
router.put('/ranks/:id', accessControl('private', 'lookups:manage'), controller.updateRank);
router.delete('/ranks/:id', accessControl('private', 'lookups:manage'), controller.deleteRank);

// --- Nature of Memberships ---
router.get('/nature-of-memberships', accessControl('public'), controller.getNatureOfMemberships);
router.post('/nature-of-memberships', accessControl('private', 'lookups:manage'), controller.createNatureOfMembership);
router.get('/nature-of-memberships/:id', accessControl('public'), controller.getNatureOfMembershipById);
router.put('/nature-of-memberships/:id', accessControl('private', 'lookups:manage'), controller.updateNatureOfMembership);
router.delete('/nature-of-memberships/:id', accessControl('private', 'lookups:manage'), controller.deleteNatureOfMembership);

// --- Academic Fields ---
router.get('/academic-fields', accessControl('public'), controller.getAcademicFields);
router.post('/academic-fields', accessControl('private', 'lookups:manage'), controller.createAcademicField);
router.get('/academic-fields/:id', accessControl('public'), controller.getAcademicFieldById);
router.put('/academic-fields/:id', accessControl('private', 'lookups:manage'), controller.updateAcademicField);
router.delete('/academic-fields/:id', accessControl('private', 'lookups:manage'), controller.deleteAcademicField);

// --- Degree Levels ---
router.get('/degree-levels', accessControl('public'), controller.getDegreeLevels);
router.post('/degree-levels', accessControl('private', 'lookups:manage'), controller.createDegreeLevel);
router.get('/degree-levels/:id', accessControl('public'), controller.getDegreeLevelById);
router.put('/degree-levels/:id', accessControl('private', 'lookups:manage'), controller.updateDegreeLevel);
router.delete('/degree-levels/:id', accessControl('private', 'lookups:manage'), controller.deleteDegreeLevel);

// --- Academic Qualifications ---
router.get('/academic-qualifications', accessControl('public'), controller.getAcademicQualifications);
router.post('/academic-qualifications', accessControl('private', 'lookups:manage'), controller.createAcademicQualification);
router.get('/academic-qualifications/:id', accessControl('public'), controller.getAcademicQualificationById);
router.put('/academic-qualifications/:id', accessControl('private', 'lookups:manage'), controller.updateAcademicQualification);
router.patch('/academic-qualifications/:id/verify', accessControl('private', 'lookups:manage'), controller.verifyAcademicQualification);
router.delete('/academic-qualifications/:id', accessControl('private', 'lookups:manage'), controller.deleteAcademicQualification);

// --- Address Types ---
router.get('/address-types', accessControl('public'), controller.getAddressTypes);
router.post('/address-types', accessControl('private', 'lookups:manage'), controller.createAddressType);
router.get('/address-types/:id', accessControl('public'), controller.getAddressTypeById);
router.put('/address-types/:id', accessControl('private', 'lookups:manage'), controller.updateAddressType);
router.delete('/address-types/:id', accessControl('private', 'lookups:manage'), controller.deleteAddressType);

// --- Provinces ---
router.get('/provinces', accessControl('public'), controller.getProvinces);
router.post('/provinces', accessControl('private', 'lookups:manage'), controller.createProvince);
router.get('/provinces/:id', accessControl('public'), controller.getProvinceById);
router.put('/provinces/:id', accessControl('private', 'lookups:manage'), controller.updateProvince);
router.delete('/provinces/:id', accessControl('private', 'lookups:manage'), controller.deleteProvince);

// --- Cities ---
router.get('/cities', accessControl('public'), controller.getCities);
router.post('/cities', accessControl('private', 'lookups:manage'), controller.createCity);
router.get('/cities/:id', accessControl('public'), controller.getCityById);
router.put('/cities/:id', accessControl('private', 'lookups:manage'), controller.updateCity);
router.delete('/cities/:id', accessControl('private', 'lookups:manage'), controller.deleteCity);

export const lookupRoutes = router;
