import { Schema, model } from 'mongoose';
import { IMemberAddress } from '../interfaces/member-address.interface';

const memberAddressSchema = new Schema<IMemberAddress>(
  {
    membershipId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'Member ID reference is required'],
      index: true,
    },
    addressType: {
      type: String,
      enum: {
        values: ['WORK', 'HOME', 'CENTRAL_OFFICE', 'BRANCH', 'OTHER'],
        message: 'Invalid address type provided',
      },
      default: 'WORK',
    },
    province: {
      type: String,
      required: [true, 'Province is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'Postal code must be a 10-digit number'],
    },
    address: {
      type: String,
      required: [true, 'Full address is required'],
      trim: true,
    },
    plaque: {
      type: String,
      trim: true,
      default: '',
    },
    floor: {
      type: String,
      trim: true,
      default: '',
    },
    unit: {
      type: String,
      trim: true,
      default: '',
    },
    postalBox: {
      type: String,
      trim: true,
      default: '',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

memberAddressSchema.index({ membershipId: 1, isPrimary: -1 });

export const MemberAddress = model<IMemberAddress>('MemberAddress', memberAddressSchema);
