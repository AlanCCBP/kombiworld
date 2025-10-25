import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextData {
  token?: string;
  userId?: string;
}

export const requestContext = new AsyncLocalStorage<RequestContextData>();
