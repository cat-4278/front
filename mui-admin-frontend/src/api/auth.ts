import api from './request';

export interface LoginParams {
  userId: string;
  password: string;
}

export interface menuList {
  menuCd: string;
  menuNm: string;
  iconNm: string;
  parentCd: string;
  progCd: string;
  sort: string;
  sortPath: string;
  createdAt: string;
  updatedAt: string;
  lv: string;

}

export interface menuListResult {
  data: menuList[];
  total: number;
  page: number;
  pageSize: number;
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

  
  getMenuList: async () => {
    const { data } = await api.get<menuList[]>('/auth/menuList');
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
