import { Schema, model } from 'mongoose';
import {
  IMemberSkill,
  ISkillVerificationLog,
} from '../interfaces/member-skill.interface';

const skillVerificationLogSchema = new Schema<ISkillVerificationLog>(
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

const memberSkillSchema = new Schema<IMemberSkill>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'Member reference is required'],
      index: true,
    },
    specializationId: {
      type: Schema.Types.ObjectId,
      ref: 'Specialization',
      required: [true, 'Specialization reference is required'],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Activity start date is required'],
    },
    selfAssessmentPercentage: {
      type: Number,
      required: [true, 'Self-assessment percentage is required'],
      min: [1, 'Skill percentage must be at least 1'],
      max: [100, 'Skill percentage cannot exceed 100'],
    },
    hasCertificate: {
      type: Boolean,
      required: [true, 'Has certificate flag is required'],
      default: false,
    },
    certificateFile: {
      type: String,
      trim: true,
      default: '',
    },
    certificateTitle: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
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
      type: [skillVerificationLogSchema],
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
memberSkillSchema.pre('validate', function (next) {
  if (this.verificationStatus === 'REJECTED' && (!this.rejectionReason || !this.rejectionReason.trim())) {
    this.invalidate('rejectionReason', 'Rejection reason is required when status is REJECTED');
  }
  next();
});

// Auto-log initial creation verification status
memberSkillSchema.pre('save', function (next) {
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

memberSkillSchema.index({ memberId: 1, specializationId: 1 });
memberSkillSchema.index({ memberId: 1, verificationStatus: 1 });

export const MemberSkill = model<IMemberSkill>('MemberSkill', memberSkillSchema);
