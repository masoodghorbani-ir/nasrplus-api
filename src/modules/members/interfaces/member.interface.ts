import { Document, Types } from 'mongoose';
import { IMembershipType } from '../../lookup/interfaces/membership-type.interface';
import { ISpecialization } from '../../lookup/interfaces/specialization.interface';
import { IRank } from '../../lookup/interfaces/rank.interface';
import { INatureOfMembership } from '../../lookup/interfaces/nature-of-membership.interface';
import { IAcademicQualification } from '../../lookup/interfaces/academic-qualification.interface';
import { ICompanyInformation } from '../../company/interfaces/company-information.interface';
import { IMemberAddress } from './member-address.interface';
import { IMemberTelephone } from './member-telephone.interface';

export type MemberStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'REJECTED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface IMember extends Document {
  // --- ER Diagram Foreign Key References ---
  membershipTypeId: Types.ObjectId | IMembershipType;                     // Membership Type reference
  specializationId?: Types.ObjectId | ISpecialization;                    // Specialization / Guild Branch reference
  rankId?: Types.ObjectId | IRank;                                        // Rank / Grade reference
  latestAcademicQualifications?: Types.ObjectId | IAcademicQualification; // Latest academic qualification reference
  natureOfMembership: Types.ObjectId | INatureOfMembership;               // Nature of membership reference
  companyInformation?: Types.ObjectId | ICompanyInformation;             // Company affiliation reference

  // --- Guild Identity and Profile Fields ---
  memberCode: string;               // Unique Guild Membership Number
  nationalCode?: string;            // 10-digit National ID (for individuals)
  firstName?: string;               // First name
  lastName?: string;                // Last name
  fatherName?: string;              // Father's name
  gender?: Gender;                  // Gender
  birthDate?: Date;                 // Date of birth
  identityCertificateNumber?: string; // Birth certificate number
  email?: string;                   // Contact email address
  profileImage?: string;            // Profile image or company logo URL
  status: MemberStatus;             // Membership status in the guild
  membershipDate: Date;             // Membership registration date
  expiryDate: Date;                 // Membership / License expiration date
  notes?: string;                   // Internal system notes and annotations

  createdAt: Date;
  updatedAt: Date;

  // --- Virtual Populated Fields ---
  addresses?: IMemberAddress[];
  telephones?: IMemberTelephone[];
  readonly fullName: string;
}
