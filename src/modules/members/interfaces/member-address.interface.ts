import { Document, Types } from 'mongoose';
import { IAddressType } from '../../lookup/interfaces/address-type.interface';
import { IProvince } from '../../lookup/interfaces/province.interface';
import { ICity } from '../../lookup/interfaces/city.interface';

export interface IMemberAddress extends Document {
  membershipId: Types.ObjectId;               // Member ID reference
  addressType: Types.ObjectId | IAddressType; // AddressType reference
  province: Types.ObjectId | IProvince;       // Province reference
  city: Types.ObjectId | ICity;               // City reference
  postalCode?: string;                        // 10-digit postal code
  address: string;                            // Full address
  plaque?: string;                            // Building number
  isPrimary: boolean;                         // Primary address flag
  createdAt: Date;
  updatedAt: Date;
}
