import { Schema, model } from 'mongoose';
import { IAddressType } from '../interfaces/address-type.interface';

const addressTypeSchema = new Schema<IAddressType>(
  {
    title: {
      type: String,
      required: [true, 'Address type title is required'],
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

addressTypeSchema.index({ title: 1 });

export const AddressType = model<IAddressType>('AddressType', addressTypeSchema);
