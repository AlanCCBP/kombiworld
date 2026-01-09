import axios from "axios";

const baseURL = process.env.USERS_SERVICE_INTERNAL_URL;

if (!baseURL) {
  throw new Error("USERS_SERVICE_INTERNAL_URL is not defined");
}

export const apiServer = axios.create({
  baseURL,
  withCredentials: true,
  proxy: false,
});
