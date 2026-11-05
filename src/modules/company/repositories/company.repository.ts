import { FilterQuery, UpdateQuery } from 'mongoose';
import { CompanyInformation } from '../models/company-information.model';
import { ICompanyInformation } from '../interfaces/company-information.interface';
import { Member } from '../../members/models/member.model';
import { assertNotReferenced } from '../../../common/utils/reference-guard';

export class CompanyRepository {
  async create(data: Partial<ICompanyInformation>): Promise<ICompanyInformation> {
    return await CompanyInformation.create(data);
  }

  async findById(id: string): Promise<ICompanyInformation | null> {
    return await CompanyInformation.findById(id);
  }

  async find(filter: FilterQuery<ICompanyInformation> = {}, skip = 0, limit = 20): Promise<ICompanyInformation[]> {
    return await CompanyInformation.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ title: 1 });
  }

  async count(filter: FilterQuery<ICompanyInformation> = {}): Promise<number> {
    return await CompanyInformation.countDocuments(filter);
  }

  async updateById(id: string, updateData: UpdateQuery<ICompanyInformation>): Promise<ICompanyInformation | null> {
    return await CompanyInformation.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteById(id: string): Promise<ICompanyInformation | null> {
    await assertNotReferenced(id, [
      { model: Member, field: 'companyInformation', label: 'members' },
    ]);
    return await CompanyInformation.findByIdAndDelete(id);
  }
}
