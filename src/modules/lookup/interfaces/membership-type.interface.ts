import { Document } from 'mongoose';

export interface IMembershipType extends Document {
  title: string;          // Membership type title (e.g., Individual, Legal Entity, Store, Honorary)
  code?: string;          // Unique system code or slug
  description?: string;   // Optional description
  isActive: boolean;      // Active/Inactive status flag
  createdAt: Date;
  updatedAt: Date;
}
