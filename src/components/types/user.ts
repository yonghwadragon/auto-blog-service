// auto-blog-service\src\components\types\user.ts
// 사용자 관련 타입 정의: 사용자 데이터 구조 및 관련 인터페이스를 정의합니다.

// 사용자 관련 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  subscription?: UserSubscription;
}

export interface UserSubscription {
  plan: 'free' | 'basic' | 'premium';
  status: 'active' | 'inactive' | 'expired';
  startDate: Date;
  endDate?: Date;
  features: string[];
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  autoSave: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  profileImage?: string;
  bio?: string;
  website?: string;
  location?: string;
}