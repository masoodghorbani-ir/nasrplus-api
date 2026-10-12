import { Document } from 'mongoose';

export interface IProvince extends Document {
  title: string;        // Province name (e.g., تهران, اصفهان)
  code?: string;        // System code / slug (e.g., TEHRAN, ISFAHAN)
  isActive: boolean;    // Active status flag
  createdAt: Date;
  updatedAt: Date;
}
