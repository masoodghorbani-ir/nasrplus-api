import { Schema, model } from 'mongoose';
import { IDegreeLevel } from '../interfaces/degree-level.interface';

const degreeLevelSchema = new Schema<IDegreeLevel>(
  {
    title: {
      type: String,
      required: [true, 'Degree level title is required'],
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

degreeLevelSchema.index({ title: 1 });

export const DegreeLevel = model<IDegreeLevel>('DegreeLevel', degreeLevelSchema);
