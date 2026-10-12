import { envConfig } from './env.config';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'NasrPlus - Computer Trade Guild Member Management API',
    version: '1.0.0',
    description:
      'Complete OpenAPI 3.0 specification for NasrPlus API (Iranian Computer Trade Guild Organization). Includes endpoints for members, company profiles, addresses, contact telephones, and all guild classification lookups.',
    contact: {
      name: 'Technical Support & Architecture Team',
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
    { name: 'Members', description: 'Core guild member registration, lifecycle, query, and profile management' },
    { name: 'Member Addresses', description: 'Postal address management for individual and corporate members' },
    { name: 'Member Telephones', description: 'Contact phone numbers, mobile, and telecommunication lines' },
    { name: 'Companies', description: 'Corporate entity profiles and organizational affiliations' },
    { name: 'Lookups - Membership Types', description: 'Classifications: Individual, Legal Entity, Store, Honorary' },
    { name: 'Lookups - Specializations', description: 'Guild technical branches (Software, Hardware, Network, etc.)' },
    { name: 'Lookups - Ranks', description: 'Guild professional grades and qualification levels (Grade 1 to 3)' },
    { name: 'Lookups - Nature of Memberships', description: 'Membership legal nature (Continuous, Associate, etc.)' },
    { name: 'Lookups - Academic Fields', description: 'Higher education university fields' },
    { name: 'Lookups - Academic Qualifications', description: 'Degrees and educational qualifications' },
    { name: 'Auth', description: 'Authentication and identity management' },
    { name: 'Admins', description: 'Administrative accounts and permissions (Superadmin)' },
    { name: 'System', description: 'Service health check and runtime status' },
  ],
  paths: {
    // -------------------------------------------------------------
    // AUTHENTICATION ROUTES
    // -------------------------------------------------------------
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Admin login',
        description: 'Authenticates an admin or superadmin using credentials and returns a JWT token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string', example: 'superadmin@nasrplus.ir' },
                  password: { type: 'string', example: 'superadmin@12345678' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid username or password' },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Current admin profile',
        description: 'Returns profile details and permissions for the authenticated admin.',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Profile retrieved' },
          401: { description: 'Authentication required' },
        },
      },
    },

    // -------------------------------------------------------------
    // ADMIN MANAGEMENT ROUTES (SUPERADMIN ONLY)
    // -------------------------------------------------------------
    '/api/v1/admins': {
      get: {
        tags: ['Admins'],
        summary: 'List admin accounts',
        description: 'Requires Superadmin privileges. Returns all admin accounts.',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Admins retrieved successfully' },
          403: { description: 'Superadmin privileges required' },
        },
      },
      post: {
        tags: ['Admins'],
        summary: 'Create admin account',
        description: 'Requires Superadmin privileges. Type SUPERADMIN cannot be created more than once.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string', example: 'admin@nasrplus.ir' },
                  password: { type: 'string', example: 'AdminPass@123' },
                  type: { type: 'string', enum: ['ADMIN', 'SUPERADMIN'], default: 'ADMIN' },
                  fullName: { type: 'string', example: 'Admin User' },
                  isActive: { type: 'boolean', default: true },
                  permissions: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Admin created successfully' },
          400: { description: 'Validation error or SUPERADMIN duplicate attempt' },
          409: { description: 'Username already exists' },
        },
      },
    },
    '/api/v1/admins/permissions': {
      get: {
        tags: ['Admins'],
        summary: 'List system permissions',
        description: 'Returns all permission keys available in the Permissions table.',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Permissions retrieved' },
        },
      },
      post: {
        tags: ['Admins'],
        summary: 'Create permission',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'key'],
                properties: {
                  name: { type: 'string', example: 'ویرایش اعضا' },
                  key: { type: 'string', example: 'members:update' },
                  module: { type: 'string', example: 'members' },
                  description: { type: 'string', example: 'اجازه ویرایش اعضا' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Permission created' },
        },
      },
    },

    // -------------------------------------------------------------
    // SYSTEM ROUTES
    // -------------------------------------------------------------
    '/api/v1/health': {
      get: {
        tags: ['System'],
        summary: 'Service health check',
        description: 'Returns the current server status, service identifier, and UTC timestamp.',
        responses: {
          200: {
            description: 'Service is operational',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    service: { type: 'string', example: 'NasrPlus Members Management API' },
                    swaggerDocs: { type: 'string', example: '/api-docs' },
                    timestamp: { type: 'string', example: '2026-10-11T17:00:00.000Z' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // -------------------------------------------------------------
    // MEMBER ROUTES
    // -------------------------------------------------------------
    '/api/v1/members': {
      get: {
        tags: ['Members'],
        summary: 'Get paginated list of members with filters',
        description: 'Retrieves members with optional keyword search and filtering by status, membership type, specialization, or rank.',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Items per page' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search keyword (code, national ID, name, email)' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'REJECTED'] } },
          { name: 'membershipTypeId', in: 'query', schema: { type: 'string' }, description: 'Filter by MembershipType ID' },
          { name: 'specializationId', in: 'query', schema: { type: 'string' }, description: 'Filter by Specialization ID' },
          { name: 'rankId', in: 'query', schema: { type: 'string' }, description: 'Filter by Rank ID' },
        ],
        responses: {
          200: {
            description: 'Members list retrieved successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseMemberList' } } },
          },
        },
      },
      post: {
        tags: ['Members'],
        summary: 'Register a new guild member',
        description: 'Creates a member profile with foreign key relations to classifications and identity data.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateMemberInput' } } },
        },
        responses: {
          201: {
            description: 'Member created successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseMemberSingle' } } },
          },
          400: { description: 'Validation error: Invalid input data' },
          409: { description: 'Duplicate member code or national code' },
        },
      },
    },
    '/api/v1/members/{id}': {
      get: {
        tags: ['Members'],
        summary: 'Get member details by ID',
        description: 'Fetches detailed profile including populated classifications, addresses, and telephones.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Member ObjectId' },
        ],
        responses: {
          200: {
            description: 'Member retrieved successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseMemberSingle' } } },
          },
          404: { description: 'Member not found' },
        },
      },
      put: {
        tags: ['Members'],
        summary: 'Update member profile by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Member ObjectId' },
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateMemberInput' } } },
        },
        responses: {
          200: {
            description: 'Member updated successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseMemberSingle' } } },
          },
          404: { description: 'Member not found' },
        },
      },
      delete: {
        tags: ['Members'],
        summary: 'Delete member by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Member ObjectId' },
        ],
        responses: {
          200: {
            description: 'Member deleted successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseMemberSingle' } } },
          },
          404: { description: 'Member not found' },
        },
      },
    },

    // -------------------------------------------------------------
    // MEMBER ADDRESS SUB-ROUTES
    // -------------------------------------------------------------
    '/api/v1/members/{id}/addresses': {
      get: {
        tags: ['Member Addresses'],
        summary: 'Get all addresses for a member',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Member ID' },
        ],
        responses: {
          200: {
            description: 'Addresses retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/MemberAddress' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Member Addresses'],
        summary: 'Add an address for a member',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Member ID' },
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateAddressInput' } } },
        },
        responses: {
          201: {
            description: 'Address added successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/MemberAddress' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/members/{id}/addresses/{addressId}': {
      put: {
        tags: ['Member Addresses'],
        summary: 'Update a member address',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Member ID' },
          { name: 'addressId', in: 'path', required: true, schema: { type: 'string' }, description: 'Address ID' },
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateAddressInput' } } },
        },
        responses: {
          200: { description: 'Address updated successfully' },
          404: { description: 'Address not found' },
        },
      },
      delete: {
        tags: ['Member Addresses'],
        summary: 'Delete a member address',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Member ID' },
          { name: 'addressId', in: 'path', required: true, schema: { type: 'string' }, description: 'Address ID' },
        ],
        responses: {
          200: { description: 'Address deleted successfully' },
          404: { description: 'Address not found' },
        },
      },
    },

    // -------------------------------------------------------------
    // MEMBER TELEPHONE SUB-ROUTES
    // -------------------------------------------------------------
    '/api/v1/members/{id}/telephones': {
      get: {
        tags: ['Member Telephones'],
        summary: 'Get all telephone numbers for a member',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Member ID' },
        ],
        responses: {
          200: {
            description: 'Telephones retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/MemberTelephone' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Member Telephones'],
        summary: 'Add a telephone number for a member',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Member ID' },
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTelephoneInput' } } },
        },
        responses: {
          201: {
            description: 'Telephone added successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/MemberTelephone' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/members/{id}/telephones/{telephoneId}': {
      put: {
        tags: ['Member Telephones'],
        summary: 'Update a member telephone number',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Member ID' },
          { name: 'telephoneId', in: 'path', required: true, schema: { type: 'string' }, description: 'Telephone ID' },
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTelephoneInput' } } },
        },
        responses: {
          200: { description: 'Telephone updated successfully' },
          404: { description: 'Telephone not found' },
        },
      },
      delete: {
        tags: ['Member Telephones'],
        summary: 'Delete a member telephone number',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Member ID' },
          { name: 'telephoneId', in: 'path', required: true, schema: { type: 'string' }, description: 'Telephone ID' },
        ],
        responses: {
          200: { description: 'Telephone deleted successfully' },
          404: { description: 'Telephone not found' },
        },
      },
    },

    // -------------------------------------------------------------
    // COMPANIES ROUTES
    // -------------------------------------------------------------
    '/api/v1/companies': {
      get: {
        tags: ['Companies'],
        summary: 'Get list of registered companies',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by title, national ID, or reg number' },
        ],
        responses: {
          200: { description: 'Companies retrieved successfully' },
        },
      },
      post: {
        tags: ['Companies'],
        summary: 'Register a company profile',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CompanyInformation' } } },
        },
        responses: {
          201: { description: 'Company registered successfully' },
        },
      },
    },
    '/api/v1/companies/{id}': {
      get: {
        tags: ['Companies'],
        summary: 'Get company by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Company details retrieved' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Companies'],
        summary: 'Update company profile',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CompanyInformation' } } },
        },
        responses: { 200: { description: 'Company updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Companies'],
        summary: 'Delete company profile',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Company deleted' }, 404: { description: 'Not found' } },
      },
    },

    // -------------------------------------------------------------
    // LOOKUPS: MEMBERSHIP TYPES
    // -------------------------------------------------------------
    '/api/v1/lookups/membership-types': {
      get: {
        tags: ['Lookups - Membership Types'],
        summary: 'Get all membership types',
        responses: { 200: { description: 'List of membership types' } },
      },
      post: {
        tags: ['Lookups - Membership Types'],
        summary: 'Create a membership type',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Individual Member' },
                  code: { type: 'string', example: 'INDIVIDUAL' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/api/v1/lookups/membership-types/{id}': {
      get: {
        tags: ['Lookups - Membership Types'],
        summary: 'Get membership type by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Retrieved' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Lookups - Membership Types'],
        summary: 'Update membership type',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Lookups - Membership Types'],
        summary: 'Delete membership type',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
      },
    },

    // -------------------------------------------------------------
    // LOOKUPS: SPECIALIZATIONS
    // -------------------------------------------------------------
    '/api/v1/lookups/specializations': {
      get: {
        tags: ['Lookups - Specializations'],
        summary: 'Get all specializations',
        responses: { 200: { description: 'List of specializations' } },
      },
      post: {
        tags: ['Lookups - Specializations'],
        summary: 'Create a specialization',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Software and Information Systems' },
                  code: { type: 'string', example: 'SOFTWARE' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/api/v1/lookups/specializations/{id}': {
      get: {
        tags: ['Lookups - Specializations'],
        summary: 'Get specialization by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Retrieved' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Lookups - Specializations'],
        summary: 'Update specialization',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Lookups - Specializations'],
        summary: 'Delete specialization',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
      },
    },

    // -------------------------------------------------------------
    // LOOKUPS: RANKS
    // -------------------------------------------------------------
    '/api/v1/lookups/ranks': {
      get: {
        tags: ['Lookups - Ranks'],
        summary: 'Get all guild ranks/grades',
        responses: { 200: { description: 'List of ranks' } },
      },
      post: {
        tags: ['Lookups - Ranks'],
        summary: 'Create a rank',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Grade 1 (Senior)' },
                  level: { type: 'integer', example: 1 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/api/v1/lookups/ranks/{id}': {
      get: {
        tags: ['Lookups - Ranks'],
        summary: 'Get rank by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Retrieved' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Lookups - Ranks'],
        summary: 'Update rank',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Lookups - Ranks'],
        summary: 'Delete rank',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
      },
    },

    // -------------------------------------------------------------
    // LOOKUPS: NATURE OF MEMBERSHIPS
    // -------------------------------------------------------------
    '/api/v1/lookups/nature-of-memberships': {
      get: {
        tags: ['Lookups - Nature of Memberships'],
        summary: 'Get all nature of memberships',
        responses: { 200: { description: 'List of nature of memberships' } },
      },
      post: {
        tags: ['Lookups - Nature of Memberships'],
        summary: 'Create nature of membership',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'key'],
                properties: {
                  title: { type: 'string', example: 'حقیقی' },
                  key: { type: 'string', enum: ['Real', 'Legal'], example: 'Real' },
                  description: { type: 'string', example: 'عضویت اشخاص حقیقی' },
                  isActive: { type: 'boolean', example: true },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/api/v1/lookups/nature-of-memberships/{id}': {
      get: {
        tags: ['Lookups - Nature of Memberships'],
        summary: 'Get nature of membership by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Retrieved' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Lookups - Nature of Memberships'],
        summary: 'Update nature of membership',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Lookups - Nature of Memberships'],
        summary: 'Delete nature of membership',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
      },
    },

    // -------------------------------------------------------------
    // LOOKUPS: ACADEMIC FIELDS
    // -------------------------------------------------------------
    '/api/v1/lookups/academic-fields': {
      get: {
        tags: ['Lookups - Academic Fields'],
        summary: 'Get all academic fields',
        responses: { 200: { description: 'List of academic fields' } },
      },
      post: {
        tags: ['Lookups - Academic Fields'],
        summary: 'Create academic field',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Computer Engineering' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/api/v1/lookups/academic-fields/{id}': {
      get: {
        tags: ['Lookups - Academic Fields'],
        summary: 'Get academic field by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Retrieved' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Lookups - Academic Fields'],
        summary: 'Update academic field',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Lookups - Academic Fields'],
        summary: 'Delete academic field',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
      },
    },

    // -------------------------------------------------------------
    // LOOKUPS: DEGREE LEVELS
    // -------------------------------------------------------------
    '/api/v1/lookups/degree-levels': {
      get: {
        tags: ['Lookups - Degree Levels'],
        summary: 'Get all degree levels',
        responses: { 200: { description: 'List of degree levels' } },
      },
      post: {
        tags: ['Lookups - Degree Levels'],
        summary: 'Create degree level',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'کارشناسی' },
                  description: { type: 'string', example: 'Bachelor Degree' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/api/v1/lookups/degree-levels/{id}': {
      get: {
        tags: ['Lookups - Degree Levels'],
        summary: 'Get degree level by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Retrieved' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Lookups - Degree Levels'],
        summary: 'Update degree level',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Lookups - Degree Levels'],
        summary: 'Delete degree level',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
      },
    },

    // -------------------------------------------------------------
    // LOOKUPS: ACADEMIC QUALIFICATIONS
    // -------------------------------------------------------------
    '/api/v1/lookups/academic-qualifications': {
      get: {
        tags: ['Lookups - Academic Qualifications'],
        summary: 'Get all academic qualifications',
        responses: { 200: { description: 'List of academic qualifications with populated academicField and degreeLevel' } },
      },
      post: {
        tags: ['Lookups - Academic Qualifications'],
        summary: 'Create an academic qualification',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'academicField', 'degreeLevel'],
                properties: {
                  title: { type: 'string', example: 'Master of Science in Software Engineering' },
                  academicField: { type: 'string', example: '67093bc2f9821a0012345674' },
                  degreeLevel: { type: 'string', description: 'Reference ID to DegreeLevel', example: '67093bc2f9821a0012345675' },
                  institution: { type: 'string', example: 'University of Tehran' },
                  graduationYear: { type: 'integer', example: 2020 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/api/v1/lookups/academic-qualifications/{id}': {
      get: {
        tags: ['Lookups - Academic Qualifications'],
        summary: 'Get academic qualification by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Retrieved' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Lookups - Academic Qualifications'],
        summary: 'Update academic qualification',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Lookups - Academic Qualifications'],
        summary: 'Delete academic qualification',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide JWT token in format: Bearer <token>',
      },
    },
    schemas: {
      Member: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '67093bc2f9821a0012345678' },
          memberCode: { type: 'string', description: 'Unique Guild Membership Code', example: '21010045' },
          nationalCode: { type: 'string', example: '0012345678' },
          firstName: { type: 'string', example: 'Masoud' },
          lastName: { type: 'string', example: 'Mohammadi' },
          fatherName: { type: 'string', example: 'Ali' },
          gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'MALE' },
          birthDate: { type: 'string', format: 'date', example: '1990-05-21' },
          status: { type: 'string', enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'REJECTED'], example: 'ACTIVE' },
          membershipTypeId: { type: 'string', description: 'Reference ID to MembershipType' },
          specializationId: { type: 'string', description: 'Reference ID to Specialization' },
          rankId: { type: 'string', description: 'Reference ID to Rank (Grade)' },
          latestAcademicQualifications: { type: 'string', description: 'Reference ID to AcademicQualification' },
          natureOfMembership: { type: 'string', description: 'Reference ID to NatureOfMembership' },
          companyInformation: { type: 'string', description: 'Reference ID to CompanyInformation' },
          membershipDate: { type: 'string', format: 'date-time' },
          expiryDate: { type: 'string', format: 'date-time' },
          addresses: { type: 'array', items: { $ref: '#/components/schemas/MemberAddress' } },
          telephones: { type: 'array', items: { $ref: '#/components/schemas/MemberTelephone' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateMemberInput: {
        type: 'object',
        required: ['memberCode', 'membershipTypeId', 'specializationId', 'natureOfMembership'],
        properties: {
          memberCode: { type: 'string', example: '21010045' },
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
            oneOf: [
              { type: 'string', description: 'Reference ID to AddressType' },
              { $ref: '#/components/schemas/AddressType' },
            ],
            example: '60d5ec49f1b2c8b1f8c8e1a1',
          },
          province: {
            oneOf: [
              { type: 'string', description: 'Reference ID to Province' },
              { $ref: '#/components/schemas/Province' },
            ],
            example: '60d5ec49f1b2c8b1f8c8e1a2',
          },
          city: {
            oneOf: [
              { type: 'string', description: 'Reference ID to City' },
              { $ref: '#/components/schemas/City' },
            ],
            example: '60d5ec49f1b2c8b1f8c8e1a3',
          },
          postalCode: { type: 'string', example: '1417755331' },
          address: { type: 'string', example: 'Motahari St, No 12, Unit 4' },
          isPrimary: { type: 'boolean', example: true },
        },
      },
      CreateAddressInput: {
        type: 'object',
        required: ['addressType', 'province', 'city', 'address'],
        properties: {
          addressType: { type: 'string', description: 'Reference ID of AddressType', example: '60d5ec49f1b2c8b1f8c8e1a1' },
          province: { type: 'string', description: 'Reference ID of Province', example: '60d5ec49f1b2c8b1f8c8e1a2' },
          city: { type: 'string', description: 'Reference ID of City', example: '60d5ec49f1b2c8b1f8c8e1a3' },
          postalCode: { type: 'string', example: '1417755331' },
          address: { type: 'string', example: 'Motahari St, No 12, Unit 4' },
          plaque: { type: 'string', example: '12' },
          isPrimary: { type: 'boolean', default: false },
        },
      },
      AddressType: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'محل کار' },
          code: { type: 'string', example: 'WORK' },
          description: { type: 'string', example: 'نشانی محل کار یا شرکت' },
          isActive: { type: 'boolean', example: true },
        },
      },
      Province: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'تهران' },
          code: { type: 'string', example: 'TEHRAN' },
          isActive: { type: 'boolean', example: true },
        },
      },
      City: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'تهران' },
          provinceId: { type: 'string', description: 'Reference ID to Province' },
          code: { type: 'string', example: 'TEHRAN' },
          isActive: { type: 'boolean', example: true },
        },
      },
      MemberTelephone: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          membershipId: { type: 'string', description: 'Foreign reference to Member ID' },
          phoneType: { type: 'string', enum: ['MOBILE', 'LANDLINE', 'FAX', 'SUPPORT', 'OTHER'], example: 'MOBILE' },
          phoneNumber: { type: 'string', example: '09121234567' },
          areaCode: { type: 'string', example: '021' },
          countryCode: { type: 'string', example: '+98' },
          extension: { type: 'string', example: '102' },
          title: { type: 'string', example: 'Direct Line' },
          isPrimary: { type: 'boolean', example: true },
        },
      },
      CreateTelephoneInput: {
        type: 'object',
        required: ['phoneNumber'],
        properties: {
          phoneType: { type: 'string', enum: ['MOBILE', 'LANDLINE', 'FAX', 'SUPPORT', 'OTHER'], default: 'MOBILE' },
          phoneNumber: { type: 'string', example: '09121234567' },
          areaCode: { type: 'string', example: '021' },
          countryCode: { type: 'string', default: '+98' },
          extension: { type: 'string', example: '102' },
          title: { type: 'string', example: 'Direct Line' },
          isPrimary: { type: 'boolean', default: false },
        },
      },
      CompanyInformation: {
        type: 'object',
        required: ['title'],
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'Nasr Data Solutions Co.' },
          companyType: { type: 'string', enum: ['PRIVATE_JOINT_STOCK', 'PUBLIC_JOINT_STOCK', 'LIMITED_LIABILITY', 'COOPERATIVE', 'KNOWLEDGE_BASED', 'STARTUP', 'OTHER'], example: 'KNOWLEDGE_BASED' },
          nationalId: { type: 'string', example: '10101234567' },
          registrationNumber: { type: 'string', example: '456789' },
          economicCode: { type: 'string', example: '411234567890' },
          ceoName: { type: 'string', example: 'Ali Rezaei' },
          website: { type: 'string', example: 'https://nasrplus.ir' },
          email: { type: 'string', example: 'info@nasrplus.ir' },
          description: { type: 'string', example: 'Enterprise cloud software provider' },
        },
      },
      ApiResponseMemberList: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Members retrieved successfully' },
          data: { type: 'array', items: { $ref: '#/components/schemas/Member' } },
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
    },
  },
};
