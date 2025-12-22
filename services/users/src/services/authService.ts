import { prisma } from '@/src/lib/prisma';
import { hash, compare } from 'bcrypt';
import crypto from 'crypto';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/src/utils/jwt';
import { LoginInput, RegisterUserInput } from '@/src/types/user.types';
import { sendPasswordResetEmail } from '@/src/utils/email';

interface AuthResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}

/**
 * Registra un nuevo usuario
 */
const register = async (data: RegisterUserInput): Promise<AuthResponse> => {
  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hashear contraseña
  const hashedPassword = await hash(data.password, 10);

  // Crear usuario con rol USER por defecto
  const newUser = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      userRoles: {
        create: {
          role: {
            connectOrCreate: {
              where: { name: 'USER' },
              create: { name: 'USER' },
            },
          },
        },
      },
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  // Generar tokens
  const roles = newUser.userRoles.map((ur) => ur.role.name);
  const accessToken = generateAccessToken({
    userId: newUser.id,
    email: newUser.email,
    roles,
    tokenVersion: newUser.tokenVersion,
  });

  const refreshToken = generateRefreshToken({
    userId: newUser.id,
    email: newUser.email,
    roles,
    tokenVersion: newUser.tokenVersion,
  });

  // Guardar refresh token en la BD
  await prisma.refreshToken.create({
    data: {
      userId: newUser.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    },
  });

  // Remover password de la respuesta
  const { password, ...safeUser } = newUser;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

/**
 * Login de usuario
 */
const login = async (data: LoginInput): Promise<AuthResponse> => {
  const { email, password } = data;

  // Buscar usuario
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verificar que el usuario no esté eliminado o baneado
  if (user.deletedAt) {
    throw new Error('User account has been deleted');
  }

  if (user.status === 'BANNED') {
    throw new Error('User account has been banned');
  }

  // Verificar contraseña
  const validPassword = await compare(password, user.password);

  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  // Generar tokens
  const roles = user.userRoles.map((ur) => ur.role.name);
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    roles,
    tokenVersion: user.tokenVersion,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    roles,
    tokenVersion: user.tokenVersion,
  });

  // Guardar refresh token en la BD
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    },
  });

  // Remover password
  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

/**
 * Logout - Revoca el refresh token específico
 */
const logout = async (userId: string, refreshToken?: string): Promise<void> => {
  if (refreshToken) {
    // Revocar el token específico
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        token: refreshToken,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  } else {
    // Revocar todos los tokens del usuario
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  // También incrementar tokenVersion para invalidar todos los tokens existentes
  await prisma.user.update({
    where: { id: userId },
    data: {
      tokenVersion: {
        increment: 1,
      },
    },
  });
};

/**
 * Refresh access token usando refresh token
 */
const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  // Verificar que el token existe en la BD y no está revocado
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: {
      user: {
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      },
    },
  });

  if (!storedToken) {
    throw new Error('Invalid refresh token');
  }

  if (storedToken.revokedAt) {
    throw new Error('Refresh token has been revoked');
  }

  if (storedToken.expiresAt < new Date()) {
    throw new Error('Refresh token has expired');
  }

  // Verificar el JWT
  const payload = verifyRefreshToken(refreshToken);

  const user = storedToken.user;

  // Verificar que el token version coincida
  if (user.tokenVersion !== payload.tokenVersion) {
    throw new Error('Invalid refresh token');
  }

  // Verificar estado del usuario
  if (user.deletedAt) {
    throw new Error('User account has been deleted');
  }

  if (user.status === 'BANNED') {
    throw new Error('User account has been banned');
  }

  // Generar nuevo access token
  const roles = user.userRoles.map((ur) => ur.role.name);
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    roles,
    tokenVersion: user.tokenVersion,
  });

  return { accessToken };
};

/**
 * Solicitar reset de contraseña
 * Genera un token y lo guarda en la BD, luego envía email
 */
const requestPasswordReset = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Por seguridad, no revelar si el usuario existe
  if (!user) {
    return;
  }

  // Generar token de reset (32 bytes random)
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

  // Guardar token en la BD
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: resetToken,
      expiresAt: resetTokenExpiry,
    },
  });

  // Enviar email con el link
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendPasswordResetEmail(user.email, user.firstName, resetUrl);
};

/**
 * Resetear contraseña usando el token
 */
const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  // Buscar el token de reset
  const passwordReset = await prisma.passwordReset.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!passwordReset) {
    throw new Error('Invalid or expired reset token');
  }

  if (passwordReset.usedAt) {
    throw new Error('Reset token has already been used');
  }

  if (passwordReset.expiresAt < new Date()) {
    throw new Error('Reset token has expired');
  }

  // Hashear nueva contraseña
  const hashedPassword = await hash(newPassword, 10);

  // Actualizar contraseña, marcar token como usado e invalidar todos los tokens existentes
  await prisma.$transaction([
    // Actualizar password y tokenVersion
    prisma.user.update({
      where: { id: passwordReset.userId },
      data: {
        password: hashedPassword,
        tokenVersion: {
          increment: 1,
        },
      },
    }),
    // Marcar token como usado
    prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: {
        usedAt: new Date(),
      },
    }),
    // Revocar todos los refresh tokens del usuario
    prisma.refreshToken.updateMany({
      where: {
        userId: passwordReset.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    }),
  ]);
};

/**
 * Obtener usuario por ID (para /auth/me)
 */
const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      altPhone: true,
      docType: true,
      docNumber: true,
      birthdate: true,
      address: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      userRoles: {
        select: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

/**
 * Limpiar tokens expirados (puede ejecutarse como cron job)
 */
const cleanupExpiredTokens = async (): Promise<void> => {
  const now = new Date();

  await prisma.$transaction([
    // Eliminar refresh tokens expirados
    prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    }),
    // Eliminar tokens de password reset expirados
    prisma.passwordReset.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    }),
  ]);
};

export default {
  register,
  login,
  logout,
  refreshAccessToken,
  requestPasswordReset,
  resetPassword,
  getUserById,
  cleanupExpiredTokens,
};
