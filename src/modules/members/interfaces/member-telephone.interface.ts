import { Document, Types } from 'mongoose';

export type PhoneType = 'MOBILE' | 'LANDLINE' | 'FAX' | 'SUPPORT' | 'OTHER';

export interface IMemberTelephone extends Document {
  membershipId: Types.ObjectId;     // Foreign key reference to Members collection
  phoneType: PhoneType;             // Phone classification (Mobile, Landline, Fax, Support, etc.)
  phoneNumber: string;              // Phone number (e.g., 09123456789 or 88776655)
  areaCode?: string;                // City / Regional area code (e.g., 021)
  countryCode: string;              // Country calling code (Default: +98)
  extension?: string;               // Internal telephone extension
  title?: string;                   // Label or description (e.g., CEO Direct Line, Secretariat Fax)
  isPrimary: boolean;               // Primary contact number flag
  createdAt: Date;
  updatedAt: Date;
}
