import { Schema, model } from 'mongoose';
import {
  INatureOfMembership,
  NatureOfMembershipKey,
} from '../interfaces/nature-of-membership.interface';

const natureOfMembershipSchema = new Schema<INatureOfMembership>(
  {
    title: {
      type: String,
      required: [true, 'Nature of membership title is required'],
      trim: true,
      unique: true,
    },
    key: {
      type: String,
      required: [true, 'Nature of membership key is required'],
      enum: {
        values: Object.values(NatureOfMembershipKey),
        message: 'Key must be either Real or Legal',
      },
      trim: true,
      unique: true,
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
natureOfMembershipSchema.index({ key: 1 });

export const NatureOfMembership = model<INatureOfMembership>(
  'NatureOfMembership',
  natureOfMembershipSchema
);
