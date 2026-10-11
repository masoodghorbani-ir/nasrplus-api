import { Schema, model } from 'mongoose';
import { IMemberTelephone } from '../interfaces/member-telephone.interface';

const memberTelephoneSchema = new Schema<IMemberTelephone>(
  {
    membershipId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'Member ID reference is required'],
      index: true,
    },
    phoneType: {
      type: String,
      enum: {
        values: ['MOBILE', 'LANDLINE', 'FAX', 'SUPPORT', 'OTHER'],
        message: 'Invalid phone type provided',
      },
      default: 'MOBILE',
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    areaCode: {
      type: String,
      trim: true,
      default: '',
    },
    countryCode: {
      type: String,
      trim: true,
      default: '+98',
    },
    extension: {
      type: String,
      trim: true,
      default: '',
    },
    title: {
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

memberTelephoneSchema.index({ membershipId: 1, isPrimary: -1 });

export const MemberTelephone = model<IMemberTelephone>('MemberTelephone', memberTelephoneSchema);
