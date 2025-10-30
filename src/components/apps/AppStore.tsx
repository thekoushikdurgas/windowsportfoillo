'use client';

import { useState, useMemo, useCallback } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Star, 
  Download, 
  Heart, 
  Filter, 
  SortAsc, 
  SortDesc,
  CheckCircle,
  Clock,
  Calendar,
  HardDrive,
  Cpu,
  MemoryStick
} from 'lucide-react';
import type { App, Review, AppStoreProps } from '@/types/appstore';

// Enhanced app data with comprehensive information
const apps: App[] = [
  {
    id: 'photo-editor',
    title: 'Photo Editor Pro',
    description: 'Professional photo editing tools with advanced filters, layers, and AI-powered enhancements. Perfect for photographers and designers.',
    shortDescription: 'Professional photo editing tools',
    image: PlaceHolderImages.find(p => p.id === 'app-store-1')?.imageUrl || '/placeholder-app-1.jpg',
    screenshots: [
      PlaceHolderImages.find(p => p.id === 'app-store-1')?.imageUrl || '/placeholder-app-1.jpg',
      PlaceHolderImages.find(p => p.id === 'app-store-2')?.imageUrl || '/placeholder-app-2.jpg',
      PlaceHolderImages.find(p => p.id === 'app-store-3')?.imageUrl || '/placeholder-app-3.jpg'
    ],
    price: 0,
    category: 'Graphics & Design',
    rating: 4.8,
    reviewCount: 1247,
    downloads: 50000,
    size: '45.2 MB',
    version: '2.5.0',
    developer: 'Creative Studio',
    requirements: {
      os: 'Windows 10+',
      memory: '4 GB RAM',
      storage: '100 MB',
      processor: 'Intel i3 or equivalent'
    },
    features: ['AI-powered filters', 'Layer support', 'Batch processing', 'RAW format support'],
    tags: ['photo', 'editing', 'design', 'ai'],
    releaseDate: new Date('2024-01-15'),
    lastUpdated: new Date('2024-03-20'),
    status: 'available',
    featured: true
  },
  {
    id: 'music-stream',
    title: 'Music Stream',
    description: 'Stream your favorite music with high-quality audio, offline downloads, and personalized playlists. Discover new artists and genres.',
    shortDescription: 'Stream your favorite music',
    image: PlaceHolderImages.find(p => p.id === 'app-store-2')?.imageUrl || '/placeholder-app-2.jpg',
    screenshots: [
      PlaceHolderImages.find(p => p.id === 'app-store-2')?.imageUrl || '/placeholder-app-2.jpg',
      PlaceHolderImages.find(p => p.id === 'app-store-3')?.imageUrl || '/placeholder-app-3.jpg',
      PlaceHolderImages.find(p => p.id === 'app-store-4')?.imageUrl || '/placeholder-app-4.jpg'
    ],
    price: 0,
    category: 'Music & Audio',
    rating: 4.6,
    reviewCount: 892,
    downloads: 75000,
    size: '32.1 MB',
    version: '3.2.1',
    developer: 'Media Corp',
    requirements: {
      os: 'Windows 10+',
      memory: '2 GB RAM',
      storage: '50 MB',
      processor: 'Intel i3 or equivalent'
    },
    features: ['High-quality streaming', 'Offline downloads', 'Personalized playlists', 'Social sharing'],
    tags: ['music', 'streaming', 'audio', 'entertainment'],
    releaseDate: new Date('2024-02-01'),
    lastUpdated: new Date('2024-03-15'),
    status: 'available',
    featured: true
  },
  {
    id: 'codepad',
    title: 'CodePad',
    description: 'Advanced code editor with syntax highlighting, IntelliSense, debugging tools, and support for 50+ programming languages.',
    shortDescription: 'Advanced code editor',
    image: PlaceHolderImages.find(p => p.id === 'app-store-3')?.imageUrl || '/placeholder-app-3.jpg',
    screenshots: [
      PlaceHolderImages.find(p => p.id === 'app-store-3')?.imageUrl || '/placeholder-app-3.jpg',
      PlaceHolderImages.find(p => p.id === 'app-store-4')?.imageUrl || '/placeholder-app-4.jpg',
      PlaceHolderImages.find(p => p.id === 'app-store-1')?.imageUrl || '/placeholder-app-1.jpg'
    ],
    price: 9.99,
    category: 'Development',
    rating: 4.9,
    reviewCount: 2156,
    downloads: 25000,
    size: '78.5 MB',
    version: '1.8.2',
    developer: 'Dev Tools Inc',
    requirements: {
      os: 'Windows 10+',
      memory: '8 GB RAM',
      storage: '200 MB',
      processor: 'Intel i5 or equivalent'
    },
    features: ['Syntax highlighting', 'IntelliSense', 'Debugging tools', 'Git integration'],
    tags: ['code', 'editor', 'development', 'programming'],
    releaseDate: new Date('2024-01-10'),
    lastUpdated: new Date('2024-03-25'),
    status: 'available',
    featured: false
  },
  {
    id: 'weather-now',
    title: 'Weather Now',
    description: 'Real-time weather updates with detailed forecasts, radar maps, and severe weather alerts. Stay informed about weather conditions.',
    shortDescription: 'Real-time weather updates',
    image: PlaceHolderImages.find(p => p.id === 'app-store-4')?.imageUrl || '/placeholder-app-4.jpg',
    screenshots: [
      PlaceHolderImages.find(p => p.id === 'app-store-4')?.imageUrl || '/placeholder-app-4.jpg',
      PlaceHolderImages.find(p => p.id === 'app-store-1')?.imageUrl || '/placeholder-app-1.jpg',
      PlaceHolderImages.find(p => p.id === 'app-store-2')?.imageUrl || '/placeholder-app-2.jpg'
    ],
    price: 0,
    category: 'Weather',
    rating: 4.4,
    reviewCount: 634,
    downloads: 40000,
    size: '18.7 MB',
    version: '1.4.5',
    developer: 'Weather Solutions',
    requirements: {
      os: 'Windows 10+',
      memory: '1 GB RAM',
      storage: '25 MB',
      processor: 'Intel i3 or equivalent'
    },
    features: ['Real-time updates', 'Radar maps', 'Severe weather alerts', 'Multiple locations'],
    tags: ['weather', 'forecast', 'radar', 'alerts'],
    releaseDate: new Date('2024-02-15'),
    lastUpdated: new Date('2024-03-18'),
    status: 'available',
    featured: false
  },
  {
    id: 'task-manager',
    title: 'Task Manager Pro',
    description: 'Organize your tasks and boost productivity with advanced project management, team collaboration, and time tracking features.',
    shortDescription: 'Organize your tasks and boost productivity',
    image: PlaceHolderImages.find(p => p.id === 'app-store-1')?.imageUrl || '/placeholder-app-1.jpg',
    screenshots: [
      PlaceHolderImages.find(p => p.id === 'app-store-1')?.imageUrl || '/placeholder-app-1.jpg',
      PlaceHolderImages.find(p => p.id === 'app-store-2')?.imageUrl || '/placeholder-app-2.jpg',
      PlaceHolderImages.find(p => p.id === 'app-store-3')?.imageUrl || '/placeholder-app-3.jpg'
    ],
    price: 4.99,
    category: 'Productivity',
    rating: 4.7,
    reviewCount: 1089,
    downloads: 35000,
    size: '28.3 MB',
    version: '1.4.5',
    developer: 'Productivity Labs',
    requirements: {
      os: 'Windows 10+',
      memory: '2 GB RAM',
      storage: '75 MB',
      processor: 'Intel i3 or equivalent'
    },
    features: ['Project management', 'Team collaboration', 'Time tracking', 'Gantt charts'],
    tags: ['productivity', 'tasks', 'management', 'collaboration'],
    releaseDate: new Date('2024-01-20'),
    lastUpdated: new Date('2024-03-22'),
    status: 'available',
    featured: true
  },
  {
    id: 'video-editor',
    title: 'Video Editor Studio',
    description: 'Professional video editing software with advanced effects, transitions, and audio mixing capabilities for content creators.',
    shortDescription: 'Professional video editing software',
    image: PlaceHolderImages.find(p => p.id === 'app-store-2')?.imageUrl || '/placeholder-app-2.jpg',
    screenshots: [
      PlaceHolderImages.find(p => p.id === 'app-store-2')?.imageUrl || '/placeholder-app-2.jpg',
      PlaceHolderImages.find(p => p.id === 'app-store-3')?.imageUrl || '/placeholder-app-3.jpg',
      PlaceHolderImages.find(p => p.id === 'app-store-4')?.imageUrl || '/placeholder-app-4.jpg'
    ],
    price: 19.99,
    category: 'Video & Media',
    rating: 4.5,
    reviewCount: 756,
    downloads: 15000,
    size: '125.8 MB',
    version: '2.1.0',
    developer: 'Media Studio Pro',
    requirements: {
      os: 'Windows 10+',
      memory: '16 GB RAM',
      storage: '500 MB',
      processor: 'Intel i7 or equivalent'
    },
    features: ['Advanced effects', 'Multi-track editing', 'Audio mixing', '4K support'],
    tags: ['video', 'editing', 'media', 'effects'],
    releaseDate: new Date('2024-01-05'),
    lastUpdated: new Date('2024-03-28'),
    status: 'available',
    featured: false
  }
];

