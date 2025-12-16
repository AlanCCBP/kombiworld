import { Status, DocType } from '../../prisma/generated/prisma/client';

// -------------------------------------------------------------
// CREATE USER INPUT
// -------------------------------------------------------------
export interface CreateUserInput {
  firstName: string;
  lastName: string;
  docType: DocType;
  docNumber: string;
  email: string;
  phone?: string;
  altPhone?: string;
  birthdate?: string | Date;
  address?: string;
  password: string;
  status?: Status;
  roleIds?: number[];
}

// -------------------------------------------------------------
// UPDATE USER INPUT
// -------------------------------------------------------------
export interface UpdateUserInput {
  id: string;
  firstName?: string;
  lastName?: string;
  docType?: DocType;
  docNumber?: string;
  email?: string;
  phone?: string;
  altPhone?: string;
  birthdate?: string | Date;
  address?: string;
  password?: string;
  status?: Status;
  roleIds?: number[];
}

// -------------------------------------------------------------
// LOGIN INPUT
// -------------------------------------------------------------
export interface LoginInput {
  email: string;
  password: string;
}

// -------------------------------------------------------------
// REGISTER INPUT
// -------------------------------------------------------------
export interface RegisterUserInput {
  firstName: string;
  lastName: string;
  docType: DocType;
  docNumber: string;
  email: string;
  phone?: string;
  altPhone?: string;
  birthdate?: string | Date;
  address?: string;
  password: string;
}

// -------------------------------------------------------------
// USER FILTER OPTIONS (GET USERS)
// -------------------------------------------------------------
export interface UserFilterOptions {
  ids?: string[];
  firstName?: string;
  lastName?: string;
  email?: string;
  docNumber?: string;
  birthdate?: string | Date;
  status?: Status;

  // ej: ["ADMIN", "DRIVER"]
  roles?: string[];
}
