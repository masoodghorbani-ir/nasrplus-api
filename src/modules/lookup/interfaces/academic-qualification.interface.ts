import { Document, Types } from 'mongoose';
import { IAcademicField } from './academic-field.interface';

export type DegreeLevel = 'DIPLOMA' | 'ASSOCIATE' | 'BACHELOR' | 'MASTER' | 'DOCTORATE' | 'OTHER';

export interface IAcademicQualification extends Document {
  title: string;                                // Qualification / Degree title (e.g., Bachelor of Science in Software Engineering)
  academicField: Types.ObjectId | IAcademicField; // Foreign reference to AcademicField
  degreeLevel?: DegreeLevel;                    // Educational level
  institution?: string;                         // Name of university or educational institution
  graduationYear?: number;                      // Year of graduation
  isActive: boolean;                            // Active/Inactive status flag
  createdAt: Date;
  updatedAt: Date;
}
