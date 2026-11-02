import { IAdminDocument } from '../modules/admin/interfaces/admin.interface';
import { IMemberDocument } from '../modules/members/interfaces/member.interface';

declare global {
  namespace Express {
    interface Request {
      admin?: IAdminDocument;
      member?: IMemberDocument;
    }
  }
}
