export interface App {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  screenshots: string[];
  price: number;
  category: string;
  rating: number;
  reviewCount: number;
  downloads: number;
  size: string;
  version: string;
  developer: string;
  requirements: SystemRequirements;
  features: string[];
  tags: string[];
  releaseDate: Date;
  lastUpdated: Date;
  status: 'available' | 'installing' | 'installed' | 'updating';
  featured?: boolean;
}

export interface SystemRequirements {
  os: string;
  memory: string;
  storage: string;
  processor: string;
}

export interface Review {
  id: string;
  userId: string;
  appId: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
  userAvatar?: string;
}

export interface AppFilters {
  category?: string;
  searchQuery?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'date' | 'downloads';
  sortOrder?: 'asc' | 'desc';
}

export interface AppStoreState {
  apps: App[];
  filteredApps: App[];
  selectedCategory: string;
  searchQuery: string;
  sortBy: 'name' | 'price' | 'rating' | 'date' | 'downloads';
  sortOrder: 'asc' | 'desc';
  selectedApp: App | null;
  wishlist: Set<string>;
  installedApps: Set<string>;
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

export interface AppStoreProps {
  onAppInstall?: (app: App) => void;
  onAppOpen?: (app: App) => void;
  onAppReview?: (app: App, review: Review) => void;
  onAppWishlist?: (app: App) => void;
}

export interface AppCardProps {
  app: App;
  onInstall: (app: App) => void;
  onOpen: (app: App) => void;
  onWishlist: (app: App) => void;
  isInstalled: boolean;
  isWishlisted: boolean;
}

export interface AppDetailsModalProps {
  app: App | null;
  isOpen: boolean;
  onClose: () => void;
  onInstall: (app: App) => void;
  onWishlist: (app: App) => void;
  isInstalled: boolean;
  isWishlisted: boolean;
  reviews: Review[];
  onReview: (app: App, review: Omit<Review, 'id' | 'appId' | 'createdAt' | 'updatedAt'>) => void;
}

export interface ReviewCardProps {
  review: Review;
  onHelpful: (reviewId: string) => void;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  suggestions: string[];
}

export interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export interface SortControlsProps {
  sortBy: 'name' | 'price' | 'rating' | 'date' | 'downloads';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'name' | 'price' | 'rating' | 'date' | 'downloads') => void;
  onOrderChange: (order: 'asc' | 'desc') => void;
}
