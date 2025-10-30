'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Star, GitFork, Calendar, Code, TrendingUp } from 'lucide-react';
import { githubService, type GitHubStats as GitHubStatsData } from '@/services/github-service';

interface GitHubStatsProps {
  className?: string;
}

export function GitHubStats({ className = '' }: GitHubStatsProps) {
  const [stats, setStats] = useState<GitHubStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await githubService.getStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            GitHub Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            GitHub Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {error || 'Unable to load GitHub statistics'}
            </p>
            <Button 
              onClick={() => window.open('https://github.com/thekoushikdurgas', '_blank')}
              variant="outline"
            >
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { profile, repositories, totalStars, totalForks, languages } = stats;
  const recentRepos = githubService.getRecentActivity(repositories);
  const topLanguages = Object.entries(languages).slice(0, 5);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Profile
            </span>
            <Button 
              onClick={() => window.open(profile.html_url, '_blank')}
              variant="outline"
              size="sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Profile
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Image 
              src={profile.avatar_url} 
              alt={profile.name || profile.login}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-lg">{profile.name || profile.login}</h3>
              <p className="text-gray-600 dark:text-gray-400">@{profile.login}</p>
              {profile.bio && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{profile.bio}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profile.public_repos}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalStars}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Stars</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalForks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Forks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{profile.followers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Top Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topLanguages.map(([language, count], index) => (
              <div key={language} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}></div>
                  <span className="font-medium">{language}</span>
                </div>
                <Badge variant="outline">{count} repos</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRepos.slice(0, 5).map((repo) => (
              <div key={repo.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{repo.name}</h4>
                    {repo.language && (
                      <Badge variant="outline" className="text-xs">{repo.language}</Badge>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      {repo.forks_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {githubService.getTimeSinceLastActivity(repo.updated_at)}
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={() => window.open(repo.html_url, '_blank')}
                  variant="ghost"
                  size="sm"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contribution Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Contribution Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <Image 
              src={githubService.getContributionGraphImageUrl()}
              alt="GitHub Contribution Graph"
              width={800}
              height={200}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Contribution activity over the past year
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
