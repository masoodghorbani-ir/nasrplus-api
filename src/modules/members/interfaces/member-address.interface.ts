import { Document, Types } from 'mongoose';

export type AddressType = 'WORK' | 'HOME' | 'CENTRAL_OFFICE' | 'BRANCH' | 'OTHER';

export interface IMemberAddress extends Document {
  membershipId: Types.ObjectId;     // Foreign key reference to Members collection
  addressType: AddressType;         // Address classification (Work, Home, Central Office, Branch, etc.)
  province: string;                 // Province / State
  city: string;                     // City
  postalCode?: string;              // 10-digit postal code
  address: string;                  // Full street address
  plaque?: string;                  // Building number / Plaque
  floor?: string;                   // Floor number
  unit?: string;                    // Unit number
  postalBox?: string;               // P.O. Box
  isPrimary: boolean;               // Primary correspondence address flag
  createdAt: Date;
  updatedAt: Date;
}
