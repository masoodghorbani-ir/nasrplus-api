import { Document } from 'mongoose';

export interface IMembershipType extends Document {
  title: string;          // عنوان نوع عضویت (مانند: عضو حقیقی، حقوقی، فروشگاهی، افتخاری)
  code?: string;          // کد شناسه یکتا یا کد سیستمی نوع عضویت
  description?: string;   // توضیحات
  isActive: boolean;      // وضعیت فعال/غیرفعال
  createdAt: Date;
  updatedAt: Date;
}
