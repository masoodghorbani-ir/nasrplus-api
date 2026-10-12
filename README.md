# پروژه سامانه جامع مدیریت اعضای سازمان نظام صنفی رایانه‌ای (NasrPlus API)

این پروژه بر پایه **Node.js**، **TypeScript**، فریم‌ورک **Express.js** و پایگاه داده **MongoDB** با **Mongoose** و طبق معماری چندلایه‌ای (Layered Architecture) پیاده‌سازی شده است.

---

## 🏗 ساختار معماری و پوشه‌بندی پروژه

پروژه با ساختار ماژولار و بر پایه تفکیک مسئولیت‌ها (Separation of Concerns) طراحی شده است:

```
nasrplus/
├── src/
│   ├── config/                     # تنظیمات برنامه و دیتابیس
│   │   ├── env.config.ts           # مدیریت متغیرهای محیطی با اعتبارسنجی
│   │   └── database.ts             # اتصال و مدیریت چرخه‌حیات دیتابیس MongoDB
│   │
│   ├── common/                     # لایه مشترک (ابزارها، میدلورها، پاسخ‌ها و خطاها)
│   │   ├── utils/
│   │   │   ├── api-response.ts     # قالب‌بندی استاندارد خروجی API
│   │   │   └── api-error.ts        # کلاس خطاهای سفارشی HTTP
│   │   └── middlewares/
│   │       ├── error.middleware.ts # هندلر متمرکز خطاها (Mongoose & HTTP)
│   │       └── not-found.middleware.ts # مدیریت روت‌های نامعتبر ۴۰۴
│   │
│   ├── modules/                    # ماژول‌های دامنه‌ای سیستم (Domain Modules)
│   │   ├── lookup/                 # جداول و داده‌های پایه صنف
│   │   │   ├── interfaces/         # اینترفیس‌های تایپ‌اسکریپت
│   │   │   │   ├── membership-type.interface.ts
│   │   │   │   ├── specialization.interface.ts
│   │   │   │   ├── rank.interface.ts
│   │   │   │   ├── nature-of-membership.interface.ts
│   │   │   │   ├── academic-field.interface.ts
│   │   │   │   └── academic-qualification.interface.ts
│   │   │   └── models/             # مدل‌های مانگوس
│   │   │       ├── membership-type.model.ts
│   │   │       ├── specialization.model.ts
│   │   │       ├── rank.model.ts
│   │   │       ├── nature-of-membership.model.ts
│   │   │       ├── academic-field.model.ts
│   │   │       └── academic-qualification.model.ts
│   │   │
│   │   ├── company/                # ماژول اطلاعات شرکت‌ها
│   │   │   ├── interfaces/
│   │   │   │   └── company-information.interface.ts
│   │   │   └── models/
│   │   │       └── company-information.model.ts
│   │   │
│   │   └── members/                # ماژول اصلی مدیریت اعضا
│   │       ├── interfaces/
│   │       │   ├── member.interface.ts
│   │       │   ├── member-address.interface.ts
│   │       │   └── member-telephone.interface.ts
│   │       ├── models/
│   │       │   ├── member.model.ts
│   │       │   ├── member-address.model.ts
│   │       │   └── member-telephone.model.ts
│   │       ├── repositories/       # لایه دسترسی به داده (Data Access Layer)
│   │       │   └── member.repository.ts
│   │       ├── services/           # لایه منطق تجاری (Business Logic)
│   │       │   └── member.service.ts
│   │       ├── controllers/        # لایه کنترلر و هندلرهای HTTP
│   │       │   └── member.controller.ts
│   │       └── routes/             # لایه مسیرها (Routes)
│   │           └── member.routes.ts
│   │
│   ├── models/                     # دسترسی آسان و متمرکز به تمامی مدل‌ها
│   │   └── index.ts
│   │
│   ├── app.ts                      # تنظیم میدلورها، مسیرها و برنامه Express
│   └── server.ts                   # نقطه ورود اجرای سرور و مدیریت Graceful Shutdown
│
├── .env                            # متغیرهای محیطی پیش‌فرض
├── .env.example                    # نمونه متغیرهای محیطی
├── .gitignore
├── tsconfig.json                   # تنظیمات کامپایلر تایپ‌اسکریپت
└── package.json
```

---

## 🗄 جداول و اسکیمای پایگاه‌داده (طراحی‌شده بر اساس دیاگرام)

