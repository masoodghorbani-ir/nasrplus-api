import { Schema, model } from 'mongoose';
import { IAcademicField } from '../interfaces/academic-field.interface';

const academicFieldSchema = new Schema<IAcademicField>(
  {
    title: {
      type: String,
      required: [true, 'عنوان رشته تحصیلی الزامی است'],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
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
