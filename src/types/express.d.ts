import { IAdminDocument } from '../modules/admin/interfaces/admin.interface';

declare global {
  namespace Express {
    interface Request {
      admin?: IAdminDocument;
    }
  }
}
