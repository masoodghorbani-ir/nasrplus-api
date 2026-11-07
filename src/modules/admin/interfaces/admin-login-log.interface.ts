import { Document, Types } from 'mongoose';
import { AdminType, IAdmin } from './admin.interface';

export type LoginLogStatus = 'SUCCESS' | 'FAILED';

export interface IAdminLoginLog {
  _id: Types.ObjectId;
  adminId?: Types.ObjectId | IAdmin;
  username: string;
  adminType?: AdminType;
  fullName?: string;
  ip: string;
  userAgent?: string;
  device?: string;
  browser?: string;
  os?: string;
  status: LoginLogStatus;
  failureReason?: string;
  loginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type IAdminLoginLogDocument = IAdminLoginLog & Document;
