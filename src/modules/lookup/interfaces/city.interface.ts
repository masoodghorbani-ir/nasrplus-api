import { Document, Types } from 'mongoose';
import { IProvince } from './province.interface';

export interface ICity extends Document {
  title: string;                    // City name (e.g., تبریز, شیراز)
  provinceId: Types.ObjectId | IProvince; // Province reference
  code?: string;                    // Optional system slug / code
  isActive: boolean;                // Active status flag
  createdAt: Date;
  updatedAt: Date;
}
