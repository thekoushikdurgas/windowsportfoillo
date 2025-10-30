// Portfolio Store
// Zustand store for managing portfolio state

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { PortfolioStore, Project } from '@/types/portfolio';

interface PortfolioState extends PortfolioStore {
  // Additional state
  projects: Project[];
  categories: string[];
  searchHistory: string[];
  favoriteProjects: string[];
  
  // Additional actions
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  toggleFavoriteProject: (projectId: string) => void;
  setProjects: (projects: Project[]) => void;
  setCategories: (categories: string[]) => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        selectedCategory: 'all',
        searchQuery: '',
        viewMode: 'grid',
        selectedProject: null,
        isLoading: false,
        projects: [],
        categories: [],
        searchHistory: [],
        favoriteProjects: [],

        // Actions
        setSelectedCategory: (category) => 
          set({ selectedCategory: category }, false, 'setSelectedCategory'),

        setSearchQuery: (query) => 
          set({ searchQuery: query }, false, 'setSearchQuery'),

        setViewMode: (mode) => 
          set({ viewMode: mode }, false, 'setViewMode'),

        setSelectedProject: (project) => 
          set({ selectedProject: project }, false, 'setSelectedProject'),

        setIsLoading: (loading) => 
          set({ isLoading: loading }, false, 'setIsLoading'),

        resetFilters: () => 
          set({
            selectedCategory: 'all',
            searchQuery: '',
            viewMode: 'grid',
            selectedProject: null
          }, false, 'resetFilters'),

        addToSearchHistory: (query) => 
          set((state) => {
            const trimmedQuery = query.trim();
            if (!trimmedQuery || state.searchHistory.includes(trimmedQuery)) {
              return state;
            }
            
            const newHistory = [trimmedQuery, ...state.searchHistory].slice(0, 10);
            return { searchHistory: newHistory };
          }, false, 'addToSearchHistory'),

        clearSearchHistory: () => 
          set({ searchHistory: [] }, false, 'clearSearchHistory'),

        toggleFavoriteProject: (projectId) => 
          set((state) => {
            const isFavorite = state.favoriteProjects.includes(projectId);
            const newFavorites = isFavorite
              ? state.favoriteProjects.filter(id => id !== projectId)
              : [...state.favoriteProjects, projectId];
            
            return { favoriteProjects: newFavorites };
          }, false, 'toggleFavoriteProject'),

        setProjects: (projects) => 
          set({ projects }, false, 'setProjects'),

        setCategories: (categories) => 
          set({ categories }, false, 'setCategories'),
      }),
      {
        name: 'portfolio-store',
        partialize: (state) => ({
          selectedCategory: state.selectedCategory,
          viewMode: state.viewMode,
          searchHistory: state.searchHistory,
          favoriteProjects: state.favoriteProjects,
        }),
      }
    ),
    {
      name: 'portfolio-store',
    }
  )
);

// Selectors for better performance
export const usePortfolioFilters = () => usePortfolioStore((state) => ({
  selectedCategory: state.selectedCategory,
  searchQuery: state.searchQuery,
  viewMode: state.viewMode,
  selectedProject: state.selectedProject,
  favoriteProjects: state.favoriteProjects,
  toggleFavoriteProject: state.toggleFavoriteProject,
  setSelectedCategory: state.setSelectedCategory,
  setSearchQuery: state.setSearchQuery,
  setViewMode: state.setViewMode,
  setSelectedProject: state.setSelectedProject,
  resetFilters: state.resetFilters,
}));

export const usePortfolioData = () => usePortfolioStore((state) => ({
  projects: state.projects,
  categories: state.categories,
  isLoading: state.isLoading,
  setProjects: state.setProjects,
  setCategories: state.setCategories,
  setIsLoading: state.setIsLoading,
}));

export const usePortfolioSearch = () => usePortfolioStore((state) => ({
  searchQuery: state.searchQuery,
  searchHistory: state.searchHistory,
  setSearchQuery: state.setSearchQuery,
  addToSearchHistory: state.addToSearchHistory,
  clearSearchHistory: state.clearSearchHistory,
}));

export const usePortfolioFavorites = () => usePortfolioStore((state) => ({
  favoriteProjects: state.favoriteProjects,
  toggleFavoriteProject: state.toggleFavoriteProject,
}));

// Derived selectors
export const useFilteredProjects = (projects: Project[]) => {
  return usePortfolioStore((state) => {
    let filtered = projects;

    // Filter by category
    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === state.selectedCategory);
    }

    // Filter by search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query))
      );
    }

    // Sort by favorite projects first
    if (state.favoriteProjects.length > 0) {
      filtered = filtered.sort((a, b) => {
        const aIsFavorite = state.favoriteProjects.includes(a.id);
        const bIsFavorite = state.favoriteProjects.includes(b.id);
        
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
        return 0;
      });
    }

    return filtered;
  });
};

export const usePortfolioStats = () => {
  return usePortfolioStore((state) => {
    const totalProjects = state.projects.length;
    const completedProjects = state.projects.filter(p => p.status === 'completed').length;
    const inProgressProjects = state.projects.filter(p => p.status === 'in-progress').length;
    const favoriteCount = state.favoriteProjects.length;
    
    const totalStars = state.projects.reduce((sum, p) => sum + (p.metrics?.stars || 0), 0);
    const totalForks = state.projects.reduce((sum, p) => sum + (p.metrics?.forks || 0), 0);
    
    const technologies = [...new Set(state.projects.flatMap(p => p.technologies))];
    const categories = [...new Set(state.projects.map(p => p.category))];

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      favoriteCount,
      totalStars,
      totalForks,
      uniqueTechnologies: technologies.length,
      uniqueCategories: categories.length,
    };
  });
};
