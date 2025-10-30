export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = [
  {
    id: 'user-avatar',
    description: 'User avatar image',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    imageHint: 'A professional headshot of a person'
  },
  {
    id: 'welcome-hero',
    description: 'Welcome screen hero image',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=180&fit=crop',
    imageHint: 'A modern computer setup with multiple monitors'
  },
  {
    id: 'app-store-1',
    description: 'Photo Editor Pro app icon',
    imageUrl: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=64&h=64&fit=crop',
    imageHint: 'A photo editing application icon'
  },
  {
    id: 'app-store-2',
    description: 'Music Stream app icon',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=64&h=64&fit=crop',
    imageHint: 'A music streaming application icon'
  },
  {
    id: 'app-store-3',
    description: 'CodePad app icon',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=64&h=64&fit=crop',
    imageHint: 'A code editor application icon'
  },
  {
    id: 'app-store-4',
    description: 'Weather Now app icon',
    imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=64&h=64&fit=crop',
    imageHint: 'A weather application icon'
  },
  {
    id: 'portfolio-project-1',
    description: 'Project Alpha showcase',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    imageHint: 'A modern e-commerce website interface'
  },
  {
    id: 'portfolio-project-2',
    description: 'Project Beta showcase',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    imageHint: 'A data visualization dashboard'
  },
  {
    id: 'portfolio-project-3',
    description: 'Project Gamma showcase',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    imageHint: 'A mobile application interface'
  },
  {
    id: 'portfolio-project-4',
    description: 'Project Delta showcase',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    imageHint: 'An AI-powered application interface'
  }
];
