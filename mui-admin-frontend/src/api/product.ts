import api from './request';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResult {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export const productApi = {
  getList: async (page = 0, size = 10) => {
    const { data } = await api.get<ProductListResult>('/products', {
      params: { page, size, sortField: 'id', sortOrder: 'asc' },
    });
    return data;
  },

  getOne: async (id: number) => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  create: async (product: Partial<Product>) => {
    const { data } = await api.post<Product>('/products', product);
    return data;
  },

  update: async (id: number, product: Partial<Product>) => {
    const { data } = await api.put<Product>(`/products/${id}`, product);
    return data;
  },

  delete: async (id: number) => {
    await api.delete(`/products/${id}`);
  },

  getCategories: async () => {
    const { data } = await api.get<string[]>('/products/categories');
    return data;
  },
};
