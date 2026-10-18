import { Document, Types } from 'mongoose';
import { IAcademicField } from './academic-field.interface';
import { IDegreeLevel } from './degree-level.interface';
import { IAdmin } from '../../admin/interfaces/admin.interface';

export type QualificationVerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Audit log entry for verification status transitions
export interface IQualificationVerificationLog {
  _id?: Types.ObjectId;
  fromStatus?: QualificationVerificationStatus;
  toStatus: QualificationVerificationStatus;
  changedBy?: Types.ObjectId | IAdmin | string | null;
  changedAt: Date;
  comment?: string;
}

export interface IAcademicQualification extends Document {
  title: string;                                  // Qualification / Degree title
  academicField: Types.ObjectId | IAcademicField; // Foreign reference to AcademicField
  degreeLevel: Types.ObjectId | IDegreeLevel;     // Foreign reference to DegreeLevel
  institution?: string;                           // Educational institution name
  city?: string;                                  // City of study
  startYear?: number;                             // Start year of study
  graduationYear?: number;                        // Year of graduation
  gpa?: number;                                   // Grade Point Average
  description?: string;                           // Additional notes / thesis
  memberId?: Types.ObjectId | string;             // Associated member reference
  verificationStatus: QualificationVerificationStatus; // Verification status (PENDING, APPROVED, REJECTED)
  verifiedBy?: Types.ObjectId | IAdmin | string | null;// Admin who verified or rejected
  verifiedAt?: Date | null;                       // Verification timestamp
  rejectionReason?: string;                       // Explanation if rejected
  verificationLogs: IQualificationVerificationLog[];   // History of status changes
  isActive: boolean;                              // Active/Inactive status flag
  createdAt: Date;
  updatedAt: Date;
}
