import { Schema, model } from 'mongoose';
import { ICity } from '../interfaces/city.interface';

const citySchema = new Schema<ICity>(
  {
    title: {
      type: String,
      required: [true, 'City title is required'],
      trim: true,
    },
    provinceId: {
      type: Schema.Types.ObjectId,
      ref: 'Province',
      required: [true, 'Province reference is required'],
      index: true,
    },
    code: {
      type: String,
      trim: true,
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

citySchema.index({ provinceId: 1, title: 1 }, { unique: true });

export const City = model<ICity>('City', citySchema);
