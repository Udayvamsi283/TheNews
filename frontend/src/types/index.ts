export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'disabled';

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  preferredLanguage: string;
  interests?: Category[] | string[];
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
}

export type CategoryStatus = 'active' | 'inactive';

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parent?: Category | string | null;
  status?: CategoryStatus;
  createdAt?: string;
  updatedAt?: string;
  articleCount?: number;
}

export interface Tag {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LanguageStatus = 'active' | 'inactive';

export interface Language {
  _id?: string;
  id?: string;
  name: string;
  code: string;
  isDefault: boolean;
  status: LanguageStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages?: number;
  totalPages?: number;
}

export interface HealthResponse {
  success: boolean;
  message: string;
  environment: string;
  timestamp: string;
  database: {
    status: 'connected' | 'disconnected' | 'connecting' | 'disconnecting' | 'unknown';
    connected: boolean;
    name: string;
    host?: string;
  };
}

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  categorySlug: string;
  tags: string[];
  imageUrl: string;
  imageCaption?: string;
  imageCredit?: string;
  author: Author;
  publishedAt: string;
  readingTimeMinutes: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  viewCount: number;
}

export interface AdminStat {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  subtext: string;
}
