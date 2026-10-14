import { Schema, model } from 'mongoose';
import { IMember } from '../interfaces/member.interface';

const memberSchema = new Schema<IMember>(
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// -------------------------------------------------------------
// Virtual Populates for Member Addresses and Contact Telephones
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

// Full name computed virtual
memberSchema.virtual('fullName').get(function (this: IMember) {
  if (this.firstName || this.lastName) {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
  return '';
});

// Compound indexes for query optimization
memberSchema.index({ status: 1, membershipTypeId: 1 });
memberSchema.index({ lastName: 1, firstName: 1 });

export const Member = model<IMember>('Member', memberSchema);
