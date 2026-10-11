import { Document } from 'mongoose';

export interface IRank extends Document {
  title: string;          // Rank title (e.g., Grade 1, Grade 2, Senior Consultant, etc.)
  level?: number;         // Numeric level for sorting and precedence
  description?: string;   // Qualification criteria and guidelines
  isActive: boolean;      // Active/Inactive status flag
  createdAt: Date;
  updatedAt: Date;
}
