import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import { AuthRequest } from '../middlewares/authMiddleware';

/**
 * POST /auth/register
 * Registra un nuevo usuario
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * POST /auth/login
 * Inicia sesión y devuelve tokens
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * POST /auth/logout
 * Invalida el refresh token del usuario
 */
export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const refreshToken = req.cookies.refreshToken;
    await authService.logout(req.userId, refreshToken);

    res.clearCookie('refreshToken');

    res.json({ message: 'Logout successful' });
  } catch (error: any) {
    next(error);
  }
};

/**
 * POST /auth/refresh
 * Genera un nuevo access token usando el refresh token
 */
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.json({
      accessToken: result.accessToken,
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * POST /auth/forgot-password
 * Envía email con link de recuperación de contraseña
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    await authService.requestPasswordReset(email);

    res.json({
      message: 'If that email exists, a password reset link has been sent',
    });
  } catch (error: any) {
    res.json({
      message: 'If that email exists, a password reset link has been sent',
    });
  }
};

/**
 * POST /auth/reset-password
 * Resetea la contraseña usando el token enviado por email
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    await authService.resetPassword(token, newPassword);

    res.json({
      message: 'Password reset successful',
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * GET /auth/me
 * Obtiene el usuario actualmente autenticado
 */
export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await authService.getUserById(req.userId);

    res.json({ user });
  } catch (error: any) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
