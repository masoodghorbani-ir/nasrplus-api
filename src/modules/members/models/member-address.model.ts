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
      type: Schema.Types.ObjectId,
      ref: 'AddressType',
      required: [true, 'Address type reference is required'],
      index: true,
    },
    province: {
      type: Schema.Types.ObjectId,
      ref: 'Province',
      required: [true, 'Province reference is required'],
      index: true,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'City reference is required'],
      index: true,
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
