import { envConfig } from './env.config';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'سامانه جامع مدیریت اعضای سازمان نظام صنفی رایانه‌ای (NasrPlus API)',
    version: '1.0.0',
    description: 'مستندات Swagger برای وب‌سرویس‌های مدیریت اعضا، مدارک، تخصص‌ها، آدرس‌ها و اطلاعات تکمیلی نظام صنفی',
    contact: {
      name: 'پشتیبانی فنی نظام صنفی رایانه‌ای',
    },
  },
  servers: [
    {
      url: `http://localhost:${envConfig.port}`,
      description: 'سرور محلی توسعه (Development)',
    },
  ],
  tags: [
    {
      name: 'Members',
      description: 'عملیات مربوط به اعضای صنف (حقیقی، حقوقی، فروشگاهی)',
    },
    {
      name: 'Lookups',
      description: 'جداول و اطلاعات پایه (نوع عضویت، رسته، رتبه، مدرک و ماهیت عضویت)',
    },
    {
      name: 'System',
      description: 'سرویس‌های سیستمی و بررسی سلامت سرور',
    },
  ],
  paths: {
    '/api/v1/health': {
      get: {
        tags: ['System'],
        summary: 'بررسی سلامت سرویس (Health Check)',
        responses: {
          200: {
            description: 'وضعیت سرویس فعال و متصل است',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    service: { type: 'string', example: 'NasrPlus Members Management API' },
                    timestamp: { type: 'string', example: '2026-10-11T16:25:00.000Z' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/members': {
      get: {
        tags: ['Members'],
        summary: 'دریافت فهرست اعضای نظام صنفی همراه با صفحه‌بندی',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'شماره صفحه',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'تعداد آیتم در هر صفحه',
            required: false,
            schema: { type: 'integer', default: 20 },
          },
        ],
        responses: {
          200: {
            description: 'فهرست اعضا با موفقیت بازگردانده شد',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseMemberList',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Members'],
        summary: 'ثبت عضو جدید در نظام صنفی',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateMemberInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'عضو جدید با موفقیت ایجاد شد',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseMemberSingle',
                },
              },
            },
          },
          400: {
            description: 'اطلاعات ارسالی نامعتبر است',
          },
          409: {
            description: 'شماره عضویت یا کد ملی تکراری است',
          },
        },
      },
    },
    '/api/v1/members/{id}': {
      get: {
        tags: ['Members'],
        summary: 'دریافت جزئیات پرونده یک عضو با شناسه یکتا',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'شناسه یکتای عضو (MongoDB ObjectId)',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'اطلاعات عضو به همراه جداول وابسته دریافت شد',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseMemberSingle',
                },
              },
            },
          },
          404: {
            description: 'عضو مورد نظر یافت نشد',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Member: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '67093bc2f9821a0012345678' },
          memberCode: { type: 'string', example: '21010045' },
          memberType: {
            type: 'string',
            enum: ['INDIVIDUAL', 'LEGAL', 'STORE'],
            example: 'INDIVIDUAL',
          },
          nationalCode: { type: 'string', example: '0012345678' },
          firstName: { type: 'string', example: 'مسعود' },
          lastName: { type: 'string', example: 'محمدی' },
          fatherName: { type: 'string', example: 'علی' },
          gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'MALE' },
          birthDate: { type: 'string', format: 'date', example: '1990-05-21' },
          status: {
            type: 'string',
            enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'REJECTED'],
            example: 'ACTIVE',
          },
          membershipTypeId: { type: 'string', description: 'شناسه نوع عضویت (MembershipType)' },
          specializationId: { type: 'string', description: 'شناسه رسته/تخصص (Specialization)' },
          rankId: { type: 'string', description: 'شناسه رتبه/گرید (Rank)' },
          latestAcademicQualifications: { type: 'string', description: 'شناسه مدرک تحصیلی (AcademicQualification)' },
          natureOfMembership: { type: 'string', description: 'شناسه ماهیت عضویت (NatureOfMembership)' },
          companyInformation: { type: 'string', description: 'شناسه اطلاعات شرکت (CompanyInformation)' },
          membershipDate: { type: 'string', format: 'date-time' },
          expiryDate: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateMemberInput: {
        type: 'object',
        required: [
          'memberCode',
          'membershipTypeId',
          'specializationId',
          'natureOfMembership',
        ],
        properties: {
          memberCode: { type: 'string', example: '21010045' },
          memberType: { type: 'string', enum: ['INDIVIDUAL', 'LEGAL', 'STORE'], default: 'INDIVIDUAL' },
          nationalCode: { type: 'string', example: '0012345678' },
          firstName: { type: 'string', example: 'مسعود' },
          lastName: { type: 'string', example: 'محمدی' },
          membershipTypeId: { type: 'string', example: '67093bc2f9821a0012345671' },
          specializationId: { type: 'string', example: '67093bc2f9821a0012345672' },
          rankId: { type: 'string', example: '67093bc2f9821a0012345673' },
          latestAcademicQualifications: { type: 'string', example: '67093bc2f9821a0012345674' },
          natureOfMembership: { type: 'string', example: '67093bc2f9821a0012345675' },
          companyInformation: { type: 'string', example: '67093bc2f9821a0012345676' },
        },
      },
      MemberAddress: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          membershipId: { type: 'string', description: 'ارجاع به شناسه عضو' },
          addressType: { type: 'string', enum: ['WORK', 'HOME', 'CENTRAL_OFFICE', 'BRANCH', 'OTHER'] },
          province: { type: 'string', example: 'تهران' },
          city: { type: 'string', example: 'تهران' },
          postalCode: { type: 'string', example: '1417755331' },
          address: { type: 'string', example: 'خیابان مطهری، پلاک ۱۲، واحد ۴' },
          isPrimary: { type: 'boolean', example: true },
        },
      },
      MemberTelephone: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          membershipId: { type: 'string', description: 'ارجاع به شناسه عضو' },
          phoneType: { type: 'string', enum: ['MOBILE', 'LANDLINE', 'FAX', 'SUPPORT', 'OTHER'] },
          phoneNumber: { type: 'string', example: '09121234567' },
          areaCode: { type: 'string', example: '021' },
          countryCode: { type: 'string', example: '+98' },
          extension: { type: 'string', example: '102' },
          isPrimary: { type: 'boolean', example: true },
        },
      },
      MembershipType: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'عضو حقیقی' },
          code: { type: 'string', example: 'INDIVIDUAL' },
          isActive: { type: 'boolean', default: true },
        },
      },
      Specialization: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'نرم‌افزار و سامانه‌های اطلاعاتی' },
          code: { type: 'string', example: 'SOFTWARE' },
          isActive: { type: 'boolean', default: true },
        },
      },
      Rank: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'پایه ۱ (رتبه ۱)' },
          level: { type: 'number', example: 1 },
          isActive: { type: 'boolean', default: true },
        },
      },
      AcademicField: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'مهندسی کامپیوتر' },
          isActive: { type: 'boolean', default: true },
        },
      },
      AcademicQualification: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'کارشناسی ارشد مهندسی نرم‌افزار' },
          academicField: { type: 'string', description: 'ارجاع به رشته تحصیلی' },
          degreeLevel: { type: 'string', example: 'MASTER' },
          institution: { type: 'string', example: 'دانشگاه تهران' },
        },
      },
      NatureOfMembership: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'پیوسته' },
          code: { type: 'string', example: 'CONTINUOUS' },
        },
      },
      CompanyInformation: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'شرکت داده‌پردازی نصر' },
          nationalId: { type: 'string', example: '10101234567' },
          registrationNumber: { type: 'string', example: '456789' },
          ceoName: { type: 'string', example: 'علی رضایی' },
        },
      },
      ApiResponseMemberList: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'لیست اعضا با موفقیت دریافت شد' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Member' },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'integer', example: 150 },
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 20 },
              totalPages: { type: 'integer', example: 8 },
            },
          },
        },
      },
      ApiResponseMemberSingle: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'اطلاعات عضو دریافت شد' },
          data: { $ref: '#/components/schemas/Member' },
        },
      },
    },
  },
};
