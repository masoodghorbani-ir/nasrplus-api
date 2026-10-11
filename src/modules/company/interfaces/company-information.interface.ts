import { Document } from 'mongoose';

export type CompanyLegalType = 
  | 'PRIVATE_JOINT_STOCK'     // Private Joint Stock
  | 'PUBLIC_JOINT_STOCK'      // Public Joint Stock
  | 'LIMITED_LIABILITY'       // Limited Liability Company (LLC)
  | 'COOPERATIVE'             // Cooperative
  | 'KNOWLEDGE_BASED'         // Knowledge-based Enterprise
  | 'STARTUP'                 // Startup
  | 'OTHER';                  // Other

export interface ICompanyInformation extends Document {
  title: string;                      // Company legal name / title
  companyType?: CompanyLegalType;     // Legal organization structure
  nationalId?: string;                // 11-digit National Company ID
  registrationNumber?: string;        // Official company registration number
  economicCode?: string;              // Economic / Tax ID
  ceoName?: string;                   // CEO Full Name
  establishmentDate?: Date;           // Date of establishment or registration
  website?: string;                   // Company official website
  email?: string;                     // Corporate email address
  description?: string;               // Company overview and field of operation
  isActive: boolean;                  // Active/Inactive status flag
  createdAt: Date;
  updatedAt: Date;
}
