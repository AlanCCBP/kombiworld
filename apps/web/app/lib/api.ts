import axios from "axios";
import { USERS_API_URL } from "./constants";

export const api = axios.create({
  baseURL: USERS_API_URL,
  withCredentials: true,
});
