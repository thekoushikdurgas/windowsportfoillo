// GitHub API Service
// Service for fetching real-time repository data from GitHub API

import { 
  GitHubRepositoryResponse, 
  GitHubLanguagesResponse, 
  GitHubApiError
} from '@/types/portfolio';
import { logger } from '@/lib/logger';

class GitHubApiService {
  private baseUrl = 'https://api.github.com';
  private token: string | undefined;
  private rateLimitRemaining = 5000;
  private rateLimitReset = 0;

  constructor() {
    // In a real application, this would come from environment variables
    this.token = process.env['NEXT_PUBLIC_GITHUB_TOKEN'];
  }

  private async makeRequest<T>(url: string): Promise<T> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'DurgasOS-Portfolio'
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${url}`, { headers });
      
      // Handle rate limiting
      if (response.status === 403) {
        const resetTime = response.headers.get('X-RateLimit-Reset');
        if (resetTime) {
          this.rateLimitReset = parseInt(resetTime) * 1000;
        }
        throw new Error('GitHub API rate limit exceeded');
      }

      if (!response.ok) {
        const errorData: GitHubApiError = await response.json();
        throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
      }

      // Update rate limit info
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const reset = response.headers.get('X-RateLimit-Reset');
      
      if (remaining) {
        this.rateLimitRemaining = parseInt(remaining);
      }
      if (reset) {
        this.rateLimitReset = parseInt(reset) * 1000;
      }

      return response.json();
    } catch (error) {
      logger.error('GitHub API request failed', { error, url, method: 'GET' });
      throw error;
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepositoryResponse> {
    try {
      const data = await this.makeRequest<GitHubRepositoryResponse>(`/repos/${owner}/${repo}`);
      return data;
    } catch (error) {
      logger.error(`Failed to fetch repository ${owner}/${repo}`, { error, owner, repo });
      throw error;
    }
  }

  async getRepositoryLanguages(owner: string, repo: string): Promise<GitHubLanguagesResponse> {
    try {
      const data = await this.makeRequest<GitHubLanguagesResponse>(`/repos/${owner}/${repo}/languages`);
      return data;
    } catch (error) {
      logger.error(`Failed to fetch languages for ${owner}/${repo}`, { error, owner, repo });
      throw error;
    }
  }

  async getRepositoryTopics(owner: string, repo: string): Promise<string[]> {
    try {
      const data = await this.makeRequest<{ names: string[] }>(`/repos/${owner}/${repo}/topics`);
      return data.names;
    } catch (error) {
      logger.error(`Failed to fetch topics for ${owner}/${repo}`, { error, owner, repo });
      return [];
    }
  }

  async getRepositoryCommits(owner: string, repo: string, perPage = 100): Promise<number> {
    try {
      const data = await this.makeRequest<Array<{ sha: string; commit: { message: string } }>>(`/repos/${owner}/${repo}/commits?per_page=${perPage}`);
      return data.length;
    } catch (error) {
      logger.error(`Failed to fetch commits for ${owner}/${repo}`, { error, owner, repo });
      return 0;
    }
  }

  async getRepositoryStats(owner: string, repo: string): Promise<{
    stars: number;
    forks: number;
    commits: number;
    languages: Record<string, number>;
    topics: string[];
    lastUpdated: string;
  }> {
    try {
      const [repoData, languages, topics, commits] = await Promise.all([
        this.getRepository(owner, repo),
        this.getRepositoryLanguages(owner, repo),
        this.getRepositoryTopics(owner, repo),
        this.getRepositoryCommits(owner, repo)
      ]);

      return {
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        commits,
        languages,
        topics,
        lastUpdated: repoData.updated_at
      };
    } catch (error) {
      logger.error(`Failed to fetch stats for ${owner}/${repo}`, { error, owner, repo });
      throw error;
    }
  }

  async getUserRepositories(username: string, perPage = 100): Promise<GitHubRepositoryResponse[]> {
    try {
      const data = await this.makeRequest<GitHubRepositoryResponse[]>(`/users/${username}/repos?per_page=${perPage}&sort=updated`);
      return data;
    } catch (error) {
      logger.error(`Failed to fetch repositories for user ${username}`, { error, username });
      throw error;
    }
  }

  getRateLimitInfo(): { remaining: number; reset: number } {
    return {
      remaining: this.rateLimitRemaining,
      reset: this.rateLimitReset
    };
  }

  isRateLimited(): boolean {
    return this.rateLimitRemaining <= 0 && Date.now() < this.rateLimitReset;
  }

  getTimeUntilReset(): number {
    return Math.max(0, this.rateLimitReset - Date.now());
  }
}

// Create singleton instance
export const githubApi = new GitHubApiService();

// Helper functions for common operations
export const fetchProjectStats = async (githubUrl: string): Promise<{
  stars: number;
  forks: number;
  commits: number;
  languages: Record<string, number>;
  topics: string[];
  lastUpdated: string;
} | null> => {
  try {
    // Extract owner and repo from GitHub URL
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL');
    }

    const [, owner, repo] = match;
    if (!owner || !repo) {
      throw new Error('Invalid GitHub URL: owner and repo required');
    }
    return await githubApi.getRepositoryStats(owner, repo);
  } catch (error) {
    logger.error('Failed to fetch project stats', { error });
    return null;
  }
};

export const fetchAllProjectStats = async (githubUrls: string[]): Promise<Record<string, {
  stars: number;
  forks: number;
  commits: number;
  languages: Record<string, number>;
  topics: string[];
  lastUpdated: string;
} | null>> => {
  const stats: Record<string, {
    stars: number;
    forks: number;
    commits: number;
    languages: Record<string, number>;
    topics: string[];
    lastUpdated: string;
  } | null> = {};
  
  // Process in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < githubUrls.length; i += batchSize) {
    const batch = githubUrls.slice(i, i + batchSize);
    const promises = batch.map(async (url) => {
      const stats = await fetchProjectStats(url);
      return { url, stats };
    });

    const results = await Promise.allSettled(promises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        stats[result.value.url] = result.value.stats;
      }
    });

    // Add delay between batches to respect rate limits
    if (i + batchSize < githubUrls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return stats;
};

// Cache for storing API responses
class GitHubCache {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

  set(key: string, data: unknown, ttl: number = 5 * 60 * 1000): void { // 5 minutes default TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

export const githubCache = new GitHubCache();
