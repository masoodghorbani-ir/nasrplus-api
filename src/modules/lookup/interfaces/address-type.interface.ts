import { Document } from 'mongoose';

export interface IAddressType extends Document {
  title: string;        // Title (e.g., محل کار, منزل, دفتر مرکزی)
  code?: string;        // System code (e.g., WORK, HOME, CENTRAL_OFFICE)
  description?: string; // Optional description
  isActive: boolean;    // Active status flag
  createdAt: Date;
  updatedAt: Date;
}
