import { Document } from 'mongoose';

export interface INatureOfMembership extends Document {
  title: string;          // ماهیت عضویت (مانند: پیوسته، وابسته، افتخاری، دائم، موقت)
  code?: string;          // کد شناسه
  description?: string;   // توضیحات حقوقی/صنفی ماهیت
  isActive: boolean;      // وضعیت فعال/غیرفعال
  createdAt: Date;
  updatedAt: Date;
}
