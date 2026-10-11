import { Schema, model } from 'mongoose';
import { IMemberAddress } from '../interfaces/member-address.interface';

const memberAddressSchema = new Schema<IMemberAddress>(
  {
    membershipId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'شناسه عضو الزامی است'],
      index: true,
    },
    addressType: {
      type: String,
      enum: {
        values: ['WORK', 'HOME', 'CENTRAL_OFFICE', 'BRANCH', 'OTHER'],
        message: 'نوع آدرس نامعتبر است',
      },
      default: 'WORK',
    },
    province: {
      type: String,
      required: [true, 'نام استان الزامی است'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'نام شهر الزامی است'],
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'کد پستی باید ۱۰ رقم عددی باشد'],
    },
    address: {
      type: String,
      required: [true, 'نشانی کامل الزامی است'],
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
