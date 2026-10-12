import { Schema, model } from 'mongoose';
import { IProvince } from '../interfaces/province.interface';

const provinceSchema = new Schema<IProvince>(
  {
    title: {
      type: String,
      required: [true, 'Province title is required'],
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

provinceSchema.index({ title: 1 });

export const Province = model<IProvince>('Province', provinceSchema);
