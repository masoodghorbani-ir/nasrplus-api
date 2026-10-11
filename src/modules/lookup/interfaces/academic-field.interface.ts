import { Document } from 'mongoose';

export interface IAcademicField extends Document {
  title: string;          // عنوان رشته تحصیلی (مهندسی نرم‌افزار، هوش مصنوعی، فناوری اطلاعات، علوم کامپیوتر...)
  code?: string;          // کد رشته تحصیلی وزارت علوم
  isActive: boolean;      // وضعیت فعال/غیرفعال
  createdAt: Date;
  updatedAt: Date;
}
