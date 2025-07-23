// auto-blog-service\src\components\types\project.ts
// 프로젝트 관련 타입 정의: 프로젝트 데이터 구조 및 관련 인터페이스를 정의합니다.

// 프로젝트 관련 타입 정의
export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  status: ProjectStatus;
  settings: ProjectSettings;
  posts: Post[];
  totalPosts: number;
  lastActivity: Date;
}

export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface ProjectSettings {
  blogPlatform: 'naver' | 'tistory' | 'wordpress' | 'custom';
  autoPublish: boolean;
  publishSchedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string; // HH:MM format
    days?: number[]; // 0-6 (Sunday-Saturday)
  };
  categories: string[];
  defaultTags: string[];
  seoOptimization: boolean;
  imageOptimization: boolean;
}

export interface Post {
  id: string;
  projectId: string;
  title: string;
  content: string;
  excerpt?: string;
  status: PostStatus;
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  category?: string;
  images: PostImage[];
  seoData?: PostSEO;
  analytics?: PostAnalytics;
}

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed' | 'processing';

export interface PostImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  size: number; // bytes
  format: string;
}

export interface PostSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  slug?: string;
  canonicalUrl?: string;
}

export interface PostAnalytics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clickThroughRate?: number;
  engagementRate?: number;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  settings: Partial<ProjectSettings>;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  settings?: Partial<ProjectSettings>;
}