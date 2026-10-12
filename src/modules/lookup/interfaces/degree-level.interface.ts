import { Document } from 'mongoose';

export interface IDegreeLevel extends Document {
  title: string;          // Degree level title (e.g., دیپلم, کارشناسی, کارشناسی ارشد, دکتری / Diploma, Bachelor, Master, Doctorate)
  description?: string;   // Optional description
  isActive: boolean;      // Active/Inactive status flag
  createdAt: Date;
  updatedAt: Date;
}
