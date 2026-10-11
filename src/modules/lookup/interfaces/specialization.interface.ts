import { Document } from 'mongoose';

export interface ISpecialization extends Document {
  title: string;          // عنوان رسته / تخصص (نرم‌افزار، سخت‌افزار، امنیت، شبکه، آموزش و مشاوره...)
  code?: string;          // کد رسته
  description?: string;   // توضیحات تکمیلی
  isActive: boolean;      // وضعیت فعال/غیرفعال
  createdAt: Date;
  updatedAt: Date;
}
