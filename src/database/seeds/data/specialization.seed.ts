import { Specialization } from '../../../modules/lookup/models';
import { SeedTableConfig, SeedSpecializationItem } from '../types';

/** Seed data for Specialization */
export const specializationSeed: SeedTableConfig<SeedSpecializationItem> = {
  tableName: 'Specialization',
  model: Specialization,
  forceInsertBySeed: false,
  uniqueKey: 'title',
  data: [
    {
      title: 'مهندس و مدیر شبکه',
      code: 'NETWORK_ENGINEER_MANAGER',
      description: 'طراحی، پیاده‌سازی و مدیریت شبکه‌های سازمانی',
      isActive: true,
    },
    {
      title: 'متخصص امنیت سایبری و شبکه',
      code: 'CYBERSECURITY_NETWORK_SPECIALIST',
      description: 'امنیت اطلاعات، تست نفوذ و پایش امنیت سایبری',
      isActive: true,
    },
    {
      title: 'مهندس رایانش ابری',
      code: 'CLOUD_ENGINEER',
      description: 'معماری و توسعه سرویس‌های ابری و زیرساخت کلود',
      isActive: true,
    },
    {
      title: 'مهندس دوآپس',
      code: 'DEVOPS_ENGINEER',
      description: 'استقرار مستمر، یکپارچه‌سازی و خودکارسازی زیرساخت',
      isActive: true,
    },
    {
      title: 'توسعه‌دهنده وب',
      code: 'WEB_DEVELOPER',
      description: 'طراحی و پیاده‌سازی وب‌سایت‌ها و سامانه‌های تحت وب',
      isActive: true,
    },
    {
      title: 'توسعه‌دهنده موبایل',
      code: 'MOBILE_DEVELOPER',
      description: 'توسعه نرم‌افزارهای تلفن همراه (اندروید و iOS)',
      isActive: true,
    },
    {
      title: 'برنامه نویس فول استک',
      code: 'FULLSTACK_DEVELOPER',
      description: 'توسعه هم‌زمان لایه‌های فرانت‌اند و بک‌اند نرم‌افزار',
      isActive: true,
    },
    {
      title: 'برنامه نویس بک اند',
      code: 'BACKEND_DEVELOPER',
      description: 'توسعه منطق سرور، پایگاه‌های داده و وب‌سرویس‌ها',
      isActive: true,
    },
    {
      title: 'برنامه نویس فرانت اند',
      code: 'FRONTEND_DEVELOPER',
      description: 'توسعه رابط‌های کاربری وب و تجربیات کاربری',
      isActive: true,
    },
    {
      title: 'متخصص دیتابیس',
      code: 'DATABASE_SPECIALIST',
      description: 'طراحی، بهینه‌سازی و مدیریت پایگاه‌های داده رابطه‌ای و غیررابطه‌ای',
      isActive: true,
    },
    {
      title: 'مهندس هوش مصنوعی و یادگیری ماشین',
      code: 'AI_ML_ENGINEER',
      description: 'توسعه مدل‌های هوش مصنوعی، یادگیری عمیق و پردازش هوشمند',
      isActive: true,
    },
    {
      title: 'تحلیلگر و دانشمند داده',
      code: 'DATA_SCIENTIST_ANALYST',
      description: 'تجزیه و تحلیل داده‌های کلان، داده‌کاوی و هوش تجاری',
      isActive: true,
    },
    {
      title: 'کارشناس پشتیبانی فناوری اطلاعات',
      code: 'IT_SUPPORT_SPECIALIST',
      description: 'پشتیبانی فنی سیستم‌ها، هلپ‌دسک و رفع ایرادات سیستمی',
      isActive: true,
    },
    {
      title: 'تکنسین پسیو شبکه',
      code: 'PASSIVE_NETWORK_TECHNICIAN',
      description: 'کابل‌کشی، رک‌بندی و نصب فیزیکی تجهیزات شبکه',
      isActive: true,
    },
  ],
};
