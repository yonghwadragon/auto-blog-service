// auto-blog-service/src/components/hooks/useAuth.ts
// useAuth 훅: 사용자 인증 상태 및 관련 기능을 관리하는 커스텀 훅입니다.

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

export interface UseAuthReturn extends AuthState, AuthActions {}

// 인메모리 저장소 (실제 구현에서는 적절한 저장소 사용)
let authToken: string | null = null;
let refreshTokenValue: string | null = null;

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // 토큰 확인 및 사용자 정보 가져오기
  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!authToken) {
        setUser(null);
        return;
      }

      // API 호출하여 사용자 정보 확인
      // 실제 구현에서는 API 엔드포인트 호출
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // 토큰이 유효하지 않은 경우
        authToken = null;
        setUser(null);
      }
    } catch (err) {
      console.error('Auth status check failed:', err);
      authToken = null;
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그인에 실패했습니다.');
      }

      const data = await response.json();
      authToken = data.token;
      refreshTokenValue = data.refreshToken;
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }

      const data = await response.json();
      authToken = data.token;
      refreshTokenValue = data.refreshToken;
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (authToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
      }
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      authToken = null;
      refreshTokenValue = null;
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      if (!refreshTokenValue) {
        throw new Error('Refresh token not available');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      authToken = data.token;
      refreshTokenValue = data.refreshToken;
      setUser(data.user);
    } catch (err) {
      console.error('Token refresh failed:', err);
      authToken = null;
      refreshTokenValue = null;
      setUser(null);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // 토큰 만료 처리를 위한 자동 갱신
  useEffect(() => {
    if (!authToken || !refreshTokenValue) return;

    const interval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (err) {
        console.error('Auto token refresh failed:', err);
        // 자동 갱신 실패 시 로그아웃
        await logout();
      }
    }, 50 * 60 * 1000); // 50분마다 토큰 갱신

    return () => clearInterval(interval);
  }, [refreshToken, logout]);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    register,
    refreshToken,
    clearError
  };
}