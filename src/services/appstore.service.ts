import type { App, Review, AppFilters } from '@/types/appstore';
import { logger } from '@/lib/logger';

export interface AppStoreAPIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface AppStorePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AppStoreSearchResponse {
  apps: App[];
  pagination: AppStorePagination;
  suggestions: string[];
  filters: {
    categories: string[];
    priceRanges: { min: number; max: number }[];
    ratings: number[];
  };
}

class AppStoreService {
  private baseUrl: string;
  private apiKey: string | null;

  constructor() {
    this.baseUrl = process.env['NEXT_PUBLIC_APPSTORE_API_URL'] || '/api/appstore';
    this.apiKey = process.env['NEXT_PUBLIC_APPSTORE_API_KEY'] || null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<AppStoreAPIResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: headers as HeadersInit,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      logger.error('AppStore API request failed', { error, url, method: options.method || 'GET' });
      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get all apps with optional filtering and pagination
   */
  async getApps(
    filters: AppFilters = {},
    page = 1,
    limit = 20
  ): Promise<AppStoreAPIResponse<AppStoreSearchResponse>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.searchQuery && { search: filters.searchQuery }),
      ...(filters.category && filters.category !== 'all' && { category: filters.category }),
      ...(filters.priceRange && {
        minPrice: filters.priceRange.min.toString(),
        maxPrice: filters.priceRange.max.toString(),
      }),
      ...(filters.rating && { minRating: filters.rating.toString() }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
      ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
    });

    return this.request<AppStoreSearchResponse>(`/apps?${queryParams}`);
  }

  /**
   * Get a specific app by ID
   */
  async getApp(appId: string): Promise<AppStoreAPIResponse<App>> {
    return this.request<App>(`/apps/${appId}`);
  }

  /**
   * Get featured apps
   */
  async getFeaturedApps(limit = 6): Promise<AppStoreAPIResponse<App[]>> {
    return this.request<App[]>(`/apps/featured?limit=${limit}`);
  }

  /**
   * Get trending apps
   */
  async getTrendingApps(limit = 5): Promise<AppStoreAPIResponse<App[]>> {
    return this.request<App[]>(`/apps/trending?limit=${limit}`);
  }

  /**
   * Get recommended apps for a user
   */
  async getRecommendedApps(
    userId: string,
    limit = 3
  ): Promise<AppStoreAPIResponse<App[]>> {
    return this.request<App[]>(`/apps/recommended/${userId}?limit=${limit}`);
  }

  /**
   * Search apps with suggestions
   */
  async searchApps(
    query: string,
    limit = 10
  ): Promise<AppStoreAPIResponse<{ apps: App[]; suggestions: string[] }>> {
    return this.request<{ apps: App[]; suggestions: string[] }>(
      `/apps/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

  /**
   * Get app categories
   */
  async getCategories(): Promise<AppStoreAPIResponse<string[]>> {
    return this.request<string[]>('/categories');
  }

  /**
   * Install an app
   */
  async installApp(appId: string): Promise<AppStoreAPIResponse<{ success: boolean; downloadUrl?: string }>> {
    return this.request<{ success: boolean; downloadUrl?: string }>(
      `/apps/${appId}/install`,
      {
        method: 'POST',
      }
    );
  }

  /**
   * Uninstall an app
   */
  async uninstallApp(appId: string): Promise<AppStoreAPIResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(
      `/apps/${appId}/uninstall`,
      {
        method: 'POST',
      }
    );
  }

  /**
   * Get app reviews
   */
  async getAppReviews(
    appId: string,
    page = 1,
    limit = 10
  ): Promise<AppStoreAPIResponse<{ reviews: Review[]; pagination: AppStorePagination }>> {
    return this.request<{ reviews: Review[]; pagination: AppStorePagination }>(
      `/apps/${appId}/reviews?page=${page}&limit=${limit}`
    );
  }

  /**
   * Submit a review
   */
  async submitReview(
    appId: string,
    review: Omit<Review, 'id' | 'appId' | 'createdAt' | 'updatedAt'>
  ): Promise<AppStoreAPIResponse<Review>> {
    return this.request<Review>(
      `/apps/${appId}/reviews`,
      {
        method: 'POST',
        body: JSON.stringify(review),
      }
    );
  }

  /**
   * Update a review
   */
  async updateReview(
    reviewId: string,
    review: Partial<Omit<Review, 'id' | 'appId' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<AppStoreAPIResponse<Review>> {
    return this.request<Review>(
      `/reviews/${reviewId}`,
      {
        method: 'PUT',
        body: JSON.stringify(review),
      }
    );
  }

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string): Promise<AppStoreAPIResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(
      `/reviews/${reviewId}`,
      {
        method: 'DELETE',
      }
    );
  }

  /**
   * Mark a review as helpful
   */
  async markReviewHelpful(reviewId: string): Promise<AppStoreAPIResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(
      `/reviews/${reviewId}/helpful`,
      {
        method: 'POST',
      }
    );
  }

  /**
   * Get user's wishlist
   */
  async getWishlist(userId: string): Promise<AppStoreAPIResponse<App[]>> {
    return this.request<App[]>(`/users/${userId}/wishlist`);
  }

  /**
   * Add app to wishlist
   */
  async addToWishlist(userId: string, appId: string): Promise<AppStoreAPIResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(
      `/users/${userId}/wishlist`,
      {
        method: 'POST',
        body: JSON.stringify({ appId }),
      }
    );
  }

  /**
   * Remove app from wishlist
   */
  async removeFromWishlist(userId: string, appId: string): Promise<AppStoreAPIResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(
      `/users/${userId}/wishlist/${appId}`,
      {
        method: 'DELETE',
      }
    );
  }

  /**
   * Get user's installed apps
   */
  async getInstalledApps(userId: string): Promise<AppStoreAPIResponse<App[]>> {
    return this.request<App[]>(`/users/${userId}/installed`);
  }

  /**
   * Get app statistics
   */
  async getAppStats(appId: string): Promise<AppStoreAPIResponse<{
    downloads: number;
    rating: number;
    reviewCount: number;
    popularity: number;
  }>> {
    return this.request<{
      downloads: number;
      rating: number;
      reviewCount: number;
      popularity: number;
    }>(`/apps/${appId}/stats`);
  }

  /**
   * Get app updates
   */
  async getAppUpdates(userId: string): Promise<AppStoreAPIResponse<App[]>> {
    return this.request<App[]>(`/users/${userId}/updates`);
  }

  /**
   * Update an app
   */
  async updateApp(appId: string): Promise<AppStoreAPIResponse<{ success: boolean; downloadUrl?: string }>> {
    return this.request<{ success: boolean; downloadUrl?: string }>(
      `/apps/${appId}/update`,
      {
        method: 'POST',
      }
    );
  }

  /**
   * Get app screenshots
   */
  async getAppScreenshots(appId: string): Promise<AppStoreAPIResponse<string[]>> {
    return this.request<string[]>(`/apps/${appId}/screenshots`);
  }

  /**
   * Get app requirements
   */
  async getAppRequirements(appId: string): Promise<AppStoreAPIResponse<{
    os: string;
    memory: string;
    storage: string;
    processor: string;
  }>> {
    return this.request<{
      os: string;
      memory: string;
      storage: string;
      processor: string;
    }>(`/apps/${appId}/requirements`);
  }

  /**
   * Report an app
   */
  async reportApp(
    appId: string,
    reason: string,
    description?: string
  ): Promise<AppStoreAPIResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(
      `/apps/${appId}/report`,
      {
        method: 'POST',
        body: JSON.stringify({ reason, description }),
      }
    );
  }

  /**
   * Get app analytics (for developers)
   */
  async getAppAnalytics(
    appId: string,
    startDate: string,
    endDate: string
  ): Promise<AppStoreAPIResponse<{
    downloads: { date: string; count: number }[];
    ratings: { date: string; average: number; count: number }[];
    reviews: { date: string; count: number }[];
  }>> {
    return this.request<{
      downloads: { date: string; count: number }[];
      ratings: { date: string; average: number; count: number }[];
      reviews: { date: string; count: number }[];
    }>(`/apps/${appId}/analytics?start=${startDate}&end=${endDate}`);
  }
}

// Export a singleton instance
export const appStoreService = new AppStoreService();
export default appStoreService;
