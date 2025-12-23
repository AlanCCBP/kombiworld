import { Request, Response } from 'express';
import * as service from './auth.service';

export const register = async (req: Request, res: Response) => {
  const tokens = await service.registerUser(req.body);
  res.status(201).json(tokens);
};

export const login = async (req: Request, res: Response) => {
  const tokens = await service.loginUser(req.body.email, req.body.password);
  res.json(tokens);
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Missing refreshToken' });
  }

  try {
    const tokens = await service.refreshToken(refreshToken);
    res.json(tokens);
  } catch (e) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    await service.logoutUser(req.auth.userId);

    return res.json({ message: 'Logged out from all sessions' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
