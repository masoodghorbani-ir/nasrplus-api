import { Request, Response, NextFunction, RequestHandler } from 'express';
import { JwtUtil } from '../utils/jwt.util';
import { ApiError } from '../utils/api-error';
import { Admin } from '../../modules/admin/models/admin.model';
import { AdminType, IAdminDocument } from '../../modules/admin/interfaces/admin.interface';
import { IPermission } from '../../modules/admin/interfaces/permission.interface';

export type RouteAccessType = 'public' | 'private' | 'superadmin' | 'authenticated';

export interface RouteAccessOptions {
  access: RouteAccessType;
  key?: string;
}

/** Extract Bearer token from authorization header */
const extractBearerToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
};

/** Authenticate request and attach admin document */
const resolveAdmin = async (req: Request): Promise<IAdminDocument | null> => {
  const token = extractBearerToken(req);
  if (!token) return null;

  try {
    const payload = JwtUtil.verify(token);
    const admin = await Admin.findById(payload.id).populate<{ permissions: IPermission[] }>(
      'permissions'
    );
    if (!admin || !admin.isActive) return null;
    return admin;
  } catch {
    return null;
  }
};

/**
 * Route access control middleware
 * Supports 'public', 'private' (requires permission key), and 'superadmin' access
 */
export function accessControl(
  accessOrOptions: RouteAccessType | RouteAccessOptions,
  permissionKey?: string
): RequestHandler {
  const options: RouteAccessOptions =
    typeof accessOrOptions === 'string'
      ? { access: accessOrOptions, key: permissionKey }
      : accessOrOptions;

  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. Public route handling
      if (options.access === 'public') {
        const admin = await resolveAdmin(req);
        if (admin) {
          req.admin = admin;
        }
        return next();
      }

      // Check Bearer token presence for secured routes
      const token = extractBearerToken(req);
      if (!token) {
        throw ApiError.unauthorized('Authentication token is required');
      }

      // Verify token
      let payload;
      try {
        payload = JwtUtil.verify(token);
      } catch {
        throw ApiError.unauthorized('Invalid or expired authentication token');
      }

      // Fetch admin with permissions populated
      const admin = await Admin.findById(payload.id).populate<{ permissions: IPermission[] }>(
        'permissions'
      );

      if (!admin) {
        throw ApiError.unauthorized('Admin account not found');
      }

      if (!admin.isActive) {
        throw ApiError.forbidden('Admin account is inactive');
      }

      req.admin = admin;

      // 2. Authenticated route handling (any valid active admin)
      if (options.access === 'authenticated') {
        return next();
      }

      // 3. Superadmin-only route handling
      if (options.access === 'superadmin') {
        if (admin.type !== AdminType.SUPERADMIN) {
          throw ApiError.forbidden('Access denied: Superadmin privileges required');
        }
        return next();
      }

      // 4. Private route handling
      if (options.access === 'private') {
        // SUPERADMIN possesses full access to all private routes
        if (admin.type === AdminType.SUPERADMIN) {
          return next();
        }

        const requiredKey = options.key?.trim().toLowerCase();
        if (!requiredKey) {
          throw ApiError.internal('Private route missing required permission key');
        }

        // Check if admin has the permission key assigned
        const hasPermission = (admin.permissions as IPermission[]).some(
          (perm) => perm && perm.key && perm.key.toLowerCase() === requiredKey
        );

        if (!hasPermission) {
          throw ApiError.forbidden(
            `Access denied: You do not have the required permission (${options.key})`
          );
        }

        return next();
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
}

/** Convenience middleware for public routes */
export const publicRoute = (): RequestHandler => accessControl('public');

/** Convenience middleware for authenticated routes (any valid admin) */
export const authenticate = (): RequestHandler => accessControl('authenticated');

/** Convenience middleware for private routes requiring a permission key */
export const privateRoute = (key: string): RequestHandler =>
  accessControl('private', key);

/** Convenience middleware for superadmin-only routes */
export const superadminRoute = (): RequestHandler => accessControl('superadmin');
