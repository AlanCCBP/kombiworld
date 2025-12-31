import { Request, Response } from 'express';
import * as service from './auth.service';

export const register = async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await service.registerUser(req.body);

  res.status(201).json({ accessToken });
};

export const login = async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await service.loginUser(
    req.body.email,
    req.body.password,
  );

  res.json({ accessToken, refreshToken });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Missing refresh token' });
  }

  const { accessToken, refreshToken: newRefresh } =
    await service.refreshToken(refreshToken);

  res.json({ accessToken });
};

export const logout = async (req: Request, res: Response) => {
  if (!req.auth) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  await service.logoutUser(req.auth.userId);

  res.clearCookie('refreshToken', { path: '/' });

  res.json({ ok: true });
};