// Sample reviews data
const sampleReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    appId: 'photo-editor',
    rating: 5,
    title: 'Amazing photo editing tool!',
    content: 'This app has completely transformed my photo editing workflow. The AI filters are incredible and the interface is intuitive.',
    helpful: 23,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    userName: 'Sarah Johnson',
    userAvatar: '/avatars/sarah.jpg'
  },
  {
    id: '2',
    userId: 'user2',
    appId: 'photo-editor',
    rating: 4,
    title: 'Great features, minor bugs',
    content: 'Love the features but sometimes the app crashes when processing large images. Overall great value for money.',
    helpful: 8,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    userName: 'Mike Chen',
    userAvatar: '/avatars/mike.jpg'
  },
  {
    id: '3',
    userId: 'user3',
    appId: 'codepad',
    rating: 5,
    title: 'Best code editor I\'ve used',
    content: 'The IntelliSense is fantastic and the debugging tools are top-notch. Worth every penny for professional developers.',
    helpful: 45,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
    userName: 'Alex Rodriguez',
    userAvatar: '/avatars/alex.jpg'
  }
];

export default function AppStore({ onAppInstall, onAppWishlist }: AppStoreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'date' | 'downloads'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [installedApps, setInstalledApps] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [isInstalling, setIsInstalling] = useState<Set<string>>(new Set());

  const categories = ['all', ...Array.from(new Set(apps.map(app => app.category)))];

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
  }, [searchQuery, selectedCategory, sortBy, sortOrder]);

  const featuredApps = apps.filter(app => app.featured);

  const handleInstall = useCallback(async (app: App) => {
    setIsInstalling(prev => new Set(prev).add(app.id));
    
    // Simulate installation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setInstalledApps(prev => new Set(prev).add(app.id));
    setIsInstalling(prev => {
      const newSet = new Set(prev);
      newSet.delete(app.id);
      return newSet;
    });
    
    onAppInstall?.(app);
  }, [onAppInstall]);

  const handleWishlist = useCallback((app: App) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(app.id)) {
        newSet.delete(app.id);
      } else {
        newSet.add(app.id);
      }
      return newSet;
    });
    onAppWishlist?.(app);
  }, [onAppWishlist]);


  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            App Store
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover and install amazing applications
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              >
                {category === 'all' ? 'All Apps' : category}
              </Button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating' | 'date' | 'downloads')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="date">Release Date</option>
              <option value="downloads">Downloads</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Featured Apps */}
        {selectedCategory === 'all' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Apps</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredApps.map((app) => (
                <Card key={app.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={app.image}
                          alt={app.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{app.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{app.category}</p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Featured
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{app.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {renderStars(app.rating)}
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                          ({app.reviewCount})
                        </span>
                      </div>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(app.price)}
                      </span>
                    </div>
                    <Button
                      className="w-full mt-3"
                      onClick={() => handleInstall(app)}
                      disabled={isInstalling.has(app.id) || installedApps.has(app.id)}
                    >
                      {isInstalling.has(app.id) ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Installing...
                        </>
                      ) : installedApps.has(app.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Installed
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Install
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Apps Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategory === 'all' ? 'All Apps' : selectedCategory}
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {filteredApps.length} apps found
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredApps.map((app) => (
              <Card key={app.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow group">
                <div className="relative">
                  <div className="relative h-32 w-full overflow-hidden">
                    <Image
                      src={app.image}
                      alt={app.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                        onClick={() => handleWishlist(app)}
                      >
                        <Heart className={`w-4 h-4 ${
                          wishlist.has(app.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                        }`} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {app.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {app.shortDescription}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {renderStars(app.rating)}
                    <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                      ({app.reviewCount})
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(app.price)}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedApp(app)}
                        className="text-xs"
                      >
                        Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleInstall(app)}
                        disabled={isInstalling.has(app.id) || installedApps.has(app.id)}
                        className="text-xs"
                      >
                        {isInstalling.has(app.id) ? (
                          <Clock className="w-3 h-3 animate-spin" />
                        ) : installedApps.has(app.id) ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* App Details Modal */}
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedApp?.title}</DialogTitle>
            </DialogHeader>
            
            {selectedApp && (
              <div className="space-y-6">
                {/* App Header */}
                <div className="flex gap-6">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={selectedApp.image}
                      alt={selectedApp.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedApp.category}</Badge>
                      {selectedApp.featured && (
                        <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(selectedApp.rating)}
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                        {selectedApp.rating} ({selectedApp.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {selectedApp.downloads.toLocaleString()} downloads
                      </span>
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-4 h-4" />
                        {selectedApp.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {selectedApp.version}
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(selectedApp.price)}
                    </div>
                    <Button
                      size="lg"
                      onClick={() => handleInstall(selectedApp)}
                      disabled={isInstalling.has(selectedApp.id) || installedApps.has(selectedApp.id)}
                      className="w-full"
                    >
                      {isInstalling.has(selectedApp.id) ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Installing...
                        </>
                      ) : installedApps.has(selectedApp.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Installed
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Install
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWishlist(selectedApp)}
                      className="w-full"
                    >
                      <Heart className={`w-4 h-4 mr-2 ${
                        wishlist.has(selectedApp.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                      }`} />
                      {wishlist.has(selectedApp.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </Button>
                  </div>
                </div>

                {/* Screenshots */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Screenshots</h3>
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedApp.screenshots.map((screenshot) => (
                      <div key={`screenshot-${screenshot}`} className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={screenshot}
                          alt={`${selectedApp.title} screenshot`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300">{selectedApp.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedApp.features.map((feature) => (
                      <div key={`feature-${feature}`} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Requirements */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">System Requirements</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-gray-400" />
                      <span>{selectedApp.requirements.processor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MemoryStick className="w-4 h-4 text-gray-400" />
                      <span>{selectedApp.requirements.memory}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-gray-400" />
                      <span>{selectedApp.requirements.storage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{selectedApp.requirements.os}</span>
                    </div>
                  </div>
                </div>

                {/* Reviews */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Reviews</h3>
                  <div className="space-y-4">
                    {sampleReviews
                      .filter(review => review.appId === selectedApp.id)
                      .map((review) => (
                        <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              {review.userAvatar ? (
                                <Image
                                  src={review.userAvatar}
                                  alt={review.userName}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `<span class="text-sm font-medium">${review.userName.charAt(0)}</span>`;
                                    }
                                  }}
                                />
                              ) : (
                                <span className="text-sm font-medium">
                                  {review.userName.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{review.userName}</div>
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  {review.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <h4 className="font-medium mb-1">{review.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{review.content}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                            <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400">
                              <Heart className="w-4 h-4" />
                              Helpful ({review.helpful})
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
