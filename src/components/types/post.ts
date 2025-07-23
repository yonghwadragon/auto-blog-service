// auto-blog-service\src\components\types\post.ts
// 게시글 관련 타입 정의: 게시글 데이터 구조 및 관련 인터페이스를 정의합니다.

// 포스트 관련 타입 정의
export interface Post {
  id: string;
  projectId: string;
  title: string;
  content: string;
  htmlContent?: string;
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
  aiGenerated: boolean;
  template?: PostTemplate;
}

export type PostStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'published' 
  | 'failed' 
  | 'processing' 
  | 'reviewing';

export interface PostImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  size: number; // bytes
  format: 'jpg' | 'png' | 'gif' | 'webp';
  isOptimized: boolean;
  uploadedAt: Date;
}

export interface PostSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  slug?: string;
  canonicalUrl?: string;
  focusKeyword?: string;
  readabilityScore?: number;
  seoScore?: number;
}

export interface PostAnalytics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clickThroughRate?: number;
  engagementRate?: number;
  averageTimeOnPage?: number;
  bounceRate?: number;
  lastUpdated: Date;
}

export interface PostTemplate {
  id: string;
  name: string;
  structure: TemplateSection[];
  variables: TemplateVariable[];
}

export interface TemplateSection {
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'quote' | 'code';
  content: string;
  order: number;
  required: boolean;
}

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  options?: string[];
  required: boolean;
  defaultValue?: any;
}

export interface CreatePostData {
  projectId: string;
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  category?: string;
  scheduledAt?: Date;
  seoData?: Partial<PostSEO>;
  images?: File[];
  template?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  category?: string;
  status?: PostStatus;
  scheduledAt?: Date;
  seoData?: Partial<PostSEO>;
}

export interface PostFilter {
  status?: PostStatus[];
  category?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

export interface PostGenerationRequest {
  topic: string;
  keywords: string[];
  targetLength: number;
  tone: 'formal' | 'casual' | 'professional' | 'friendly';
  includeImages: boolean;
  seoOptimized: boolean;
  template?: string;
  customPrompt?: string;
}