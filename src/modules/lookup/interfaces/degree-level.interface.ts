import { Document } from 'mongoose';

export interface IDegreeLevel extends Document {
  title: string;          // Degree level title (e.g., دیپلم, کارشناسی, کارشناسی ارشد, دکتری / Diploma, Bachelor, Master, Doctorate)
  code?: string;          // Standard code or slug (e.g., DIPLOMA, ASSOCIATE, BACHELOR, MASTER, DOCTORATE)
  level?: number;         // Level order / hierarchy (e.g., 1, 2, 3, 4, 5, 6)
  description?: string;   // Optional description
  isActive: boolean;      // Active/Inactive status flag
  createdAt: Date;
  updatedAt: Date;
}
