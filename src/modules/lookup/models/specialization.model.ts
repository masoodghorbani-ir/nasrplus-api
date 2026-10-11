import { Schema, model } from 'mongoose';
import { ISpecialization } from '../interfaces/specialization.interface';

const specializationSchema = new Schema<ISpecialization>(
  {
    title: {
      type: String,
      required: [true, 'Specialization title is required'],
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

specializationSchema.index({ title: 1 });

export const Specialization = model<ISpecialization>('Specialization', specializationSchema);
