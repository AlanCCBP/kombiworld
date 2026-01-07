export interface Company {
  id: string;
  name: string;
}

export interface CompanyMembership {
  company: Company;
  role: "OWNER" | "ADMIN" | "DRIVER" | "STAFF";
  status: "ACTIVE" | "INVITED" | "SUSPENDED";
}
