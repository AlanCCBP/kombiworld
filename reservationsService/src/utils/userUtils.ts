export interface User {
  id: string;
  email: string;
  password?: string;
  [key: string]: any;
}

export const sanitizeUser = <T extends User | null>(
  user: T,
): Omit<T, 'password'> | null => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

export const sanitizeUsers = <T extends User>(
  users: T[] | null | undefined,
): Array<Omit<T, 'password'>> => {
  return Array.isArray(users)
    ? (users.map(sanitizeUser) as Array<Omit<T, 'password'>>)
    : [];
};
