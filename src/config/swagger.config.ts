import { envConfig } from './env.config';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'NasrPlus - Computer Trade Guild Member Management API',
    version: '1.0.0',
    description:
      'OpenAPI 3.0 specification for NasrPlus (Iranian Computer Trade Guild Organization). Provides endpoints for managing guild members, affiliations, classifications, qualifications, addresses, and contact numbers.',
    contact: {
      name: 'Technical Support & Development Team',
      email: 'dev@nasrplus.ir',
    },
  },
  servers: [
    {
      url: `http://localhost:${envConfig.port}`,
      description: 'Local Development Server',
    },
  ],
  tags: [
    {
      name: 'Members',
      description: 'Guild member profiles, registration, lifecycle, and detail operations',
    },
    {
      name: 'Lookups',
      description: 'Base tables: Membership types, specializations, ranks, fields, and qualifications',
    },
    {
      name: 'Company',
      description: 'Corporate profiles and enterprise affiliations for legal entity members',
    },
    {
      name: 'System',
      description: 'System health monitoring and runtime diagnostics',
    },
  ],
  paths: {
    '/api/v1/health': {
      get: {
        tags: ['System'],
        summary: 'Service health check',
        description: 'Returns current service status, service name, and timestamp.',
        responses: {
          200: {
            description: 'Service is healthy and reachable',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    service: { type: 'string', example: 'NasrPlus Members Management API' },
                    swaggerDocs: { type: 'string', example: '/api-docs' },
                    timestamp: { type: 'string', example: '2026-10-11T16:30:00.000Z' },
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
        summary: 'Get paginated list of members',
        description: 'Retrieves a list of guild members with pagination support and populated reference fields.',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number (1-indexed)',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of records per page',
            required: false,
            schema: { type: 'integer', default: 20 },
          },
        ],
        responses: {
          200: {
            description: 'Members list retrieved successfully',
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
        summary: 'Register a new member',
        description: 'Creates a new member profile with foreign key relations and identity information.',
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
            description: 'Member created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseMemberSingle',
                },
              },
            },
          },
          400: {
            description: 'Validation error: Invalid input data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
          409: {
            description: 'Conflict: Member code or national code already registered',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/members/{id}': {
      get: {
        tags: ['Members'],
        summary: 'Get member details by ID',
        description: 'Fetches detailed member information including virtual-populated addresses and telephone numbers.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Unique member ID (MongoDB ObjectId)',
            schema: { type: 'string', example: '67093bc2f9821a0012345678' },
          },
        ],
        responses: {
          200: {
            description: 'Member details retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseMemberSingle',
                },
              },
            },
          },
          404: {
            description: 'Member not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Members'],
        summary: 'Update member profile by ID',
        description: 'Updates specified fields for an existing member.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Unique member ID (MongoDB ObjectId)',
            schema: { type: 'string', example: '67093bc2f9821a0012345678' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateMemberInput',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Member updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseMemberSingle',
                },
              },
            },
          },
          404: {
            description: 'Member not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Members'],
        summary: 'Delete member by ID',
        description: 'Permanently removes a member record from the system.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Unique member ID (MongoDB ObjectId)',
            schema: { type: 'string', example: '67093bc2f9821a0012345678' },
          },
        ],
        responses: {
          200: {
            description: 'Member deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseMemberSingle',
                },
              },
            },
          },
          404: {
            description: 'Member not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
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
          memberCode: { type: 'string', description: 'Unique Guild Membership Code', example: '21010045' },
          memberType: {
            type: 'string',
            enum: ['INDIVIDUAL', 'LEGAL', 'STORE'],
            description: 'Member entity classification',
            example: 'INDIVIDUAL',
          },
          nationalCode: { type: 'string', description: '10-digit National ID (for individuals)', example: '0012345678' },
          firstName: { type: 'string', example: 'Masoud' },
          lastName: { type: 'string', example: 'Mohammadi' },
          fatherName: { type: 'string', example: 'Ali' },
          gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'MALE' },
          birthDate: { type: 'string', format: 'date', example: '1990-05-21' },
          status: {
            type: 'string',
            enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'REJECTED'],
            example: 'ACTIVE',
          },
          membershipTypeId: { type: 'string', description: 'Reference ID to MembershipType' },
          specializationId: { type: 'string', description: 'Reference ID to Specialization' },
          rankId: { type: 'string', description: 'Reference ID to Rank (Grade)' },
          latestAcademicQualifications: { type: 'string', description: 'Reference ID to AcademicQualification' },
          natureOfMembership: { type: 'string', description: 'Reference ID to NatureOfMembership' },
          companyInformation: { type: 'string', description: 'Reference ID to CompanyInformation' },
          membershipDate: { type: 'string', format: 'date-time' },
          expiryDate: { type: 'string', format: 'date-time' },
          addresses: {
            type: 'array',
            items: { $ref: '#/components/schemas/MemberAddress' },
          },
          telephones: {
            type: 'array',
            items: { $ref: '#/components/schemas/MemberTelephone' },
          },
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
          firstName: { type: 'string', example: 'Masoud' },
          lastName: { type: 'string', example: 'Mohammadi' },
          fatherName: { type: 'string', example: 'Ali' },
          gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'MALE' },
          birthDate: { type: 'string', format: 'date', example: '1990-05-21' },
          membershipTypeId: { type: 'string', example: '67093bc2f9821a0012345671' },
          specializationId: { type: 'string', example: '67093bc2f9821a0012345672' },
          rankId: { type: 'string', example: '67093bc2f9821a0012345673' },
          latestAcademicQualifications: { type: 'string', example: '67093bc2f9821a0012345674' },
          natureOfMembership: { type: 'string', example: '67093bc2f9821a0012345675' },
          companyInformation: { type: 'string', example: '67093bc2f9821a0012345676' },
        },
      },
      UpdateMemberInput: {
        type: 'object',
        properties: {
          memberType: { type: 'string', enum: ['INDIVIDUAL', 'LEGAL', 'STORE'] },
          firstName: { type: 'string', example: 'Masoud' },
          lastName: { type: 'string', example: 'Mohammadi' },
          fatherName: { type: 'string', example: 'Ali' },
          gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'] },
          status: { type: 'string', enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'REJECTED'] },
          specializationId: { type: 'string' },
          rankId: { type: 'string' },
          latestAcademicQualifications: { type: 'string' },
          natureOfMembership: { type: 'string' },
          companyInformation: { type: 'string' },
          expiryDate: { type: 'string', format: 'date-time' },
          notes: { type: 'string' },
        },
      },
      MemberAddress: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          membershipId: { type: 'string', description: 'Foreign reference to Member ID' },
          addressType: {
            type: 'string',
            enum: ['WORK', 'HOME', 'CENTRAL_OFFICE', 'BRANCH', 'OTHER'],
            example: 'WORK',
          },
          province: { type: 'string', example: 'Tehran' },
          city: { type: 'string', example: 'Tehran' },
          postalCode: { type: 'string', example: '1417755331' },
          address: { type: 'string', example: 'Motahari St, No 12, Unit 4' },
          isPrimary: { type: 'boolean', example: true },
        },
      },
      MemberTelephone: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          membershipId: { type: 'string', description: 'Foreign reference to Member ID' },
          phoneType: {
            type: 'string',
            enum: ['MOBILE', 'LANDLINE', 'FAX', 'SUPPORT', 'OTHER'],
            example: 'MOBILE',
          },
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
          title: { type: 'string', example: 'Individual Member' },
          code: { type: 'string', example: 'INDIVIDUAL' },
          isActive: { type: 'boolean', default: true },
        },
      },
      Specialization: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'Software and Information Systems' },
          code: { type: 'string', example: 'SOFTWARE' },
          isActive: { type: 'boolean', default: true },
        },
      },
      Rank: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'Grade 1' },
          level: { type: 'number', example: 1 },
          isActive: { type: 'boolean', default: true },
        },
      },
      AcademicField: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'Computer Science and Engineering' },
          isActive: { type: 'boolean', default: true },
        },
      },
      AcademicQualification: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'Master of Science in Software Engineering' },
          academicField: { type: 'string', description: 'Foreign key to AcademicField' },
          degreeLevel: { type: 'string', example: 'MASTER' },
          institution: { type: 'string', example: 'University of Tehran' },
        },
      },
      NatureOfMembership: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'Continuous' },
          code: { type: 'string', example: 'CONTINUOUS' },
        },
      },
      CompanyInformation: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'Nasr Data Solutions Co.' },
          nationalId: { type: 'string', example: '10101234567' },
          registrationNumber: { type: 'string', example: '456789' },
          ceoName: { type: 'string', example: 'Ali Rezaei' },
        },
      },
      ApiResponseMemberList: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Members retrieved successfully' },
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
          message: { type: 'string', example: 'Member details retrieved successfully' },
          data: { $ref: '#/components/schemas/Member' },
        },
      },
      ApiErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation Error: Invalid input parameters' },
          details: { type: 'object' },
        },
      },
    },
  },
};
