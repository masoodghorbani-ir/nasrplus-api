import { Document } from 'mongoose';

export interface IRank extends Document {
  title: string;          // عنوان رتبه / گرید (مانند: رتبه ۱، رتبه ۲، پایه ۱، مشاور ارشد و...)
  level?: number;         // مقدار عددی رتبه برای مرتب‌سازی و اولویت‌بندی
  description?: string;   // توضیحات شرایط احراز رتبه
  isActive: boolean;      // وضعیت فعال/غیرفعال
  createdAt: Date;
  updatedAt: Date;
}
