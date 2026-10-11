import { Schema, model } from 'mongoose';
import { IAcademicQualification } from '../interfaces/academic-qualification.interface';

const academicQualificationSchema = new Schema<IAcademicQualification>(
  {
    title: {
      type: String,
      required: [true, 'عنوان مدرک تحصیلی الزامی است'],
      trim: true,
    },
    academicField: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicField',
      required: [true, 'انتخاب رشته تحصیلی الزامی است'],
      index: true,
    },
    degreeLevel: {
      type: String,
      enum: {
        values: ['DIPLOMA', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTORATE', 'OTHER'],
        message: 'مقطع تحصیلی وارد شده معتبر نیست',
      },
      default: 'BACHELOR',
    },
    institution: {
      type: String,
      trim: true,
      default: '',
    },
    graduationYear: {
      type: Number,
      min: 1300,
      max: 1500,
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

export const AcademicQualification = model<IAcademicQualification>(
  'AcademicQualification',
  academicQualificationSchema
);
