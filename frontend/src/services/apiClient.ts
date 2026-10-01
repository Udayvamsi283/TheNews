import { env } from '../config/env';
import {
  HealthResponse,
  User,
  AuthResponse,
  Category,
  Tag,
  Language,
  Pagination
} from '../types';

export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    // Restore token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('the_news_token');
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('the_news_token', token);
      } else {
        localStorage.removeItem('the_news_token');
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Ensures HTTP-only cookie is sent
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        throw new ApiError(
          json?.message || `Request failed with status ${response.status}`,
          response.status,
          json
        );
      }

      return json as T;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ApiError('Request timed out', 408);
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(error.message || 'Network communication error', 0);
    }
  }

  // Health
  public async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  // Auth
  public async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await this.request<{ success: boolean; data: AuthResponse }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.data.accessToken) {
      this.setToken(res.data.accessToken);
    }
    return res.data;
  }

  public async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await this.request<{ success: boolean; data: AuthResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.data.accessToken) {
      this.setToken(res.data.accessToken);
    }
    return res.data;
  }

  public async logout(): Promise<void> {
    try {
      await this.request<{ success: boolean }>('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  public async getMe(): Promise<User> {
    const res = await this.request<{ success: boolean; data: { user: User } }>('/auth/me');
    return res.data.user;
  }

  // User Profile
  public async updateProfile(data: {
    name?: string;
    avatar?: string;
    preferredLanguage?: string;
    interests?: string[];
  }): Promise<User> {
    const res = await this.request<{ success: boolean; data: { user: User } }>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    return res.data.user;
  }

  public async changePassword(
    param1: string | { currentPassword: string; newPassword: string },
    param2?: string
  ): Promise<void> {
    const payload = typeof param1 === 'string'
      ? { currentPassword: param1, newPassword: param2! }
      : param1;
    await this.request<{ success: boolean }>('/users/me/change-password', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Admin User Management
  public async listUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<{ users: User[]; pagination: Pagination }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.role) searchParams.append('role', params.role);
    if (params?.status) searchParams.append('status', params.status);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await this.request<{ success: boolean; data: { users: User[]; pagination: Pagination } }>(
      `/users${query}`
    );
    return res.data;
  }

  public async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<{ users: User[]; pagination: Pagination }> {
    return this.listUsers(params);
  }

  public async updateUser(
    id: string,
    data: { role?: 'user' | 'admin'; status?: 'active' | 'disabled' }
  ): Promise<User> {
    const res = await this.request<{ success: boolean; data: { user: User } }>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    return res.data.user;
  }

  public async deleteUser(id: string): Promise<void> {
    await this.request<{ success: boolean }>(`/users/${id}`, { method: 'DELETE' });
  }

  // Categories
  public async getCategories(status?: string): Promise<Category[]> {
    const query = status ? `?status=${status}` : '';
    const res = await this.request<{ success: boolean; data: { categories: Category[] } }>(
      `/categories${query}`
    );
    return res.data.categories;
  }

  public async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await this.request<{ success: boolean; data: { category: Category } }>('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data.category;
  }

  public async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await this.request<{ success: boolean; data: { category: Category } }>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    return res.data.category;
  }

  public async deleteCategory(id: string): Promise<void> {
    await this.request<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' });
  }

  // Tags
  public async getTags(search?: string): Promise<Tag[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await this.request<{ success: boolean; data: { tags: Tag[] } }>(`/tags${query}`);
    return res.data.tags;
  }

  public async createTag(data: { name: string; slug?: string }): Promise<Tag> {
    const res = await this.request<{ success: boolean; data: { tag: Tag } }>('/tags', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data.tag;
  }

  public async updateTag(id: string, data: { name?: string; slug?: string }): Promise<Tag> {
    const res = await this.request<{ success: boolean; data: { tag: Tag } }>(`/tags/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    return res.data.tag;
  }

  public async deleteTag(id: string): Promise<void> {
    await this.request<{ success: boolean }>(`/tags/${id}`, { method: 'DELETE' });
  }

  // Languages
  public async getLanguages(status?: string): Promise<Language[]> {
    const query = status ? `?status=${status}` : '';
    const res = await this.request<{ success: boolean; data: { languages: Language[] } }>(
      `/languages${query}`
    );
    return res.data.languages;
  }

  public async createLanguage(data: { name: string; code: string; isDefault?: boolean; status?: 'active' | 'inactive' }): Promise<Language> {
    const res = await this.request<{ success: boolean; data: { language: Language } }>('/languages', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data.language;
  }

  public async updateLanguage(
    id: string,
    data: { name?: string; code?: string; isDefault?: boolean; status?: 'active' | 'inactive' }
  ): Promise<Language> {
    const res = await this.request<{ success: boolean; data: { language: Language } }>(`/languages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    return res.data.language;
  }

  public async deleteLanguage(id: string): Promise<void> {
    await this.request<{ success: boolean }>(`/languages/${id}`, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(env.API_BASE_URL);
