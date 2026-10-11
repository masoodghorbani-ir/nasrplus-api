import { Schema, model } from 'mongoose';
import { IMember } from '../interfaces/member.interface';

const memberSchema = new Schema<IMember>(
  {
    // -------------------------------------------------------------
    // فیلدهای کلید خارجی دیاگرام (References)
    // -------------------------------------------------------------
    membershipTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'MembershipType',
      required: [true, 'نوع عضویت الزامی است'],
      index: true,
    },
    specializationId: {
      type: Schema.Types.ObjectId,
      ref: 'Specialization',
      required: [true, 'رسته/تخصص الزامی است'],
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
      required: [true, 'ماهیت عضویت الزامی است'],
      index: true,
    },
    companyInformation: {
      type: Schema.Types.ObjectId,
      ref: 'CompanyInformation',
      default: null,
      index: true,
    },

    // -------------------------------------------------------------
    // مشخصات هویتی و پرسنلی عضو صنف
    // -------------------------------------------------------------
    memberCode: {
      type: String,
      required: [true, 'شماره عضویت در سازمان نظام صنفی الزامی است'],
      unique: true,
      trim: true,
      index: true,
    },
    memberType: {
      type: String,
      enum: {
        values: ['INDIVIDUAL', 'LEGAL', 'STORE'],
        message: 'نوع عضو باید حقیقی، حقوقی یا فروشگاهی باشد',
      },
      default: 'INDIVIDUAL',
      required: true,
      index: true,
    },
    nationalCode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^[0-9]{10}$/, 'کد ملی باید ۱۰ رقم عددی باشد'],
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
        message: 'وضعیت عضویت نامعتبر است',
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
// Virtual Populates برای آدرس‌ها و شماره تلفن‌های عضو (الگوی رابطه‌ای)
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

// نام و نام خانوادگی کامل
memberSchema.virtual('fullName').get(function (this: IMember) {
  if (this.firstName || this.lastName) {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
  return '';
});

// ایندکس‌های ترکیبی برای بهینه‌سازی کوئری‌های متداول
memberSchema.index({ status: 1, membershipTypeId: 1 });
memberSchema.index({ lastName: 1, firstName: 1 });

export const Member = model<IMember>('Member', memberSchema);
