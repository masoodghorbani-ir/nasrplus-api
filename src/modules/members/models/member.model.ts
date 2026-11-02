import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IMemberDocument } from '../interfaces/member.interface';

const memberSchema = new Schema<IMemberDocument>(
  {
    // -------------------------------------------------------------
    // Foreign Key References (from ER Diagram)
    // -------------------------------------------------------------
    membershipTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'MembershipType',
      required: [true, 'Membership type reference is required'],
      index: true,
    },
    specializationId: {
      type: Schema.Types.ObjectId,
      ref: 'Specialization',
      default: null,
      index: true,
    },
    rankId: {
      type: Schema.Types.ObjectId,
      ref: 'Rank',
      default: null,
      index: true,
    },
    latestAcademicQualifications: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicQualification',
      default: null,
      index: true,
    },
    natureOfMembership: {
      type: Schema.Types.ObjectId,
      ref: 'NatureOfMembership',
      required: [true, 'Nature of membership reference is required'],
      index: true,
    },
    companyInformation: {
      type: Schema.Types.ObjectId,
      ref: 'CompanyInformation',
      default: null,
      index: true,
    },

    // -------------------------------------------------------------
    // Guild Member Identity and Profile Attributes
    // -------------------------------------------------------------
    memberCode: {
      type: String,
      required: [true, 'Guild membership code is required'],
      unique: true,
      trim: true,
      index: true,
    },
    nationalCode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^[0-9]{10}$/, 'National code must be a 10-digit number'],
      index: true,
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    firstName: {
      type: String,
      trim: true,
      default: '',
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    fatherName: {
      type: String,
      trim: true,
      default: '',
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      default: 'MALE',
    },
    birthDate: {
      type: Date,
    },
    identityCertificateNumber: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    profileImage: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'REJECTED'],
        message: 'Invalid membership status provided',
      },
      default: 'PENDING',
      index: true,
    },
    membershipDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// -------------------------------------------------------------
// Virtual Populates for Member Addresses, Telephones, and Qualifications
// -------------------------------------------------------------
memberSchema.virtual('addresses', {
  ref: 'MemberAddress',
  localField: '_id',
  foreignField: 'membershipId',
});

memberSchema.virtual('telephones', {
  ref: 'MemberTelephone',
  localField: '_id',
  foreignField: 'membershipId',
});

memberSchema.virtual('academicQualifications', {
  ref: 'AcademicQualification',
  localField: '_id',
  foreignField: 'memberId',
});

memberSchema.virtual('skills', {
  ref: 'MemberSkill',
  localField: '_id',
  foreignField: 'memberId',
});

// Full name computed virtual
memberSchema.virtual('fullName').get(function (this: IMemberDocument) {
  if (this.firstName || this.lastName) {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
  return '';
});

// Hash password on save when modified
memberSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
  next();
});

// Hash password on findOneAndUpdate when provided
memberSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as Record<string, any>;
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
memberSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Compound indexes for query optimization
memberSchema.index({ status: 1, membershipTypeId: 1 });
memberSchema.index({ lastName: 1, firstName: 1 });

export const Member = model<IMemberDocument>('Member', memberSchema);
