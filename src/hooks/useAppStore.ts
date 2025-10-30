import { useState, useMemo, useCallback } from 'react';
import type { App, Review, AppStoreState } from '@/types/appstore';

export const useAppStore = (initialApps: App[] = []) => {
  const [apps, setApps] = useState<App[]>(initialApps);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'date' | 'downloads'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [installedApps, setInstalledApps] = useState<Set<string>>(new Set());
  const [isInstalling, setIsInstalling] = useState<Set<string>>(new Set());
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(apps.map(app => app.category)))];
  }, [apps]);

  const filteredApps = useMemo(() => {
    const filtered = apps.filter(app => {
      const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort apps
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (sortBy) {
        case 'name':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'date':
          const aDate = a.releaseDate instanceof Date ? a.releaseDate.getTime() : 0;
          const bDate = b.releaseDate instanceof Date ? b.releaseDate.getTime() : 0;
          aValue = aDate;
          bValue = bDate;
          break;
        case 'downloads':
          aValue = a.downloads;
          bValue = b.downloads;
          break;
        default:
          aValue = a.title;
          bValue = b.title;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [apps, searchQuery, selectedCategory, sortBy, sortOrder]);

  const featuredApps = useMemo(() => {
    return apps.filter(app => app.featured);
  }, [apps]);

  const trendingApps = useMemo(() => {
    return apps
      .filter(app => app.downloads > 10000)
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 5);
  }, [apps]);

  const recommendedApps = useMemo(() => {
    // Simple recommendation algorithm based on category and rating
    return apps
      .filter(app => app.rating >= 4.5 && !installedApps.has(app.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [apps, installedApps]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleSortChange = useCallback((newSortBy: 'name' | 'price' | 'rating' | 'date' | 'downloads') => {
    setSortBy(newSortBy);
  }, []);

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const handleAppSelect = useCallback((app: App | null) => {
    setSelectedApp(app);
  }, []);

  const handleInstall = useCallback(async (app: App) => {
    setIsInstalling(prev => new Set(prev).add(app.id));
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate installation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setInstalledApps(prev => new Set(prev).add(app.id));
      
      // Update app status
      setApps(prev => prev.map(a => 
        a.id === app.id ? { ...a, status: 'installed' as const } : a
      ));
      
    } catch (err) {
      setError('Failed to install app');
    } finally {
      setIsInstalling(prev => {
        const newSet = new Set(prev);
        newSet.delete(app.id);
        return newSet;
      });
      setIsLoading(false);
    }
  }, []);

  const handleUninstall = useCallback(async (app: App) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate uninstallation process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInstalledApps(prev => {
        const newSet = new Set(prev);
        newSet.delete(app.id);
        return newSet;
      });
      
      // Update app status
      setApps(prev => prev.map(a => 
        a.id === app.id ? { ...a, status: 'available' as const } : a
      ));
      
    } catch (err) {
      setError('Failed to uninstall app');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleWishlistToggle = useCallback((app: App) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(app.id)) {
        newSet.delete(app.id);
      } else {
        newSet.add(app.id);
      }
      return newSet;
    });
  }, []);

  const handleReviewSubmit = useCallback(async (app: App, review: Omit<Review, 'id' | 'appId' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newReview: Review = {
        ...review,
        id: Date.now().toString(),
        appId: app.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setReviews(prev => [...prev, newReview]);
      
      // Update app rating (simple average calculation)
      const appReviews = [...reviews, newReview].filter(r => r.appId === app.id);
      const newRating = appReviews.reduce((sum, r) => sum + r.rating, 0) / appReviews.length;
      
      setApps(prev => prev.map(a => 
        a.id === app.id 
          ? { 
              ...a, 
              rating: Math.round(newRating * 10) / 10,
              reviewCount: appReviews.length
            } 
          : a
      ));
      
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  }, [reviews]);

  const handleReviewHelpful = useCallback((reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('name');
    setSortOrder('asc');
  }, []);

  const getAppById = useCallback((id: string) => {
    return apps.find(app => app.id === id);
  }, [apps]);

  const getAppReviews = useCallback((appId: string) => {
    return reviews.filter(review => review.appId === appId);
  }, [reviews]);

  const isAppInstalled = useCallback((appId: string) => {
    return installedApps.has(appId);
  }, [installedApps]);

  const isAppWishlisted = useCallback((appId: string) => {
    return wishlist.has(appId);
  }, [wishlist]);

  const isAppInstalling = useCallback((appId: string) => {
    return isInstalling.has(appId);
  }, [isInstalling]);

  const state: AppStoreState = {
    apps,
    filteredApps,
    selectedCategory,
    searchQuery,
    sortBy,
    sortOrder,
    selectedApp,
    wishlist,
    installedApps,
    reviews,
    isLoading,
    error,
  };

  return {
    // State
    ...state,
    categories,
    featuredApps,
    trendingApps,
    recommendedApps,
    
    // Actions
    handleSearch,
    handleCategorySelect,
    handleSortChange,
    handleSortOrderToggle,
    handleAppSelect,
    handleInstall,
    handleUninstall,
    handleWishlistToggle,
    handleReviewSubmit,
    handleReviewHelpful,
    clearFilters,
    
    // Utilities
    getAppById,
    getAppReviews,
    isAppInstalled,
    isAppWishlisted,
    isAppInstalling,
    
    // Setters
    setApps,
    setReviews,
    setError,
  };
};
