import { Document, Types } from 'mongoose';
import { IMembershipType } from '../../lookup/interfaces/membership-type.interface';
import { ISpecialization } from '../../lookup/interfaces/specialization.interface';
import { IRank } from '../../lookup/interfaces/rank.interface';
import { INatureOfMembership } from '../../lookup/interfaces/nature-of-membership.interface';
import { IAcademicQualification } from '../../lookup/interfaces/academic-qualification.interface';
import { ICompanyInformation } from '../../company/interfaces/company-information.interface';
import { IMemberAddress } from './member-address.interface';
import { IMemberTelephone } from './member-telephone.interface';

export type MemberType = 'INDIVIDUAL' | 'LEGAL' | 'STORE'; // حقیقی، حقوقی، فروشگاهی
export type MemberStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'REJECTED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface IMember extends Document {
  // --- کلیدهای خارجی دیاگرام (Foreign Keys) ---
  membershipTypeId: Types.ObjectId | IMembershipType;                     // نوع عضویت
  specializationId: Types.ObjectId | ISpecialization;                     // رسته / تخصص
  rankId?: Types.ObjectId | IRank;                                        // رتبه / گرید
  latestAcademicQualifications?: Types.ObjectId | IAcademicQualification; // آخرین مدرک تحصیلی
  natureOfMembership: Types.ObjectId | INatureOfMembership;               // ماهیت عضویت
  companyInformation?: Types.ObjectId | ICompanyInformation;             // اطلاعات شرکت وابسته

  // --- فیلدهای جامع هویتی و پرسنلی سازمان نظام صنفی ---
  memberCode: string;               // شماره عضویت یکتا در نظام صنفی
  memberType: MemberType;           // نوع عضو (حقیقی / حقوقی / فروشگاهی)
  nationalCode?: string;            // کد ملی ۱۰ رقمی (برای اعضای حقیقی)
  firstName?: string;               // نام
  lastName?: string;                // نام خانوادگی
  fatherName?: string;              // نام پدر
  gender?: Gender;                  // جنسیت
  birthDate?: Date;                 // تاریخ تولد
  identityCertificateNumber?: string; // شماره شناسنامه
  email?: string;                   // رایانامه / ایمیل
  profileImage?: string;            // تصویر پرسنلی یا لوگو
  status: MemberStatus;             // وضعیت عضویت در نظام صنفی
  membershipDate: Date;             // تاریخ صدور یا شروع عضویت
  expiryDate: Date;                 // تاریخ پایان اعتبار عضویت / پروانه
  notes?: string;                   // یادداشت‌های سیستمی و توضیحات داخلی

  createdAt: Date;
  updatedAt: Date;

  // --- Virtual Properties ---
  addresses?: IMemberAddress[];
  telephones?: IMemberTelephone[];
  readonly fullName: string;
}
