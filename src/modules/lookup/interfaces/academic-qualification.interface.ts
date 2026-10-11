import { Document, Types } from 'mongoose';
import { IAcademicField } from './academic-field.interface';

export type DegreeLevel = 'DIPLOMA' | 'ASSOCIATE' | 'BACHELOR' | 'MASTER' | 'DOCTORATE' | 'OTHER';

export interface IAcademicQualification extends Document {
  title: string;                                // عنوان مدرک / مدرک تحصیلی (مانند: کارشناسی مهندسی نرم‌افزار)
  academicField: Types.ObjectId | IAcademicField; // کلید خارجی ارجاع به رشته تحصیلی (academicField در دیاگرام)
  degreeLevel?: DegreeLevel;                    // مقطع تحصیلی (کارشناسی، ارشد، دکترا و...)
  institution?: string;                         // نام دانشگاه یا موسسه آموزشی
  graduationYear?: number;                      // سال فارغ‌التحصیلی
  isActive: boolean;                            // وضعیت فعال/غیرفعال
  createdAt: Date;
  updatedAt: Date;
}
