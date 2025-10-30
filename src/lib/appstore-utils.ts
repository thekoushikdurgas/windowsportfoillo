import type { App, Review, AppFilters } from '@/types/appstore';

/**
 * Formats a price value into a display string
 */
export const formatPrice = (price: number): string => {
  return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
};

/**
 * Formats a file size in bytes to a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formats a number with commas for thousands
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Calculates the average rating from an array of reviews
 */
export const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

/**
 * Generates a color based on rating value
 */
export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return 'text-green-500';
  if (rating >= 4.0) return 'text-yellow-500';
  if (rating >= 3.0) return 'text-orange-500';
  return 'text-red-500';
};

/**
 * Generates a background color based on rating value
 */
export const getRatingBgColor = (rating: number): string => {
  if (rating >= 4.5) return 'bg-green-100 dark:bg-green-900';
  if (rating >= 4.0) return 'bg-yellow-100 dark:bg-yellow-900';
  if (rating >= 3.0) return 'bg-orange-100 dark:bg-orange-900';
  return 'bg-red-100 dark:bg-red-900';
};

/**
 * Filters apps based on search criteria
 */
export const filterApps = (apps: App[], filters: AppFilters): App[] => {
  return apps.filter(app => {
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        app.title.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.tags.some(tag => tag.toLowerCase().includes(query)) ||
        app.developer.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (app.category !== filters.category) return false;
    }
    
    // Price range filter
    if (filters.priceRange) {
      if (app.price < filters.priceRange.min || app.price > filters.priceRange.max) {
        return false;
      }
    }
    
    // Rating filter
    if (filters.rating) {
      if (app.rating < filters.rating) return false;
    }
    
    return true;
  });
};

/**
 * Sorts apps based on criteria
 */
export const sortApps = (apps: App[], sortBy: string, sortOrder: 'asc' | 'desc'): App[] => {
  return [...apps].sort((a, b) => {
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
};

/**
 * Generates search suggestions based on app data
 */
export const generateSearchSuggestions = (apps: App[], query: string): string[] => {
  if (!query || query.length < 2) return [];
  
  const suggestions = new Set<string>();
  const lowerQuery = query.toLowerCase();
  
  apps.forEach(app => {
    // Add app titles that match
    if (app.title.toLowerCase().includes(lowerQuery)) {
      suggestions.add(app.title);
    }
    
    // Add categories that match
    if (app.category.toLowerCase().includes(lowerQuery)) {
      suggestions.add(app.category);
    }
    
    // Add developers that match
    if (app.developer.toLowerCase().includes(lowerQuery)) {
      suggestions.add(app.developer);
    }
    
    // Add tags that match
    app.tags.forEach(tag => {
      if (tag.toLowerCase().includes(lowerQuery)) {
        suggestions.add(tag);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 5);
};

/**
 * Calculates app popularity score based on downloads and rating
 */
export const calculatePopularityScore = (app: App): number => {
  const downloadScore = Math.log10(app.downloads + 1) * 10;
  const ratingScore = app.rating * 20;
  return Math.round(downloadScore + ratingScore);
};

/**
 * Groups apps by category
 */
export const groupAppsByCategory = (apps: App[]): Record<string, App[]> => {
  return apps.reduce((groups, app) => {
    const category = app.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(app);
    return groups;
  }, {} as Record<string, App[]>);
};

/**
 * Gets trending apps based on recent downloads and ratings
 */
export const getTrendingApps = (apps: App[], limit = 5): App[] => {
  return apps
    .filter(app => app.downloads > 1000)
    .sort((a, b) => {
      const aScore = calculatePopularityScore(a);
      const bScore = calculatePopularityScore(b);
      return bScore - aScore;
    })
    .slice(0, limit);
};

/**
 * Gets recommended apps based on user preferences and similar apps
 */
export const getRecommendedApps = (
  apps: App[], 
  installedApps: Set<string>, 
  wishlist: Set<string>,
  limit = 3
): App[] => {
  return apps
    .filter(app => 
      !installedApps.has(app.id) && 
      !wishlist.has(app.id) && 
      app.rating >= 4.0
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

/**
 * Validates app data
 */
export const validateApp = (app: Partial<App>): string[] => {
  const errors: string[] = [];
  
  if (!app.title || app.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!app.description || app.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (!app.category || app.category.trim().length === 0) {
    errors.push('Category is required');
  }
  
  if (app.price === undefined || app.price < 0) {
    errors.push('Price must be a non-negative number');
  }
  
  if (app.rating === undefined || app.rating < 0 || app.rating > 5) {
    errors.push('Rating must be between 0 and 5');
  }
  
  if (!app.developer || app.developer.trim().length === 0) {
    errors.push('Developer is required');
  }
  
  if (!app.version || app.version.trim().length === 0) {
    errors.push('Version is required');
  }
  
  return errors;
};

/**
 * Validates review data
 */
export const validateReview = (review: Partial<Review>): string[] => {
  const errors: string[] = [];
  
  if (!review.title || review.title.trim().length === 0) {
    errors.push('Review title is required');
  }
  
  if (!review.content || review.content.trim().length === 0) {
    errors.push('Review content is required');
  }
  
  if (review.rating === undefined || review.rating < 1 || review.rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }
  
  if (!review.userName || review.userName.trim().length === 0) {
    errors.push('User name is required');
  }
  
  return errors;
};

/**
 * Debounces a function call
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttles a function call
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Truncates text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substr(0, maxLength)}...`;
};

/**
 * Capitalizes the first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Converts a string to a URL-friendly slug
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
