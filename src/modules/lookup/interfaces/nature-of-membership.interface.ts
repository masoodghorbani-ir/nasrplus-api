import { Document } from 'mongoose';

export interface INatureOfMembership extends Document {
  title: string;          // Nature of membership (e.g., Continuous, Associate, Honorary, Permanent, Temporary)
  code?: string;          // System code
  description?: string;   // Regulatory and legal guidelines
  isActive: boolean;      // Active/Inactive status flag
  createdAt: Date;
  updatedAt: Date;
}
