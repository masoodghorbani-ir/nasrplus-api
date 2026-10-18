import { Schema, model } from 'mongoose';
import {
  IAcademicQualification,
  IQualificationVerificationLog,
} from '../interfaces/academic-qualification.interface';

const qualificationVerificationLogSchema = new Schema<IQualificationVerificationLog>(
  {
    fromStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: undefined,
    },
    toStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      required: [true, 'Target verification status is required'],
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    comment: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: true, timestamps: false }
);

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
    city: {
      type: String,
      trim: true,
      default: '',
    },
    startYear: {
      type: Number,
      min: 1300,
      max: 2100,
    },
    graduationYear: {
      type: Number,
      min: 1300,
      max: 2100,
    },
    gpa: {
      type: Number,
      min: 0,
      max: 20,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED'],
        message: 'Invalid verification status provided',
      },
      default: 'PENDING',
      index: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
      index: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
    verificationLogs: {
      type: [qualificationVerificationLogSchema],
      default: [],
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

// Validate rejection reason when status is REJECTED
academicQualificationSchema.pre('validate', function (next) {
  if (this.verificationStatus === 'REJECTED' && (!this.rejectionReason || !this.rejectionReason.trim())) {
    this.invalidate('rejectionReason', 'Rejection reason is required when status is REJECTED');
  }
  next();
});

// Auto-log initial creation verification status
academicQualificationSchema.pre('save', function (next) {
  if (this.isNew) {
    if (!this.verificationLogs || this.verificationLogs.length === 0) {
      const initialComment = this.verificationStatus === 'REJECTED'
        ? (this.rejectionReason || 'Initial registration - Rejected')
        : (this.verificationStatus === 'APPROVED'
          ? 'Initial registration - Approved'
          : 'Initial registration - Pending expert verification');

      this.verificationLogs.push({
        toStatus: this.verificationStatus || 'PENDING',
        changedBy: (this.verifiedBy as any) || null,
        changedAt: this.verifiedAt || new Date(),
        comment: initialComment,
      } as any);
    }
  }
  next();
});

academicQualificationSchema.index({ memberId: 1, verificationStatus: 1 });
academicQualificationSchema.index({ academicField: 1, title: 1 });
academicQualificationSchema.index({ degreeLevel: 1, title: 1 });

export const AcademicQualification = model<IAcademicQualification>(
  'AcademicQualification',
  academicQualificationSchema
);
