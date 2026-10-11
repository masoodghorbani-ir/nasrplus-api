import { Schema, model } from 'mongoose';
import { INatureOfMembership } from '../interfaces/nature-of-membership.interface';

const natureOfMembershipSchema = new Schema<INatureOfMembership>(
  {
    title: {
      type: String,
      required: [true, 'Nature of membership title is required'],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
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

natureOfMembershipSchema.index({ title: 1 });

export const NatureOfMembership = model<INatureOfMembership>(
  'NatureOfMembership',
  natureOfMembershipSchema
);
