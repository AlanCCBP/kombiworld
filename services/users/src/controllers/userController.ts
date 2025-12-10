import { Request, Response } from 'express';
import userService from '../services/userService';

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await userService.updateUser(userId, req.body);
    res.json(user);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await userService.deleteUser(userId);
    res.json({ message: 'User deleted' });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUser(userId);
    res.json(user);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export default {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
};
