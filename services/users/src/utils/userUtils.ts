import { User } from "../../prisma/generated/prisma/client";


export function sanitizeUser(user: User | null | undefined): Omit<User, 'password'> | null {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export function sanitizeUsers(users: Array<User | null | undefined> | undefined): Array<Omit<User, 'password'>> {
  if (!Array.isArray(users)) return [];
  return users.map((user) => sanitizeUser(user)!) as Array<Omit<User, 'password'>>;
}
