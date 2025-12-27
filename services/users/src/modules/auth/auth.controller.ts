import { Request, Response } from 'express';
import * as service from './auth.service';

export const register = async (req: Request, res: Response) => {
  const tokens = await service.registerUser(req.body);
  res.status(201).json(tokens);
};

export const login = async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await service.loginUser(
    req.body.email,
    req.body.password,
  );

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/auth/refresh',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.json({ accessToken });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Missing refresh token' });
  }

  try {
    const { accessToken, refreshToken: newRefresh } =
      await service.refreshToken(refreshToken);

    res.cookie('refresh_token', newRefresh, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    await service.logoutUser(req.auth.userId);

    res.clearCookie('refresh_token', { path: '/auth/refresh' });

    return res.json({ message: 'Logged out from all sessions' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
