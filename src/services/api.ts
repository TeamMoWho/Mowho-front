/**
 * API Service Module
 * 모든 API 호출을 관리하는 서비스 파일
 */

import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

/**
 * API 요청을 위한 기본 함수
 */
export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}`,
        code: response.status,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * GET 요청
 */
export const get = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: 'GET',
  });
};

/**
 * POST 요청
 */
export const post = async <T>(
  endpoint: string,
  body: Record<string, any>
): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * PUT 요청
 */
export const put = async <T>(
  endpoint: string,
  body: Record<string, any>
): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

/**
 * DELETE 요청
 */
export const deleteRequest = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: 'DELETE',
  });
};

// 예시: 사용자 관련 API
export const userApi = {
  getProfile: () => get('/users/me'),
  updateProfile: (data: Record<string, any>) => put('/users/me', data),
  logout: () => post('/auth/logout', {}),
};
