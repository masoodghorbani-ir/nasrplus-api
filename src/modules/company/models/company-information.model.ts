import { Schema, model } from 'mongoose';
import { ICompanyInformation } from '../interfaces/company-information.interface';

const companyInformationSchema = new Schema<ICompanyInformation>(
  {
    title: {
      type: String,
      required: [true, 'Company title/name is required'],
      trim: true,
      index: true,
    },
    companyType: {
      type: String,
      enum: {
        values: [
          'PRIVATE_JOINT_STOCK',
          'PUBLIC_JOINT_STOCK',
          'LIMITED_LIABILITY',
          'COOPERATIVE',
          'KNOWLEDGE_BASED',
          'STARTUP',
          'OTHER',
        ],
        message: 'Invalid company legal type provided',
      },
      default: 'PRIVATE_JOINT_STOCK',
    },
    nationalId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^[0-9]{11}$/, 'Company national ID must be an 11-digit number'],
    },
    registrationNumber: {
      type: String,
      trim: true,
      sparse: true,
    },
    economicCode: {
      type: String,
      trim: true,
      sparse: true,
    },
    ceoName: {
      type: String,
      trim: true,
      default: '',
    },
    establishmentDate: {
      type: Date,
    },
    website: {
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
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

companyInformationSchema.index({ title: 1 });
companyInformationSchema.index({ registrationNumber: 1 });

export const CompanyInformation = model<ICompanyInformation>(
  'CompanyInformation',
  companyInformationSchema
);
