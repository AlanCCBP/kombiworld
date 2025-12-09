const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

const sanitizeUsers = (users) =>
  Array.isArray(users) ? users.map(sanitizeUser) : [];

module.exports = { sanitizeUser, sanitizeUsers };
