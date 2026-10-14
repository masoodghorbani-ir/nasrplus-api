import * as XLSX from 'xlsx';
import jalaali from 'jalaali-js';
import { IExcelColumnMapping, IExcelColumnInfo } from '../interfaces/member-import.interface';

// Converts Persian and Arabic digits to ASCII digits
export function normalizePersianDigits(input: string): string {
  if (!input) return '';
  return input
    .replace(/[۰٠]/g, '0')
    .replace(/[۱١]/g, '1')
    .replace(/[۲٢]/g, '2')
    .replace(/[۳٣]/g, '3')
    .replace(/[۴٤]/g, '4')
    .replace(/[۵٥]/g, '5')
    .replace(/[۶٦]/g, '6')
    .replace(/[۷٧]/g, '7')
    .replace(/[۸٨]/g, '8')
    .replace(/[۹٩]/g, '9');
}

// Converts column letter (e.g., 'A', 'B', 'AA') or 1-based index to 0-based index
export function columnLetterToIndex(col: string | number): number {
  if (typeof col === 'number') {
    return col >= 1 ? col - 1 : col;
  }
  const trimmed = col.trim().toUpperCase();
  if (/^\d+$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    return num >= 1 ? num - 1 : num;
  }
  let index = 0;
  for (let i = 0; i < trimmed.length; i++) {
    const code = trimmed.charCodeAt(i);
    if (code < 65 || code > 90) return -1;
    index = index * 26 + (code - 64);
  }
  return index - 1;
}

// Converts 0-based column index to letter (0 -> 'A', 25 -> 'Z', 26 -> 'AA')
export function indexToColumnLetter(idx: number): string {
  let temp = idx + 1;
  let letter = '';
  while (temp > 0) {
    const mod = (temp - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    temp = Math.floor((temp - mod) / 26);
  }
  return letter;
}

// Parses string, number, or Date into a valid Gregorian Date (supports Jalali and Gregorian)
export function parseDateValue(raw: unknown): Date | null {
  if (raw === null || raw === undefined || raw === '') {
    return null;
  }

  // Handle native Date instances
  if (raw instanceof Date) {
    return isNaN(raw.getTime()) ? null : raw;
  }

  // Handle numeric Excel date serials
  if (typeof raw === 'number') {
    if (isNaN(raw)) return null;
    try {
      const parsed = XLSX.SSF.parse_date_code(raw);
      if (parsed) {
        return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d, parsed.H || 0, parsed.M || 0, parsed.S || 0));
      }
    } catch {
      // Fallback to calculation
      const utcDays = Math.round(raw - 25569);
      return new Date(utcDays * 86400 * 1000);
    }
  }

  const str = normalizePersianDigits(String(raw).trim());

  // Matches 8-digit continuous Jalali date (e.g. 14020515)
  const continuousMatch = str.match(/^(1[34]\d{2})(\d{2})(\d{2})$/);
  if (continuousMatch) {
    const jy = parseInt(continuousMatch[1], 10);
    const jm = parseInt(continuousMatch[2], 10);
    const jd = parseInt(continuousMatch[3], 10);
    try {
      const g = jalaali.toGregorian(jy, jm, jd);
      return new Date(Date.UTC(g.gy, g.gm - 1, g.gd));
    } catch {
      return null;
    }
  }

  // Matches standard delimited date (e.g. 1402/05/15 or 2023-08-06)
  const delimitedMatch = str.match(/^(\d{4})[./\-](\d{1,2})[./\-](\d{1,2})/);
  if (delimitedMatch) {
    const year = parseInt(delimitedMatch[1], 10);
    const month = parseInt(delimitedMatch[2], 10);
    const day = parseInt(delimitedMatch[3], 10);

    // Jalali year range detection
    if (year >= 1300 && year <= 1500) {
      try {
        const g = jalaali.toGregorian(year, month, day);
        return new Date(Date.UTC(g.gy, g.gm - 1, g.gd));
      } catch {
        return null;
      }
    }

    // Gregorian year range detection
    if (year >= 1900 && year <= 2100) {
      return new Date(Date.UTC(year, month - 1, day));
    }
  }

  // Attempt standard Date constructor parse
  const fallbackDate = new Date(str);
  return isNaN(fallbackDate.getTime()) ? null : fallbackDate;
}

// Normalizes 10-digit Iranian National Code
export function normalizeNationalCode(raw: unknown): string | undefined {
  if (raw === null || raw === undefined) return undefined;
  const str = normalizePersianDigits(String(raw)).replace(/\D/g, '').trim();
  if (!str) return undefined;

  // Restore leading zeros dropped by spreadsheet numeric formatting
  if (str.length >= 8 && str.length < 10) {
    return str.padStart(10, '0');
  }

  return str;
}

