import axios from 'axios';
import { requestContext } from '../utils/requestContext';

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

export interface User {
  id: string;
  name: string;
  email: string;
  dni?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserServiceClient = {
  async getUserByUserId(userId: string): Promise<User[]> {
    const store = requestContext.getStore();
    const token = store?.token;

    const { data } = await axios.get(`${USERS_SERVICE_URL}`, {
      params: { userId },
      headers: {
        Authorization: token,
      },
    });

    return data.users;
  },
};
