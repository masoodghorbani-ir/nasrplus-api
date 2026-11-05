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
      title: 'نرم افزار',
      code: 'SOFTWARE',
      description: 'حوزه تخصصی نرم‌افزار و سامانه‌های کاربردی',
      isActive: true,
    },
    {
      title: 'سخت افزار',
      code: 'HARDWARE',
      description: 'حوزه تخصصی سخت‌افزار، تجهیزات و قطعات',
      isActive: true,
    },
    {
      title: 'هوش مصنوعی',
      code: 'ARTIFICIAL_INTELLIGENCE',
      description: 'حوزه تخصصی هوش مصنوعی و یادگیری ماشین',
      isActive: true,
    },
    {
      title: 'مشاوران',
      code: 'CONSULTANTS',
      description: 'خدمات مشاوره تخصصی فناوری اطلاعات و ارتباطات',
      isActive: true,
    },
    {
      title: 'امنیت فضای تبادل اطلاعات (افتا)',
      code: 'INFORMATION_SECURITY_AFTA',
      description: 'امنیت اطلاعات، پدافند سایبری و خدمات افتا',
      isActive: true,
    },
    {
      title: 'آموزش و پژوهش',
      code: 'EDUCATION_AND_RESEARCH',
      description: 'آموزش‌های تخصصی و پژوهش‌های کاربردی فاوا',
      isActive: true,
    },
    {
      title: 'شبکه و مراکز داده',
      code: 'NETWORK_AND_DATA_CENTERS',
      description: 'زیرساخت شبکه، ارتباطات و مراکز داده',
      isActive: true,
    },
    {
      title: 'کسب و کارهای مجازی',
      code: 'VIRTUAL_BUSINESSES',
      description: 'کسب‌وکارهای اینترنتی، پلتفرم‌ها و تجارت الکترونیک',
      isActive: true,
    },
    {
      title: 'اینترنت و خدمات فضای مجازی',
      code: 'INTERNET_AND_CYBER_SERVICES',
      description: 'ارائه خدمات اینترنت و خدمات فضای مجازی',
      isActive: true,
    },
    {
      title: 'بلاکچین و رمز ارز',
      code: 'BLOCKCHAIN_AND_CRYPTOCURRENCY',
      description: 'فناوری بلاکچین، قراردادهای هوشمند و رمزارزها',
      isActive: true,
    },
    {
      title: 'قوانین و مقررات',
      code: 'LAWS_AND_REGULATIONS',
      description: 'امور حقوقی، مالکیت معنوی، قوانین و مقررات صنفی',
      isActive: true,
    },
    {
      title: 'رفاهی',
      code: 'WELFARE',
      description: 'خدمات، امور و تسهیلات رفاهی صنف',
      isActive: true,
    },
    {
      title: 'بین المللی',
      code: 'INTERNATIONAL',
      description: 'امور، ارتباطات و همکاری‌های بین‌المللی',
      isActive: true,
    },
    {
      title: 'صادرات خدمات فاوا',
      code: 'ICT_SERVICES_EXPORT',
      description: 'توسعه صادرات کالاها و خدمات فناوری اطلاعات و ارتباطات',
      isActive: true,
    },
    {
      title: 'تحول دیجیتال',
      code: 'DIGITAL_TRANSFORMATION',
      description: 'راهبری و پیاده‌سازی پروژه‌های تحول دیجیتال',
      isActive: true,
    },
    {
      title: 'پایش تصویر',
      code: 'VIDEO_SURVEILLANCE',
      description: 'سیستم‌های نظارت تصویری و حفاظت الکترونیک',
      isActive: true,
    },
  ],
};
