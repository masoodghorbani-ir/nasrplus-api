import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { AdminType, IAdminDocument } from '../interfaces/admin.interface';
import { ApiError } from '../../../common/utils/api-error';

const adminSchema = new Schema<IAdminDocument>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    type: {
      type: String,
      enum: {
        values: Object.values(AdminType),
        message: 'Type must be either ADMIN or SUPERADMIN',
      },
      default: AdminType.ADMIN,
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Permission',
      },
    ],
  },
  {
    timestamps: true,
    collection: 'admins',
    toJSON: {
      transform: (_doc, ret: Record<string, any>) => {
        delete (ret as any).password;
        return ret;
      },
    },
  }
);

// Enforce single SUPERADMIN existence at database index level
adminSchema.index(
  { type: 1 },
  {
    unique: true,
    partialFilterExpression: { type: AdminType.SUPERADMIN },
    name: 'unique_superadmin_type_idx',
  }
);

// Validate single SUPERADMIN existence prior to save
adminSchema.pre('save', async function (next) {
  if (this.isModified('type') && this.type === AdminType.SUPERADMIN) {
    const existingSuperadmin = await (this.constructor as any).findOne({
      type: AdminType.SUPERADMIN,
      _id: { $ne: this._id },
    });

    if (existingSuperadmin) {
      return next(
        ApiError.badRequest('A SUPERADMIN account already exists. Only one SUPERADMIN is allowed.')
      );
    }
  }

  // Hash password if modified
  if (this.isModified('password')) {
    if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  next();
});

// Validate single SUPERADMIN existence prior to findOneAndUpdate
adminSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as Record<string, any>;
  const requestedType = update?.type || update?.$set?.type;

  if (requestedType === AdminType.SUPERADMIN) {
    const query = this.getQuery();
    const existingSuperadmin = await this.model.findOne({
      type: AdminType.SUPERADMIN,
      _id: { $ne: query._id },
    });

    if (existingSuperadmin) {
      return next(
        ApiError.badRequest('A SUPERADMIN account already exists. Only one SUPERADMIN is allowed.')
      );
    }
  }

  // Hash password on update if provided
  const newPassword = update?.password || update?.$set?.password;
  if (newPassword && !newPassword.startsWith('$2a$') && !newPassword.startsWith('$2b$')) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    if (update.password) {
      update.password = hashedPassword;
    }
    if (update.$set?.password) {
      update.$set.password = hashedPassword;
    }
  }

  next();
});

// Compare plaintext candidate password with stored hash
adminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Admin = model<IAdminDocument>('Admin', adminSchema);
