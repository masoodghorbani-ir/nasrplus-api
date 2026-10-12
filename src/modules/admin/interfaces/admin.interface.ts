import { Document, Types } from 'mongoose';
import { IPermission } from './permission.interface';

export enum AdminType {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
}

export interface IAdmin {
  _id: Types.ObjectId;
  username: string;
  password: string;
  type: AdminType;
  fullName?: string;
  isActive: boolean;
  permissions: Types.ObjectId[] | IPermission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type IAdminDocument = IAdmin & Document & IAdminMethods;
