export interface CreateCompanyDTO {
  name: string;
  legalName?: string;
  taxId?: string;
  email?: string;
  phone?: string;
}

export interface UpdateCompanyDTO {
  name?: string;
  legalName?: string;
  taxId?: string;
  email?: string;
  phone?: string;
}
