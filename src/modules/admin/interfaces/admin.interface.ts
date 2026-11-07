import { Document, Types } from 'mongoose';
import { IPermission } from './permission.interface';
import { ISpecialization } from '../../lookup/interfaces/specialization.interface';

export enum AdminType {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  EXPERT = 'EXPERT',
}

export interface IAdmin {
  _id: Types.ObjectId;
  username: string;
  password: string;
  type: AdminType;
  fullName?: string;
  isActive: boolean;
  permissions: Types.ObjectId[] | IPermission[];
  reviewableSpecializations?: Types.ObjectId[] | ISpecialization[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type IAdminDocument = IAdmin & Document & IAdminMethods;
