import { Document } from 'mongoose';

export type CompanyLegalType = 
  | 'PRIVATE_JOINT_STOCK'     // سهامی خاص
  | 'PUBLIC_JOINT_STOCK'      // سهامی عام
  | 'LIMITED_LIABILITY'       // با مسئولیت محدود
  | 'COOPERATIVE'             // تعاونی
  | 'KNOWLEDGE_BASED'         // دانش‌بنیان
  | 'STARTUP'                 // استارتاپ / نوپا
  | 'OTHER';                  // سایر

export interface ICompanyInformation extends Document {
  title: string;                      // نام / عنوان رسمی شرکت (title در دیاگرام)
  companyType?: CompanyLegalType;     // نوع ثبتی شرکت
  nationalId?: string;                // شناسه ملی شرکت (۱۱ رقمی)
  registrationNumber?: string;        // شماره ثبت شرکت
  economicCode?: string;              // کد اقتصادی شرکت
  ceoName?: string;                   // نام و نام خانوادگی مدیرعامل
  establishmentDate?: Date;           // تاریخ تاسیس / ثبت
  website?: string;                   // تارنما / وبسایت
  email?: string;                     // ایمیل سازمانی
  description?: string;               // معرفی شرکت و زمینه فعالیت
  isActive: boolean;                  // وضعیت فعال/غیرفعال
  createdAt: Date;
  updatedAt: Date;
}
