import api from './request';

export interface LoginParams {
  userId: string;
  password: string;
}

export interface LoginResult {
  token: string;
  id: number;
  userId: string;
  email: string;
  role: string;
}

export interface User {
  id: number;
  userId: string;
  email: string;
  role: string;
}

export const authApi = {
  login: async (params: LoginParams) => {
    const { data } = await api.post<LoginResult>('/auth/login', params);
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
