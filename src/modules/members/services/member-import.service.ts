import path from 'path';
import fs from 'fs';
import { Types } from 'mongoose';
import * as XLSX from 'xlsx';
import { ApiError } from '../../../common/utils/api-error';
import { Member, MemberTelephone } from '../models';
import { NatureOfMembership, MembershipType, Specialization } from '../../lookup/models';
import {
  IImportConfirmDto,
  IImportExecutionResult,
  IImportPreviewResult,
  IImportRowError,
  IImportedMemberSummary,
} from '../interfaces/member-import.interface';
import {
  columnLetterToIndex,
  normalizeMemberCode,
  normalizeMobilePhone,
  normalizeNationalCode,
  parseDateValue,
  parseWorkbookForPreview,
} from '../utils/excel-parser.util';

export class MemberImportService {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(process.cwd(), 'uploads', 'temp');
  }

  // Parses uploaded Excel file for preview
  async preview(file: Express.Multer.File): Promise<IImportPreviewResult> {
    if (!file || !file.path) {
      throw ApiError.badRequest('No file uploaded or file path is missing');
    }

    const fileId = path.basename(file.filename, path.extname(file.filename));

    try {
      const workbook = XLSX.readFile(file.path, { cellDates: true });
      return parseWorkbookForPreview(workbook, fileId, file.originalname);
    } catch (error) {
      // Remove invalid uploaded file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw ApiError.badRequest(
        `Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Executes import based on user-confirmed mapping and fixed data
  async confirm(dto: IImportConfirmDto): Promise<IImportExecutionResult> {
    if (!dto.fileId) {
      throw ApiError.badRequest('File ID is required');
    }
    if (!dto.fixedData) {
      throw ApiError.badRequest('Fixed import data is required');
    }
    if (!dto.columnMapping) {
      throw ApiError.badRequest('Column mapping configuration is required');
    }

    // Locate uploaded file
    const filePath = this.findTempFile(dto.fileId);
    if (!filePath) {
      throw ApiError.notFound('Uploaded file session expired or not found. Please upload again.');
    }

    // Resolve fixed reference IDs
    const { natureId, typeId, specializationId, status } = await this.resolveFixedReferences(dto.fixedData);

    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.readFile(filePath, { cellDates: true });
    } catch (err) {
      throw ApiError.badRequest(
        `Failed to read spreadsheet file: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }

    const sheetName = dto.sheetName || workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    if (!sheet || !sheet['!ref']) {
      throw ApiError.badRequest(`Worksheet '${sheetName}' does not exist or is empty`);
    }

    const range = XLSX.utils.decode_range(sheet['!ref']);
    const startRow = dto.startRow && dto.startRow >= 1 ? dto.startRow : 2;

    const failedRows: IImportRowError[] = [];
    const importedMembers: IImportedMemberSummary[] = [];

    // Track duplicates within current batch
    const seenMemberCodes = new Set<string>();
    const seenNationalCodes = new Set<string>();

    let totalProcessed = 0;

    // Resolve column indices from mapping
    const colIndices = {
      firstName: this.getColIndex(dto.columnMapping.firstName),
      lastName: this.getColIndex(dto.columnMapping.lastName),
      nationalCode: this.getColIndex(dto.columnMapping.nationalCode),
      memberCode: this.getColIndex(dto.columnMapping.memberCode),
      membershipDate: this.getColIndex(dto.columnMapping.membershipDate),
      expiryDate: this.getColIndex(dto.columnMapping.expiryDate),
      mobilePhone: this.getColIndex(dto.columnMapping.mobilePhone),
      email: this.getColIndex(dto.columnMapping.email),
    };

    // Iterate through sheet rows
    for (let r = startRow - 1; r <= range.e.r; r++) {
      const rowNum = r + 1;

      // Extract raw cell values
      const rawMemberCode = this.getCellValue(sheet, r, colIndices.memberCode);
      const rawNationalCode = this.getCellValue(sheet, r, colIndices.nationalCode);
      const rawFirstName = this.getCellValue(sheet, r, colIndices.firstName);
      const rawLastName = this.getCellValue(sheet, r, colIndices.lastName);
      const rawMembershipDate = this.getCellValue(sheet, r, colIndices.membershipDate);
      const rawExpiryDate = this.getCellValue(sheet, r, colIndices.expiryDate);
      const rawMobile = this.getCellValue(sheet, r, colIndices.mobilePhone);
      const rawEmail = this.getCellValue(sheet, r, colIndices.email);

      // Skip completely empty rows
      if (
        !rawMemberCode &&
        !rawNationalCode &&
        !rawFirstName &&
        !rawLastName &&
        !rawMobile &&
        !rawEmail
      ) {
        continue;
      }

      totalProcessed++;

      const memberCode = normalizeMemberCode(rawMemberCode);
      const nationalCode = normalizeNationalCode(rawNationalCode);
      const firstName = rawFirstName ? String(rawFirstName).trim() : '';
      const lastName = rawLastName ? String(rawLastName).trim() : '';
      const email = rawEmail ? String(rawEmail).trim().toLowerCase() : '';
      const mobilePhone = normalizeMobilePhone(rawMobile);
      const fullName = `${firstName} ${lastName}`.trim();

      // Validate required memberCode
      if (!memberCode) {
        failedRows.push({
          rowNumber: rowNum,
          fullName,
          reason: 'کد عضویت در این ردیف الزامی است ولی وارد نشده است',
        });
        continue;
      }

      // Check memberCode duplicate in current file batch
      if (seenMemberCodes.has(memberCode)) {
        failedRows.push({
          rowNumber: rowNum,
          memberCode,
          nationalCode,
          fullName,
          reason: `کد عضویت '${memberCode}' در همین فایل تکرار شده است`,
        });
        continue;
      }

      // Check memberCode duplicate in database
      const existingMemberCode = await Member.exists({ memberCode });
      if (existingMemberCode) {
        failedRows.push({
          rowNumber: rowNum,
          memberCode,
          nationalCode,
          fullName,
          reason: `کد عضویت '${memberCode}' قبلاً در سامانه ثبت شده است`,
        });
        continue;
      }

      // Validate and check nationalCode duplicates if provided
      if (nationalCode) {
        if (!/^[0-9]{10}$/.test(nationalCode)) {
          failedRows.push({
            rowNumber: rowNum,
            memberCode,
            nationalCode,
            fullName,
            reason: `کد ملی '${nationalCode}' نامعتبر است (باید ۱۰ رقم عددی باشد)`,
          });
          continue;
        }

        if (seenNationalCodes.has(nationalCode)) {
          failedRows.push({
            rowNumber: rowNum,
            memberCode,
            nationalCode,
            fullName,
            reason: `کد ملی '${nationalCode}' در همین فایل تکرار شده است`,
          });
          continue;
        }

        const existingNational = await Member.exists({ nationalCode });
        if (existingNational) {
          failedRows.push({
            rowNumber: rowNum,
            memberCode,
            nationalCode,
            fullName,
            reason: `کد ملی '${nationalCode}' قبلاً در سامانه برای عضو دیگری ثبت شده است`,
          });
          continue;
        }
      }

      // Parse dates
      const membershipDate = parseDateValue(rawMembershipDate) || new Date();
      const expiryDate = parseDateValue(rawExpiryDate) || undefined;

      try {
        // Create Member document
        const createdMember = await Member.create({
          natureOfMembership: natureId,
          membershipTypeId: typeId,
          specializationId: specializationId || null,
          status: status || 'ACTIVE',
          memberCode,
          nationalCode: nationalCode || undefined,
          firstName,
          lastName,
          email,
          membershipDate,
          expiryDate,
        });

        // Create MemberTelephone record if mobile phone is present
        if (mobilePhone) {
          await MemberTelephone.create({
            membershipId: createdMember._id,
            phoneType: 'MOBILE',
            phoneNumber: mobilePhone,
            isPrimary: true,
          });
        }

        seenMemberCodes.add(memberCode);
        if (nationalCode) {
          seenNationalCodes.add(nationalCode);
        }

        importedMembers.push({
          id: createdMember._id.toString(),
          memberCode,
          fullName: createdMember.fullName || `${firstName} ${lastName}`.trim(),
        });
      } catch (saveError) {
        failedRows.push({
          rowNumber: rowNum,
          memberCode,
          nationalCode,
          fullName,
          reason: `خطا در ذخیره‌سازی رکورد: ${saveError instanceof Error ? saveError.message : 'خطای ناشناخته'}`,
        });
      }
    }

    // Clean up temporary spreadsheet file
    this.safeDeleteTempFile(filePath);

    return {
      summary: {
        totalRows: totalProcessed,
        processedCount: totalProcessed,
        importedCount: importedMembers.length,
        skippedCount: failedRows.length,
      },
      failedRows,
      importedMembers,
    };
  }

  // Resolves fixed lookup references (by ObjectId or key/title/code)
  private async resolveFixedReferences(fixedData: {
    natureOfMembership: string;
    membershipTypeId: string;
    specializationId?: string;
    status?: string;
  }) {
    // 1. Nature of Membership
    let natureId: Types.ObjectId | null = null;
    if (Types.ObjectId.isValid(fixedData.natureOfMembership)) {
      const found = await NatureOfMembership.findById(fixedData.natureOfMembership);
      if (found) natureId = found._id;
    }
    if (!natureId) {
      const found = await NatureOfMembership.findOne({
        $or: [
          { key: fixedData.natureOfMembership.toUpperCase() },
          { title: fixedData.natureOfMembership },
        ],
      });
      if (found) natureId = found._id;
    }
    if (!natureId) {
      throw ApiError.badRequest(
        `ماهیت عضویت '${fixedData.natureOfMembership}' معتبر نیست یا در سامانه یافت نشد`
      );
    }

    // 2. Membership Type
    let typeId: Types.ObjectId | null = null;
    if (Types.ObjectId.isValid(fixedData.membershipTypeId)) {
      const found = await MembershipType.findById(fixedData.membershipTypeId);
      if (found) typeId = found._id;
    }
    if (!typeId) {
      const found = await MembershipType.findOne({
        $or: [
          { code: fixedData.membershipTypeId.toUpperCase() },
          { title: fixedData.membershipTypeId },
        ],
      });
      if (found) typeId = found._id;
    }
    if (!typeId) {
      throw ApiError.badRequest(
        `نوع عضویت '${fixedData.membershipTypeId}' معتبر نیست یا در سامانه یافت نشد`
      );
    }

    // 3. Specialization (Optional)
    let specializationId: Types.ObjectId | null = null;
    if (fixedData.specializationId) {
      if (Types.ObjectId.isValid(fixedData.specializationId)) {
        const found = await Specialization.findById(fixedData.specializationId);
        if (found) specializationId = found._id;
      }
      if (!specializationId) {
        const found = await Specialization.findOne({
          $or: [
            { code: fixedData.specializationId.toUpperCase() },
            { title: fixedData.specializationId },
          ],
        });
        if (found) specializationId = found._id;
      }
      if (!specializationId) {
        throw ApiError.badRequest(
          `رشته تخصصی '${fixedData.specializationId}' در سامانه یافت نشد`
        );
      }
    }

    // 4. Status validation
    const allowedStatuses = ['PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'REJECTED'];
    const status = (fixedData.status?.toUpperCase() || 'ACTIVE') as
      | 'PENDING'
      | 'ACTIVE'
      | 'SUSPENDED'
      | 'EXPIRED'
      | 'REJECTED';
    if (!allowedStatuses.includes(status)) {
      throw ApiError.badRequest(`وضعیت عضویت '${fixedData.status}' معتبر نیست`);
    }

    return { natureId, typeId, specializationId, status };
  }

  // Locates temporary file by ID prefix
  private findTempFile(fileId: string): string | null {
    if (!fs.existsSync(this.tempDir)) return null;
    const files = fs.readdirSync(this.tempDir);
    const match = files.find((f) => f.startsWith(fileId));
    return match ? path.join(this.tempDir, match) : null;
  }

  // Deletes temporary file safely
  private safeDeleteTempFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // Ignore cleanup error
    }
  }

  // Converts column key/letter to 0-based column index
  private getColIndex(colVal?: string | number): number {
    if (colVal === undefined || colVal === null || colVal === '') return -1;
    return columnLetterToIndex(colVal);
  }

  // Extracts cell value at row and column index
  private getCellValue(sheet: XLSX.WorkSheet, row: number, colIndex: number): unknown {
    if (colIndex < 0) return undefined;
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex });
    const cell = sheet[cellAddress];
    return cell !== undefined && cell !== null ? cell.v : undefined;
  }
}
