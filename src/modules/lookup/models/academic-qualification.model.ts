import { Schema, model } from 'mongoose';
import { IAcademicQualification } from '../interfaces/academic-qualification.interface';

const academicQualificationSchema = new Schema<IAcademicQualification>(
  {
    title: {
      type: String,
      required: [true, 'Academic qualification title is required'],
      trim: true,
    },
    academicField: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicField',
      required: [true, 'Academic field reference is required'],
      index: true,
    },
    degreeLevel: {
      type: Schema.Types.ObjectId,
      ref: 'DegreeLevel',
      required: [true, 'Degree level reference is required'],
      index: true,
    },
    institution: {
      type: String,
      trim: true,
      default: '',
    },
    graduationYear: {
      type: Number,
      min: 1900,
      max: 2100,
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

academicQualificationSchema.index({ academicField: 1, title: 1 });
academicQualificationSchema.index({ degreeLevel: 1, title: 1 });

export const AcademicQualification = model<IAcademicQualification>(
  'AcademicQualification',
  academicQualificationSchema
);