// Normalizes Iranian mobile phone number to 09XXXXXXXXX format
export function normalizeMobilePhone(raw: unknown): string | undefined {
  if (raw === null || raw === undefined) return undefined;
  let str = normalizePersianDigits(String(raw)).replace(/[\s\-\(\)\.]/g, '').trim();
  if (!str) return undefined;

  // Strip international prefix
  if (str.startsWith('+98')) {
    str = '0' + str.slice(3);
  } else if (str.startsWith('0098')) {
    str = '0' + str.slice(4);
  } else if (str.startsWith('98') && str.length === 12) {
    str = '0' + str.slice(2);
  } else if (str.startsWith('9') && str.length === 10) {
    str = '0' + str;
  }

  return str;
}

// Normalizes member code string
export function normalizeMemberCode(raw: unknown): string {
  if (raw === null || raw === undefined) return '';
  return normalizePersianDigits(String(raw)).trim();
}

// Suggests column mapping from header text
export function suggestColumnMapping(headers: Array<{ letter: string; name: string }>): IExcelColumnMapping {
  const mapping: IExcelColumnMapping = {};

  for (const { letter, name } of headers) {
    const clean = name.trim().toLowerCase();

    if (!mapping.firstName && /^(نام|نام\s*کوچک|first\s*name|fname)$/i.test(clean)) {
      mapping.firstName = letter;
    } else if (!mapping.lastName && /^(نام\s*خانوادگی|فامیلی|شهرت|نام\s*خانوادگي|last\s*name|lname|family)$/i.test(clean)) {
      mapping.lastName = letter;
    } else if (!mapping.nationalCode && /^(کد\s*ملی|شماره\s*ملی|کدملی|national\s*code|nid)$/i.test(clean)) {
      mapping.nationalCode = letter;
    } else if (!mapping.memberCode && /^(کد\s*عضویت|شماره\s*عضویت|شماره\s*پرونده|کدعضویت|member\s*code|membership\s*code)$/i.test(clean)) {
      mapping.memberCode = letter;
    } else if (!mapping.membershipDate && /^(تاریخ\s*عضویت|تاریخ\s*شروع|تاریخ\s*ثبت|membership\s*date|start\s*date)$/i.test(clean)) {
      mapping.membershipDate = letter;
    } else if (!mapping.expiryDate && /^(تاریخ\s*اعتبار|تاریخ\s*انقضا|تاریخ\s*پایان|expiry\s*date|expiration\s*date)$/i.test(clean)) {
      mapping.expiryDate = letter;
    } else if (!mapping.mobilePhone && /^(تلفن\s*همراه|موبایل|شماره\s*همراه|شماره\s*موبایل|mobile|cellphone|phone)$/i.test(clean)) {
      mapping.mobilePhone = letter;
    } else if (!mapping.email && /^(ایمیل|پست\s*الکترونیک|پست\s*الکترونیکی|رایانامه|email|e-mail)$/i.test(clean)) {
      mapping.email = letter;
    }
  }

  return mapping;
}

// Reads workbook and produces preview payload
export function parseWorkbookForPreview(
  workbook: XLSX.WorkBook,
  fileId: string,
  originalFilename: string,
  maxPreviewRows = 5
) {
  const sheets = workbook.SheetNames;
  const selectedSheet = sheets[0] || '';
  const sheet = workbook.Sheets[selectedSheet];

  if (!sheet || !sheet['!ref']) {
    return {
      fileId,
      originalFilename,
      sheets,
      selectedSheet,
      totalRows: 0,
      columns: [] as IExcelColumnInfo[],
      previewRows: [] as Array<Record<string, unknown>>,
      suggestedMapping: {} as IExcelColumnMapping,
    };
  }

  const range = XLSX.utils.decode_range(sheet['!ref']);
  const totalRows = range.e.r + 1;
  const totalCols = range.e.c + 1;

  // Extract columns and header row (row 0)
  const columns: IExcelColumnInfo[] = [];
  const headerPairs: Array<{ letter: string; name: string }> = [];

  for (let c = 0; c < totalCols; c++) {
    const letter = indexToColumnLetter(c);
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c });
    const cell = sheet[cellAddress];
    const headerSample = cell ? String(cell.v).trim() : '';

    columns.push({
      key: letter,
      index: c,
      headerSample,
    });

    if (headerSample) {
      headerPairs.push({ letter, name: headerSample });
    }
  }

  // Extract preview rows
  const previewRows: Array<Record<string, unknown>> = [];
  const previewLimit = Math.min(totalRows, maxPreviewRows + 1);

  for (let r = 0; r < previewLimit; r++) {
    const rowObj: Record<string, unknown> = { rowNumber: r + 1 };
    let hasData = false;

    for (let c = 0; c < totalCols; c++) {
      const letter = indexToColumnLetter(c);
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      const cell = sheet[cellAddress];
      const val = cell !== undefined && cell !== null ? cell.v : null;
      if (val !== null && val !== '') {
        hasData = true;
      }
      rowObj[letter] = val;
    }

    if (hasData) {
      previewRows.push(rowObj);
    }
  }

  const suggestedMapping = suggestColumnMapping(headerPairs);

  return {
    fileId,
    originalFilename,
    sheets,
    selectedSheet,
    totalRows,
    columns,
    previewRows,
    suggestedMapping,
  };
}
