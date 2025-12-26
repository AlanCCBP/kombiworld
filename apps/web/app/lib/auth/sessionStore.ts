let accessToken: string | null = null;

export const sessionStore = {
  get accessToken() {
    return accessToken;
  },

  setAccessToken(token: string | null) {
    accessToken = token;
  },

  clear() {
    accessToken = null;
  },
};
