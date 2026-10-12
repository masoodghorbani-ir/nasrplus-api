import { Schema, model } from 'mongoose';
import { IAcademicField } from '../interfaces/academic-field.interface';

const academicFieldSchema = new Schema<IAcademicField>(
  {
    title: {
      type: String,
      required: [true, 'Academic field title is required'],
      trim: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

academicFieldSchema.index({ title: 1 });

export const AcademicField = model<IAcademicField>('AcademicField', academicFieldSchema);
