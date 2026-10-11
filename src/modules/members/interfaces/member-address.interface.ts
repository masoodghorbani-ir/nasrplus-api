import { Document, Types } from 'mongoose';

export type AddressType = 'WORK' | 'HOME' | 'CENTRAL_OFFICE' | 'BRANCH' | 'OTHER';

export interface IMemberAddress extends Document {
  membershipId: Types.ObjectId;     // کلید خارجی ارجاع به جدول Members (مطابق دیاگرام)
  addressType: AddressType;         // نوع آدرس (محل کار، سکونت، دفتر مرکزی، شعبه و...)
  province: string;                 // استان
  city: string;                     // شهر
  postalCode?: string;              // کد پستی ۱۰ رقمی
  address: string;                  // نشانی کامل پستی
  plaque?: string;                  // پلاک
  floor?: string;                   // طبقه
  unit?: string;                    // واحد
  postalBox?: string;               // صندوق پستی
  isPrimary: boolean;               // آیا آدرس اصلی و رسمی مکاتبات است؟
  createdAt: Date;
  updatedAt: Date;
}
