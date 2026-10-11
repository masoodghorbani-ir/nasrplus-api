import { CompanyRepository } from '../repositories/company.repository';
import { ICompanyInformation } from '../interfaces/company-information.interface';
import { ApiError } from '../../../common/utils/api-error';

export class CompanyService {
  private companyRepository: CompanyRepository;

  constructor() {
    this.companyRepository = new CompanyRepository();
  }

  async getCompanies(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { nationalId: { $regex: search, $options: 'i' } },
            { registrationNumber: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.companyRepository.find(filter, skip, limit),
      this.companyRepository.count(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCompanyById(id: string): Promise<ICompanyInformation> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw ApiError.notFound(`Company with ID '${id}' was not found`);
    }
    return company;
  }

  async createCompany(data: Partial<ICompanyInformation>): Promise<ICompanyInformation> {
    return await this.companyRepository.create(data);
  }

  async updateCompany(id: string, data: Partial<ICompanyInformation>): Promise<ICompanyInformation> {
    const updated = await this.companyRepository.updateById(id, data);
    if (!updated) {
      throw ApiError.notFound(`Company with ID '${id}' was not found`);
    }
    return updated;
  }

  async deleteCompany(id: string): Promise<ICompanyInformation> {
    const deleted = await this.companyRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound(`Company with ID '${id}' was not found`);
    }
    return deleted;
  }
}
