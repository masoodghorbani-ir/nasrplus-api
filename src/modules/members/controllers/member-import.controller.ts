import { Request, Response, NextFunction } from 'express';
import { MemberImportService } from '../services/member-import.service';
import { ApiResponse } from '../../../common/utils/api-response';
import { ApiError } from '../../../common/utils/api-error';
import { IImportConfirmDto } from '../interfaces/member-import.interface';

export class MemberImportController {
  private memberImportService: MemberImportService;

  constructor() {
    this.memberImportService = new MemberImportService();
  }

  // Previews uploaded Excel file sheets and columns
  preview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw ApiError.badRequest('Please upload an Excel file (.xlsx, .xls) or CSV file');
      }

      const previewData = await this.memberImportService.preview(req.file);
      res.status(200).json(
        ApiResponse.success(previewData, 'Excel file uploaded and analyzed successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  // Validates member import rows and rules before confirmation
  validate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: IImportConfirmDto = req.body;
      const result = await this.memberImportService.validate(dto);

      res.status(200).json(
        ApiResponse.success(result, 'Members import validation completed successfully')
      );
    } catch (error) {
      next(error);
    }
  };

  // Executes member import with user confirmed mapping and fixed values
  confirm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: IImportConfirmDto = req.body;
      const result = await this.memberImportService.confirm(dto);

      res.status(200).json(
        ApiResponse.success(result, 'Members import completed successfully')
      );
    } catch (error) {
      next(error);
    }
  };
}
