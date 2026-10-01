export interface HealthResponse {
  success: boolean;
  message: string;
  environment: string;
  timestamp: string;
  database: {
    status: 'connected' | 'disconnected' | 'connecting' | 'disconnecting' | 'unknown';
    connected: boolean;
    name: string;
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
}

export interface AdminStat {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  subtext: string;
}
