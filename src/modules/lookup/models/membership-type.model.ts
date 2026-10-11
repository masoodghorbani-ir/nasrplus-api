import { Schema, model } from 'mongoose';
import { IMembershipType } from '../interfaces/membership-type.interface';

const membershipTypeSchema = new Schema<IMembershipType>(
  {
    title: {
      type: String,
      required: [true, 'Membership type title is required'],
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

membershipTypeSchema.index({ title: 1 });

export const MembershipType = model<IMembershipType>('MembershipType', membershipTypeSchema);
