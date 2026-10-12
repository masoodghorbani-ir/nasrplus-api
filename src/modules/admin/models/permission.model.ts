import { Schema, model } from 'mongoose';
import { IPermissionDocument } from '../interfaces/permission.interface';

const permissionSchema = new Schema<IPermissionDocument>(
  {
    name: {
      type: String,
      required: [true, 'Permission name is required'],
      trim: true,
    },
    key: {
      type: String,
      required: [true, 'Permission key is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    module: {
      type: String,
      trim: true,
      default: 'general',
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'permissions',
  }
);

export const Permission = model<IPermissionDocument>('Permission', permissionSchema);
