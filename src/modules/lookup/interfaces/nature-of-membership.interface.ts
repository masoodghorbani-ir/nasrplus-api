import { Document } from 'mongoose';

export enum NatureOfMembershipKey {
  REAL = 'Real',
  LEGAL = 'Legal',
}

export interface INatureOfMembership extends Document {
  title: string;          // Nature of membership title
  key: NatureOfMembershipKey | 'Real' | 'Legal'; // Identifier key: Real or Legal
  description?: string;   // Regulatory and legal guidelines
  isActive: boolean;      // Active/Inactive status flag
  createdAt: Date;
  updatedAt: Date;
}
