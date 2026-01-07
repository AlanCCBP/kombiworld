export interface UserMeDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  globalRoles: string[];
  companies: {
    id: string;
    name: string;
    role: string;
    status: string;
  }[];
}
