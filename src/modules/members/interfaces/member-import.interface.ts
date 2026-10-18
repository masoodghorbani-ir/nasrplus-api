import { MemberStatus } from './member.interface';

// Mapping between Member model fields and Excel column keys/indices
export interface IExcelColumnMapping {
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  memberCode?: string;
  membershipDate?: string;
  expiryDate?: string;
  mobilePhone?: string;
  email?: string;
}

// Fixed values applied across all rows of the uploaded file
export interface IFixedImportData {
  natureOfMembership: string;
  membershipTypeId: string;
  specializationId?: string;
  status?: MemberStatus;
}

// Column descriptor returned in preview
export interface IExcelColumnInfo {
  key: string;
  index: number;
  headerSample?: string;
}

// Result of Excel file preview
export interface IImportPreviewResult {
  fileId: string;
  originalFilename: string;
  sheets: string[];
  selectedSheet: string;
  totalRows: number;
  columns: IExcelColumnInfo[];
  previewRows: Array<Record<string, unknown>>;
  suggestedMapping: IExcelColumnMapping;
}

// DTO for confirming and executing import
export interface IImportConfirmDto {
  fileId: string;
  sheetName?: string;
  startRow?: number;
  fixedData: IFixedImportData;
  columnMapping: IExcelColumnMapping;
}

// Import error detail per row
export interface IImportRowError {
  rowNumber: number;
  memberCode?: string;
  nationalCode?: string;
  fullName?: string;
  reason: string;
}

// Successfully imported member record summary
export interface IImportedMemberSummary {
  id: string;
  memberCode: string;
  fullName: string;
}

// Final result of import execution
export interface IImportExecutionResult {
  summary: {
    totalRows: number;
    processedCount: number;
    importedCount: number;
    skippedCount: number;
  };
  failedRows: IImportRowError[];
  importedMembers: IImportedMemberSummary[];
}

// Individual row preview & validation item for Step 3
export interface IImportValidateRow {
  rowNumber: number;
  isValid: boolean;
  memberCode?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  mobilePhone?: string;
  email?: string;
  membershipDate?: string;
  expiryDate?: string;
  errors: string[];
}

// Result of Excel validation step
export interface IImportValidationResult {
  summary: {
    totalRows: number;
    validCount: number;
    errorCount: number;
  };
  rows: IImportValidateRow[];
}

