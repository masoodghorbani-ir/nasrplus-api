import { Document } from 'mongoose';

export interface IAcademicField extends Document {
  title: string;          // Academic field title (Software Engineering, AI, Information Technology, Data Science, etc.)
  isActive: boolean;      // Active/Inactive status flag
  createdAt: Date;
  updatedAt: Date;
}
