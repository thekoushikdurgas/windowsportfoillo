// Portfolio Hook
// Custom hook for managing portfolio data and state

import { useState, useEffect, useMemo } from 'react';
import { UsePortfolioReturn, Project } from '@/types/portfolio';
import { logger } from '@/lib/logger';

interface RepositoryData {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  topics: string[];
  visibility: string;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  } | null;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
}

interface LanguagesData {
  [language: string]: number;
}
import { projects, categories, getProjectsByCategory, searchProjects, getProjectsByTechnology, getProjectById } from '@/data/projects';
import { workExperience } from '@/data/workExperience';
import { education } from '@/data/education';
import { certifications } from '@/data/certifications';
import { skills } from '@/data/skills';
import { personalInfo } from '@/data/personalInfo';
import { githubApi } from '@/services/githubApi';

export const usePortfolio = (selectedCategory = 'all', searchQuery = ''): UsePortfolioReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repositoryData, setRepositoryData] = useState<Record<string, Partial<RepositoryData>>>({});

  // Fetch GitHub data for projects
  useEffect(() => {
    const fetchGitHubData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const githubUrls = projects
          .filter(project => project.githubUrl && project.githubUrl !== '#')
          .map(project => project.githubUrl);

        const stats = await Promise.allSettled(
          githubUrls.map(async (url) => {
            try {
              const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
              if (!match) return null;

              const [, owner = '', repo = ''] = match;
              if (!owner || !repo) return null;
              
              const repoData = await githubApi.getRepository(owner, repo);
              const languages = await githubApi.getRepositoryLanguages(owner, repo);
              
              return {
                url,
                data: {
                  ...repoData,
                  stargazers_count: repoData.stargazers_count ?? 0,
                  forks_count: repoData.forks_count ?? 0,
                  languages: languages ?? {},
                  updated_at: repoData.updated_at ?? '',
                  description: repoData.description ?? ''
                } as Partial<RepositoryData>
              };
            } catch (error) {
              logger.error(`Failed to fetch data for ${url}`, { error, url });
              return null;
            }
          })
        );

        const data: Record<string, Partial<RepositoryData>> = {};
        stats.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            data[result.value.url] = result.value.data;
          }
        });

        setRepositoryData(data);
      } catch (error) {
        logger.error('Failed to fetch GitHub data', { error });
        setError('Failed to load repository data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  // Filter projects based on category and search query
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = getProjectsByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = searchProjects(searchQuery).filter(project => 
        filtered.some(p => p.id === project.id)
      );
    }

    // Enhance projects with GitHub data
    return filtered.map(project => ({
      ...project,
      metrics: {
        ...project.metrics,
        ...(repositoryData[project.githubUrl] || {})
      }
    }));
  }, [selectedCategory, searchQuery, repositoryData]);

  // Helper functions
  const searchProjectsFn = (query: string): Project[] => {
    return searchProjects(query);
  };

  const filterByCategory = (category: string): Project[] => {
    return getProjectsByCategory(category);
  };

  const getProjectByIdFn = (id: string): Project | undefined => {
    return getProjectById(id);
  };

  const getProjectsByTechnologyFn = (technology: string): Project[] => {
    return getProjectsByTechnology(technology);
  };

  return {
    filteredProjects,
    categories,
    workExperience,
    education,
    certifications,
    skills,
    personalInfo,
    isLoading,
    error,
    searchProjects: searchProjectsFn,
    filterByCategory,
    getProjectById: getProjectByIdFn,
    getProjectsByTechnology: getProjectsByTechnologyFn
  };
};

// Hook for managing portfolio filters and view state
export const usePortfolioFilters = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setViewMode('grid');
    setSelectedProject(null);
  };

  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    selectedProject,
    setSelectedProject,
    resetFilters
  };
};

// Hook for GitHub data management
export const useGitHubData = () => {
  const [repositoryData, setRepositoryData] = useState<Record<string, Partial<RepositoryData>>>({});
  const [languagesData, setLanguagesData] = useState<Record<string, LanguagesData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepository = async (owner: string, repo: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await githubApi.getRepository(owner, repo);
      setRepositoryData(prev => ({
        ...prev,
        [`${owner}/${repo}`]: data as Partial<RepositoryData>
      }));
    } catch (error) {
      logger.error('Failed to fetch repository', { error, owner, repo });
      setError(error instanceof Error ? error.message : 'Failed to fetch repository');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLanguages = async (owner: string, repo: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await githubApi.getRepositoryLanguages(owner, repo);
      setLanguagesData(prev => ({
        ...prev,
        [`${owner}/${repo}`]: data
      }));
    } catch (error) {
      logger.error('Failed to fetch languages', { error, owner, repo });
      setError(error instanceof Error ? error.message : 'Failed to fetch languages');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    repositoryData,
    languagesData,
    isLoading,
    error,
    fetchRepository,
    fetchLanguages
  };
};

// Hook for project statistics
export const useProjectStats = (projects: Project[]) => {
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;
    
    const totalStars = projects.reduce((sum, p) => sum + (p.metrics?.stars || 0), 0);
    const totalForks = projects.reduce((sum, p) => sum + (p.metrics?.forks || 0), 0);
    
    const technologies = [...new Set(projects.flatMap(p => p.technologies))];
    const categories = [...new Set(projects.map(p => p.category))];
    
    const averageDifficulty = projects.reduce((sum, p) => {
      const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3 };
      return sum + (difficultyMap[p.difficulty] || 0);
    }, 0) / totalProjects;

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      totalStars,
      totalForks,
      technologies: technologies.length,
      categories: categories.length,
      averageDifficulty: Math.round(averageDifficulty * 10) / 10
    };
  }, [projects]);

  return stats;
};

// Hook for skills analysis
export const useSkillsAnalysis = (projects: Project[]) => {
  const skillsAnalysis = useMemo(() => {
    const skillUsage: Record<string, number> = {};
    const skillCategories: Record<string, string[]> = {};

    projects.forEach(project => {
      project.technologies.forEach(tech => {
        skillUsage[tech] = (skillUsage[tech] || 0) + 1;
        
        // Categorize skills
        const skill = skills.find(s => s.name === tech);
        if (skill) {
          const category = skill.category;
          if (category && !skillCategories[category]) {
            skillCategories[category] = [];
          }
          if (category && !skillCategories[category]?.includes(tech)) {
            skillCategories[category]?.push(tech);
          }
        }
      });
    });

    const mostUsedSkills = Object.entries(skillUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    return {
      skillUsage,
      skillCategories,
      mostUsedSkills,
      totalUniqueSkills: Object.keys(skillUsage).length
    };
  }, [projects]);

  return skillsAnalysis;
};
