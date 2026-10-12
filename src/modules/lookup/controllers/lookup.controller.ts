import { Request, Response, NextFunction } from 'express';
import { LookupService } from '../services/lookup.service';
import { ApiResponse } from '../../../common/utils/api-response';

export class LookupController {
  private lookupService: LookupService;

  constructor() {
    this.lookupService = new LookupService();
  }

  // --- Membership Types ---
  getMembershipTypes = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.lookupService.getMembershipTypes();
      res.json(ApiResponse.success(items, 'Membership types retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getMembershipTypeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.getMembershipTypeById(id);
      res.json(ApiResponse.success(item, 'Membership type retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createMembershipType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.lookupService.createMembershipType(req.body);
      res.status(201).json(ApiResponse.created(item, 'Membership type created successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateMembershipType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.updateMembershipType(id, req.body);
      res.json(ApiResponse.success(item, 'Membership type updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteMembershipType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.deleteMembershipType(id);
      res.json(ApiResponse.success(item, 'Membership type deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  // --- Specializations ---
  getSpecializations = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.lookupService.getSpecializations();
      res.json(ApiResponse.success(items, 'Specializations retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getSpecializationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.getSpecializationById(id);
      res.json(ApiResponse.success(item, 'Specialization retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createSpecialization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.lookupService.createSpecialization(req.body);
      res.status(201).json(ApiResponse.created(item, 'Specialization created successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateSpecialization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.updateSpecialization(id, req.body);
      res.json(ApiResponse.success(item, 'Specialization updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteSpecialization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.deleteSpecialization(id);
      res.json(ApiResponse.success(item, 'Specialization deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  // --- Ranks ---
  getRanks = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.lookupService.getRanks();
      res.json(ApiResponse.success(items, 'Ranks retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getRankById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.getRankById(id);
      res.json(ApiResponse.success(item, 'Rank retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createRank = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.lookupService.createRank(req.body);
      res.status(201).json(ApiResponse.created(item, 'Rank created successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateRank = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.updateRank(id, req.body);
      res.json(ApiResponse.success(item, 'Rank updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteRank = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.deleteRank(id);
      res.json(ApiResponse.success(item, 'Rank deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  // --- Nature of Membership ---
  getNatureOfMemberships = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.lookupService.getNatureOfMemberships();
      res.json(ApiResponse.success(items, 'Nature of memberships retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getNatureOfMembershipById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.getNatureOfMembershipById(id);
      res.json(ApiResponse.success(item, 'Nature of membership retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createNatureOfMembership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.lookupService.createNatureOfMembership(req.body);
      res.status(201).json(ApiResponse.created(item, 'Nature of membership created successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateNatureOfMembership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.updateNatureOfMembership(id, req.body);
      res.json(ApiResponse.success(item, 'Nature of membership updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteNatureOfMembership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.deleteNatureOfMembership(id);
      res.json(ApiResponse.success(item, 'Nature of membership deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  // --- Academic Fields ---
  getAcademicFields = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.lookupService.getAcademicFields();
      res.json(ApiResponse.success(items, 'Academic fields retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAcademicFieldById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.getAcademicFieldById(id);
      res.json(ApiResponse.success(item, 'Academic field retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createAcademicField = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.lookupService.createAcademicField(req.body);
      res.status(201).json(ApiResponse.created(item, 'Academic field created successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateAcademicField = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.updateAcademicField(id, req.body);
      res.json(ApiResponse.success(item, 'Academic field updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteAcademicField = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.deleteAcademicField(id);
      res.json(ApiResponse.success(item, 'Academic field deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  // --- Degree Levels ---
  getDegreeLevels = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.lookupService.getDegreeLevels();
      res.json(ApiResponse.success(items, 'Degree levels retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getDegreeLevelById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.getDegreeLevelById(id);
      res.json(ApiResponse.success(item, 'Degree level retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createDegreeLevel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.lookupService.createDegreeLevel(req.body);
      res.status(201).json(ApiResponse.created(item, 'Degree level created successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateDegreeLevel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.updateDegreeLevel(id, req.body);
      res.json(ApiResponse.success(item, 'Degree level updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteDegreeLevel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.deleteDegreeLevel(id);
      res.json(ApiResponse.success(item, 'Degree level deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  // --- Academic Qualifications ---
  getAcademicQualifications = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.lookupService.getAcademicQualifications();
      res.json(ApiResponse.success(items, 'Academic qualifications retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAcademicQualificationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.getAcademicQualificationById(id);
      res.json(ApiResponse.success(item, 'Academic qualification retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createAcademicQualification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.lookupService.createAcademicQualification(req.body);
      res.status(201).json(ApiResponse.created(item, 'Academic qualification created successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateAcademicQualification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.updateAcademicQualification(id, req.body);
      res.json(ApiResponse.success(item, 'Academic qualification updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteAcademicQualification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.deleteAcademicQualification(id);
      res.json(ApiResponse.success(item, 'Academic qualification deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  // --- Address Types ---
  getAddressTypes = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.lookupService.getAddressTypes();
      res.json(ApiResponse.success(items, 'Address types retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAddressTypeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.getAddressTypeById(id);
      res.json(ApiResponse.success(item, 'Address type retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createAddressType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.lookupService.createAddressType(req.body);
      res.status(201).json(ApiResponse.created(item, 'Address type created successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateAddressType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.updateAddressType(id, req.body);
      res.json(ApiResponse.success(item, 'Address type updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteAddressType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.deleteAddressType(id);
      res.json(ApiResponse.success(item, 'Address type deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  // --- Provinces ---
  getProvinces = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.lookupService.getProvinces();
      res.json(ApiResponse.success(items, 'Provinces retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getProvinceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.getProvinceById(id);
      res.json(ApiResponse.success(item, 'Province retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createProvince = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.lookupService.createProvince(req.body);
      res.status(201).json(ApiResponse.created(item, 'Province created successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateProvince = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.updateProvince(id, req.body);
      res.json(ApiResponse.success(item, 'Province updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteProvince = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.deleteProvince(id);
      res.json(ApiResponse.success(item, 'Province deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  // --- Cities ---
  getCities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const provinceId = req.query.provinceId as string | undefined;
      const items = await this.lookupService.getCities(provinceId);
      res.json(ApiResponse.success(items, 'Cities retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getCityById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.getCityById(id);
      res.json(ApiResponse.success(item, 'City retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.lookupService.createCity(req.body);
      res.status(201).json(ApiResponse.created(item, 'City created successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.updateCity(id, req.body);
      res.json(ApiResponse.success(item, 'City updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const item = await this.lookupService.deleteCity(id);
      res.json(ApiResponse.success(item, 'City deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}
