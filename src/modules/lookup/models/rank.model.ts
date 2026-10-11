import { Schema, model } from 'mongoose';
import { IRank } from '../interfaces/rank.interface';

const rankSchema = new Schema<IRank>(
  {
    title: {
      type: String,
      required: [true, 'Rank title is required'],
      trim: true,
      unique: true,
    },
    level: {
      type: Number,
      min: 1,
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

rankSchema.index({ title: 1 });
rankSchema.index({ level: 1 });

export const Rank = model<IRank>('Rank', rankSchema);
