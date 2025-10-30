// GitHub Service
// Fetches GitHub profile data and statistics

export interface GitHubProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  visibility: string;
  fork: boolean;
}

export interface GitHubStats {
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  languages: Record<string, number>;
  repositories: GitHubRepository[];
  profile: GitHubProfile;
}

export class GitHubService {
  private username: string;
  private baseUrl = 'https://api.github.com';

  constructor(username = 'thekoushikdurgas') {
    this.username = username;
  }

  /**
   * Fetch GitHub profile information
   */
  async getProfile(): Promise<GitHubProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${this.username}`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch GitHub profile. Please check your internet connection.');
    }
  }

  /**
   * Fetch user repositories
   */
  async getRepositories(): Promise<GitHubRepository[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${this.username}/repos?sort=updated&per_page=100`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch GitHub repositories. Please check your internet connection.');
    }
  }

  /**
   * Get comprehensive GitHub statistics
   */
  async getStats(): Promise<GitHubStats> {
    try {
      const [profile, repositories] = await Promise.all([
        this.getProfile(),
        this.getRepositories()
      ]);

      // Calculate statistics
      const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
      
      // Calculate language usage
      const languages: Record<string, number> = {};
      repositories.forEach(repo => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });

      // Sort languages by usage
      const sortedLanguages = Object.entries(languages)
        .sort(([,a], [,b]) => b - a)
        .reduce((acc, [lang, count]) => {
          acc[lang] = count;
          return acc;
        }, {} as Record<string, number>);

      return {
        totalStars,
        totalForks,
        totalCommits: 0, // Would need additional API calls to get accurate commit count
        languages: sortedLanguages,
        repositories: repositories.filter(repo => !repo.fork), // Exclude forked repositories
        profile
      };
    } catch (error) {
      throw new Error('Failed to fetch GitHub statistics. Please try again later.');
    }
  }

  /**
   * Get contribution graph URL
   */
  getContributionGraphUrl(): string {
    return `https://github.com/${this.username}`;
  }

  /**
   * Get contribution graph image URL
   */
  getContributionGraphImageUrl(): string {
    return `https://github-readme-activity-graph.vercel.app/graph?username=${this.username}&theme=react&area=true&hide_border=true`;
  }

  /**
   * Get GitHub stats card URL
   */
  getStatsCardUrl(): string {
    return `https://github-readme-stats.vercel.app/api?username=${this.username}&show_icons=true&theme=react&hide_border=true&count_private=true`;
  }

  /**
   * Get top languages card URL
   */
  getTopLanguagesCardUrl(): string {
    return `https://github-readme-stats.vercel.app/api/top-languages/?username=${this.username}&layout=compact&theme=react&hide_border=true`;
  }

  /**
   * Get streak stats card URL
   */
  getStreakStatsCardUrl(): string {
    return `https://github-readme-streak-stats.herokuapp.com/?user=${this.username}&theme=react&hide_border=true`;
  }

  /**
   * Get repository count by language
   */
  getRepositoryCountByLanguage(repositories: GitHubRepository[]): Record<string, number> {
    const languageCount: Record<string, number> = {};
    
    repositories.forEach(repo => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    });

    return languageCount;
  }

  /**
   * Get recent activity (last 10 repositories)
   */
  getRecentActivity(repositories: GitHubRepository[]): GitHubRepository[] {
    return repositories
      .filter(repo => !repo.fork)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 10);
  }

  /**
   * Get most starred repositories
   */
  getMostStarredRepositories(repositories: GitHubRepository[]): GitHubRepository[] {
    return repositories
      .filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10);
  }

  /**
   * Format repository size
   */
  formatRepositorySize(size: number): string {
    if (size < 1024) {
      return `${size} KB`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} MB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} GB`;
    }
  }

  /**
   * Format date
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get time since last activity
   */
  getTimeSinceLastActivity(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }
}

// Export singleton instance
export const githubService = new GitHubService();
