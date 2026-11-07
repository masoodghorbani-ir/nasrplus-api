import { Schema, model } from 'mongoose';
import { IAdminLoginLogDocument } from '../interfaces/admin-login-log.interface';
import { AdminType } from '../interfaces/admin.interface';

const adminLoginLogSchema = new Schema<IAdminLoginLogDocument>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    adminType: {
      type: String,
      enum: Object.values(AdminType),
    },
    fullName: {
      type: String,
      trim: true,
      default: '',
    },
    ip: {
      type: String,
      trim: true,
      default: 'Unknown',
      index: true,
    },
    userAgent: {
      type: String,
      trim: true,
      default: '',
    },
    device: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    browser: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    os: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS',
      index: true,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    loginAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'admin_login_logs',
  }
);

// Compound indexes for listing, filtering, and sorting
adminLoginLogSchema.index({ loginAt: -1, status: 1 });
adminLoginLogSchema.index({ adminId: 1, loginAt: -1 });

export const AdminLoginLog = model<IAdminLoginLogDocument>('AdminLoginLog', adminLoginLogSchema);