۱۰ جدول/کالکشن به همراه اینترفیس‌های کامل و تایپ‌سیف در پروژه پیاده‌سازی شده‌اند:

| نام جدول در دیاگرام | نام مدل در کد | توضیحات و نحوه ارتباط |
| :--- | :--- | :--- |
| **Membership Type** | `MembershipType` | نوع عضویت (حقیقی، حقوقی، فروشگاهی، افتخاری) |
| **Specialization** | `Specialization` | رسته / تخصص (نرم‌افزار، سخت‌افزار، شبکه، امنیت و...) |
| **Rank** | `Rank` | رتبه / گرید نظام صنفی (رتبه ۱ تا ۷، پایه ۱ تا ۳) |
| **Academic Field** | `AcademicField` | رشته تحصیلی دانشگاهی (مهندسی نرم‌افزار، هوش مصنوعی و...) |
| **Degree Level** | `DegreeLevel` | مقطع تحصیلی (دیپلم، کاردانی، کارشناسی، ارشد، دکتری) |
| **Academic qualifications** | `AcademicQualification` | مدارک تحصیلی؛ دارای ارجاع به `AcademicField` و `DegreeLevel` |
| **Nature Of Membership** | `NatureOfMembership` | ماهیت عضویت (حقیقی Real، حقوقی Legal) |
| **Company Information** | `CompanyInformation` | اطلاعات ثبتی، شناسه ملی، نام شرکت و مشخصات مدیرعامل |
| **Members** | `Member` | جدول مرکزی؛ ارجاع به ۶ جدول فوق به‌همراه فیلدهای هویتی و پرسنلی صنف |
| **Members Address** | `MemberAddress` | آدرس‌های عضو؛ دارای ارجاع `membershipId` به جدول `Member` |
| **Members Telephones** | `MemberTelephone` | تلفن‌های عضو؛ دارای ارجاع `membershipId` به جدول `Member` |

---

## 🚀 نحوه راه‌اندازی و اجرای پروژه

### ۱. اجرای در حالت توسعه (Development):
```bash
npm run dev
```

### ۲. مقداردهی اولیه داده‌های پایه و نمونه (Seed Database):
```bash
npm run seed
```

### ۳. بیلد و بررسی خطاهای تایپ‌اسکریپت:
```bash
npm run build
```

### ۴. اجرای خروجی کامپایل‌شده (Production):
```bash
npm start
```

---

## 📖 مستندات تعاملی Swagger

پس از اجرای سرور، مستندات کامل API از طریق آدرس‌های زیر در دسترس است:
- **آدرس اصلی Swagger:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **آدرس میانبر:** [http://localhost:5000/docs](http://localhost:5000/docs)

---

## 🌐 خلاصه مسیرهای کامل API

- **سیستم:**
  - `GET /api/v1/health`
- **اعضای صنف (Members):**
  - `GET /api/v1/members` (صفحه‌بندی، جستجو و فیلترها)
  - `POST /api/v1/members`
  - `GET /api/v1/members/:id`
  - `PUT /api/v1/members/:id`
  - `DELETE /api/v1/members/:id`
- **آدرس‌های اعضا (Member Addresses):**
  - `GET /api/v1/members/:id/addresses`
  - `POST /api/v1/members/:id/addresses`
  - `PUT /api/v1/members/:id/addresses/:addressId`
  - `DELETE /api/v1/members/:id/addresses/:addressId`
- **تلفن‌های اعضا (Member Telephones):**
  - `GET /api/v1/members/:id/telephones`
  - `POST /api/v1/members/:id/telephones`
  - `PUT /api/v1/members/:id/telephones/:telephoneId`
  - `DELETE /api/v1/members/:id/telephones/:telephoneId`
- **شرکت‌ها (Companies):**
  - `GET /api/v1/companies`
  - `POST /api/v1/companies`
  - `GET /api/v1/companies/:id`
  - `PUT /api/v1/companies/:id`
  - `DELETE /api/v1/companies/:id`
- **جداول پایه صنف (Lookups):**
  - `/api/v1/lookups/membership-types` (CRUD)
  - `/api/v1/lookups/specializations` (CRUD)
  - `/api/v1/lookups/ranks` (CRUD)
  - `/api/v1/lookups/nature-of-memberships` (CRUD)
  - `/api/v1/lookups/academic-fields` (CRUD)
  - `/api/v1/lookups/academic-qualifications` (CRUD)


