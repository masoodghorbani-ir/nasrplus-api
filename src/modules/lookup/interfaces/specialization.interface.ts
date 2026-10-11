import { Document } from 'mongoose';

export interface ISpecialization extends Document {
  title: string;          // Specialization or guild branch title (Software, Hardware, Security, Network, etc.)
  code?: string;          // System code
  description?: string;   // Optional description
  isActive: boolean;      // Active/Inactive status flag
  createdAt: Date;
  updatedAt: Date;
}
