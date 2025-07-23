// auto-blog-service\src\components\shared\lib\api.ts
// API 유틸리티: 백엔드 API와 통신하기 위한 함수들을 정의합니다.

// API 통신 서비스

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  description: string;
  category: string;
  keywords: string[];
  isPublic: boolean;
  tone: string;
  length: string;
  images: Array<{
    name: string;
    size: number;
    url?: string;
  }>;
  createdAt: string;
  updatedAt?: string;
  authorId?: string;
}

interface CreatePostRequest {
  title: string;
  content: string;
  description: string;
  category: string;
  keywords: string[];
  isPublic: boolean;
  tone: string;
  length: string;
  images: Array<{
    name: string;
    size: number;
  }>;
}

interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string;
}

interface GetPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  authorId?: string;
  isPublic?: boolean;
}

interface GetPostsResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
    
    // 클라이언트에서만 로컬스토리지 접근
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  // 인증 토큰 설정
  setAuthToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  // 인증 토큰 제거
  removeAuthToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // HTTP 요청 헤더 생성
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // 기본 fetch 래퍼
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: this.getHeaders(),
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          errorData?.error || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: data.message
      };
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  }

  // GET 요청
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  // POST 요청
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // 파일 업로드
  async uploadFile(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const headers: HeadersInit = {};
      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          errorData?.error || 
          `파일 업로드 실패: ${response.statusText}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: data.message
      };
    } catch (error) {
      console.error('File Upload Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.'
      };
    }
  }
}

// 싱글톤 인스턴스
const apiService = new ApiService();

// Posts API
export const postsApi = {
  // 포스트 목록 조회
  async getPosts(params?: GetPostsParams): Promise<ApiResponse<GetPostsResponse>> {
    return apiService.get<GetPostsResponse>('/posts', params);
  },

  // 특정 포스트 조회
  async getPost(id: string): Promise<ApiResponse<Post>> {
    return apiService.get<Post>(`/posts/${id}`);
  },

  // 포스트 생성
  async createPost(data: CreatePostRequest): Promise<ApiResponse<Post>> {
    return apiService.post<Post>('/posts', data);
  },

  // 포스트 수정
  async updatePost(data: UpdatePostRequest): Promise<ApiResponse<Post>> {
    const { id, ...updateData } = data;
    return apiService.put<Post>(`/posts/${id}`, updateData);
  },

  // 포스트 삭제
  async deletePost(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/posts/${id}`);
  },

  // 포스트 검색
  async searchPosts(query: string, filters?: Omit<GetPostsParams, 'search'>): Promise<ApiResponse<GetPostsResponse>> {
    return apiService.get<GetPostsResponse>('/posts/search', { search: query, ...filters });
  },
};

// Auth API
export const authApi = {
  // 로그인
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await apiService.post<{ token: string; user: any }>('/auth/login', {
      email,
      password,
    });
    
    if (response.success && response.data?.token) {
      apiService.setAuthToken(response.data.token);
    }
    
    return response;
  },

  // 회원가입
  async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await apiService.post<{ token: string; user: any }>('/auth/register', userData);
    
    if (response.success && response.data?.token) {
      apiService.setAuthToken(response.data.token);
    }
    
    return response;
  },

  // 로그아웃
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiService.post<void>('/auth/logout');
    apiService.removeAuthToken();
    return response;
  },

  // 현재 사용자 정보 조회
  async getProfile(): Promise<ApiResponse<any>> {
    return apiService.get<any>('/auth/profile');
  },

  // 비밀번호 변경
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiService.put<void>('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  },
};

// Upload API
export const uploadApi = {
  // 이미지 업로드
  async uploadImage(file: File): Promise<ApiResponse<{ url: string; filename: string }>> {
    return apiService.uploadFile('/upload/image', file);
  },

  // 다중 이미지 업로드
  async uploadImages(files: File[]): Promise<ApiResponse<Array<{ url: string; filename: string }>>> {
    const results = await Promise.all(
      files.map(file => apiService.uploadFile('/upload/image', file))
    );
    
    const successResults = results.filter(r => r.success).map(r => r.data);
    const errors = results.filter(r => !r.success).map(r => r.error);
    
    if (errors.length > 0) {
      return {
        success: false,
        error: `일부 파일 업로드 실패: ${errors.join(', ')}`
      };
    }
    
    return {
      success: true,
      data: successResults
    };
  },
};

// Categories API
export const categoriesApi = {
  // 카테고리 목록 조회
  async getCategories(): Promise<ApiResponse<Array<{ id: string; name: string; slug: string; count: number }>>> {
    return apiService.get('/categories');
  },

  // 카테고리 생성
  async createCategory(data: { name: string; slug: string }): Promise<ApiResponse<any>> {
    return apiService.post('/categories', data);
  },
};

// 개발/테스트용 Mock API (실제 백엔드가 없을 때 사용)
export const mockApi = {
  // 로컬스토리지를 이용한 Mock Posts API
  async getPosts(params?: GetPostsParams): Promise<ApiResponse<GetPostsResponse>> {
    try {
      const posts: Post[] = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      const { page = 1, limit = 10, category, search, isPublic } = params || {};
      
      let filteredPosts = posts;
      
      // 필터링
      if (category) {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }
      
      if (search) {
        const query = search.toLowerCase();
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.keywords.some(keyword => keyword.toLowerCase().includes(query))
        );
      }
      
      if (typeof isPublic === 'boolean') {
        filteredPosts = filteredPosts.filter(post => post.isPublic === isPublic);
      }
      
      // 페이지네이션
      const total = filteredPosts.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: {
          posts: paginatedPosts,
          total,
          page,
          totalPages,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: '포스트 조회 중 오류가 발생했습니다.'
      };
    }
  },

  async createPost(data: CreatePostRequest): Promise<ApiResponse<Post>> {
    try {
      const posts: Post[] = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      const newPost: Post = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      
      posts.push(newPost);
      localStorage.setItem('blogPosts', JSON.stringify(posts));
      
      return {
        success: true,
        data: newPost,
        message: '포스트가 성공적으로 생성되었습니다.'
      };
    } catch (error) {
      return {
        success: false,
        error: '포스트 생성 중 오류가 발생했습니다.'
      };
    }
  },

  async updatePost(data: UpdatePostRequest): Promise<ApiResponse<Post>> {
    try {
      const posts: Post[] = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      const index = posts.findIndex(post => post.id === data.id);
      
      if (index === -1) {
        return {
          success: false,
          error: '포스트를 찾을 수 없습니다.'
        };
      }
      
      const { id, ...updateData } = data;
      posts[index] = {
        ...posts[index],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('blogPosts', JSON.stringify(posts));
      
      return {
        success: true,
        data: posts[index],
        message: '포스트가 성공적으로 수정되었습니다.'
      };
    } catch (error) {
      return {
        success: false,
        error: '포스트 수정 중 오류가 발생했습니다.'
      };
    }
  },

  async deletePost(id: string): Promise<ApiResponse<void>> {
    try {
      const posts: Post[] = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      const filteredPosts = posts.filter(post => post.id !== id);
      
      if (posts.length === filteredPosts.length) {
        return {
          success: false,
          error: '포스트를 찾을 수 없습니다.'
        };
      }
      
      localStorage.setItem('blogPosts', JSON.stringify(filteredPosts));
      
      return {
        success: true,
        message: '포스트가 성공적으로 삭제되었습니다.'
      };
    } catch (error) {
      return {
        success: false,
        error: '포스트 삭제 중 오류가 발생했습니다.'
      };
    }
  },
};

export default apiService;