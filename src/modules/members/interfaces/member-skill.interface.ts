import { Document, Types } from 'mongoose';
import { ISpecialization } from '../../lookup/interfaces/specialization.interface';
import { IAdmin } from '../../admin/interfaces/admin.interface';

export type SkillVerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ISkillVerificationLog {
  _id?: Types.ObjectId;
  fromStatus?: SkillVerificationStatus;
  toStatus: SkillVerificationStatus;
  changedBy?: Types.ObjectId | IAdmin | string | null;
  changedAt: Date;
  comment?: string;
}

export interface IMemberSkill extends Document {
  memberId: Types.ObjectId;
  specializationId: Types.ObjectId | ISpecialization;
  startDate: Date;
  selfAssessmentPercentage: number;
  hasCertificate: boolean;
  certificateFile?: string;
  certificateTitle?: string;
  description?: string;
  verificationStatus: SkillVerificationStatus;
  verifiedBy?: Types.ObjectId | IAdmin | string | null;
  verifiedAt?: Date | null;
  rejectionReason?: string;
  verificationLogs: ISkillVerificationLog[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
