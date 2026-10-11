import { Document, Types } from 'mongoose';

export type PhoneType = 'MOBILE' | 'LANDLINE' | 'FAX' | 'SUPPORT' | 'OTHER';

export interface IMemberTelephone extends Document {
  membershipId: Types.ObjectId;     // کلید خارجی ارجاع به جدول Members (مطابق دیاگرام)
  phoneType: PhoneType;             // نوع شماره (موبایل، تلفن ثابت، فکس، پشتیبانی و...)
  phoneNumber: string;              // شماره تماس (مثلاً 09123456789 یا 88776655)
  areaCode?: string;                // پیش شماره شهری (مثلاً 021)
  countryCode: string;              // کد کشور (پیش فرض +98)
  extension?: string;               // شماره داخلی
  title?: string;                   // برچسب / عنوان شماره (مثلاً: خط اختصاصی مدیرعامل، فکس دبیرخانه)
  isPrimary: boolean;               // آیا شماره تماس اصلی (برای پیامک و اطلاع‌رسانی) است؟
  createdAt: Date;
  updatedAt: Date;
}
