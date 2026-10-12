import { Document, Types } from 'mongoose';

export interface IPermission {
  _id: Types.ObjectId;
  name: string;
  key: string;
  description?: string;
  module?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IPermissionDocument = IPermission & Document;
