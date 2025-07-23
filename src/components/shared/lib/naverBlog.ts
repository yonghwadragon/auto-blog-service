// auto-blog-service\src\components\lib\naverBlog.ts
// NaverBlog API 유틸리티: 네이버 블로그 API와 통신하기 위한 함수들을 정의합니다.

import { Post } from '../../types/post';

interface NaverBlogConfig {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
}

interface NaverBlogPost {
  title: string;
  content: string;
  categoryId?: string;
  tags?: string[];
  isPublic?: boolean;
}

interface NaverApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class NaverBlogService {
  private config: NaverBlogConfig;

  constructor(config: NaverBlogConfig) {
    this.config = config;
  }

  /**
   * 네이버 블로그에 포스트 업로드
   * @param post 업로드할 포스트 데이터
   * @returns Promise<NaverApiResponse>
   */
  async uploadPost(post: NaverBlogPost): Promise<NaverApiResponse> {
    try {
      const response = await fetch('/api/naver-blog/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Naver-Client-Id': this.config.clientId,
          'X-Naver-Client-Secret': this.config.clientSecret,
          ...(this.config.accessToken && {
            'Authorization': `Bearer ${this.config.accessToken}`
          })
        },
        body: JSON.stringify(post)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('네이버 블로그 업로드 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  }

  /**
   * Post를 NaverBlogPost 형식으로 변환
   * @param post 변환할 포스트 데이터
   * @returns NaverBlogPost
   */
  convertPostData(post: Post): NaverBlogPost {
    return {
      title: post.title,
      content: post.content,
      tags: post.tags || [],
      isPublic: post.status === 'published'
    };
  }

  /**
   * 네이버 블로그 카테고리 목록 조회
   * @returns Promise<NaverApiResponse>
   */
  async getCategories(): Promise<NaverApiResponse> {
    try {
      const response = await fetch('/api/naver-blog/categories', {
        method: 'GET',
        headers: {
          'X-Naver-Client-Id': this.config.clientId,
          'X-Naver-Client-Secret': this.config.clientSecret,
          ...(this.config.accessToken && {
            'Authorization': `Bearer ${this.config.accessToken}`
          })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '카테고리 조회에 실패했습니다.'
      };
    }
  }

  /**
   * OAuth 인증 URL 생성
   * @param redirectUri 콜백 URL
   * @param state 보안을 위한 임의 문자열
   * @returns string 인증 URL
   */
  getAuthUrl(redirectUri: string, state: string): string {
    const baseUrl = 'https://nid.naver.com/oauth2.0/authorize';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: redirectUri,
      state: state
    });
    
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * 인증 코드로 액세스 토큰 획득
   * @param code 인증 코드
   * @param state 보안 문자열
   * @param redirectUri 콜백 URL
   * @returns Promise<NaverApiResponse>
   */
  async getAccessToken(code: string, state: string, redirectUri: string): Promise<NaverApiResponse> {
    try {
      const response = await fetch('/api/naver-blog/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          code,
          state,
          redirect_uri: redirectUri
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // 토큰을 설정에 저장
      if (result.access_token) {
        this.config.accessToken = result.access_token;
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('토큰 획득 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '토큰 획득에 실패했습니다.'
      };
    }
  }
}

// 싱글톤 인스턴스 생성을 위한 함수
let naverBlogService: NaverBlogService | null = null;

export const getNaverBlogService = (config?: NaverBlogConfig): NaverBlogService => {
  if (!naverBlogService && config) {
    naverBlogService = new NaverBlogService(config);
  } else if (!naverBlogService) {
    throw new Error('NaverBlogService가 초기화되지 않았습니다. config를 제공해주세요.');
  }
  
  return naverBlogService;
};

export default NaverBlogService;