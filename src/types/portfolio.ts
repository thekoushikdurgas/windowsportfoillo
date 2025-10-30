// Portfolio App TypeScript Interfaces
// Based on Koushik Chandra Saha's real project data

export interface PersonalInfo {
  name: string;
  username: string;
  title: string;
  currentRole: string;
  location: string;
  email: string;
  website: string;
  linkedin: string;
  github: string;
  phone: string;
  address: string;
  description?: string;
  avatar?: string;
  resumeUrl?: string;
  availability?: string;
  languages?: Language[];
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  username: string;
  description: string;
  color: string;
}

export interface ProjectMetrics {
  stars: number;
  forks: number;
  commits: number;
  languages: Record<string, number>;
  lastUpdated: string;
}

export interface GitHubRepository {
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  cloneUrl: string;
  languages: string[];
  topics: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  lottieUrl?: string;
  technologies: string[];
  githubUrl: string;
  demoUrl?: string;
  category: 'mern' | 'python' | 'php' | 'frontend' | 'fullstack' | 'game' | 'utility';
  status: 'completed' | 'in-progress' | 'archived';
  startDate: string;
  endDate: string;
  duration: string;
  features: string[];
  metrics: ProjectMetrics;
  repository: GitHubRepository;
  screenshots: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  teamSize: number;
  myRole: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  grade: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
  credentialId: string;
  description: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: 'backend' | 'frontend' | 'database' | 'cloud' | 'programming' | 'data-analytics' | 'full-stack' | 'tools';
  proficiency: number; // 1-100
  projects: string[]; // Project IDs using this skill
  yearsOfExperience: number;
  description?: string;
  icon?: string;
  certifications?: string[];
}

export interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
  description?: string;
}

export interface FilterState {
  selectedCategory: string;
  searchQuery: string;
  viewMode: 'grid' | 'timeline';
  selectedProject: Project | null;
  isLoading: boolean;
}

export interface PortfolioState extends FilterState {
  projects: Project[];
  categories: Category[];
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  personalInfo: PersonalInfo;
}

// GitHub API Response Types
export interface GitHubRepositoryResponse {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  clone_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  languages_url: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
}

export interface GitHubLanguagesResponse {
  [language: string]: number;
}

// Component Props Types
export interface ProjectCardProps {
  project: Project;
  onProjectClick?: (project: Project) => void;
  className?: string;
}

export interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export interface FilterButtonsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export interface TimelineViewProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
  className?: string;
}

export interface ProfessionalTimelineProps {
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  className?: string;
}

export interface SkillsRadarProps {
  skills: Skill[];
  selectedCategory?: string;
  onSkillClick?: (skill: Skill) => void;
  className?: string;
}

// Hook Return Types
export interface UsePortfolioReturn {
  filteredProjects: Project[];
  categories: Category[];
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  personalInfo: PersonalInfo;
  isLoading: boolean;
  error: string | null;
  searchProjects: (query: string) => Project[];
  filterByCategory: (category: string) => Project[];
  getProjectById: (id: string) => Project | undefined;
  getProjectsByTechnology: (technology: string) => Project[];
}

export interface UseGitHubDataReturn {
  repositoryData: Record<string, GitHubRepositoryResponse>;
  languagesData: Record<string, GitHubLanguagesResponse>;
  isLoading: boolean;
  error: string | null;
  fetchRepository: (owner: string, repo: string) => Promise<void>;
  fetchLanguages: (owner: string, repo: string) => Promise<void>;
}

// Store Types
export interface PortfolioStore {
  // State
  selectedCategory: string;
  searchQuery: string;
  viewMode: 'grid' | 'timeline';
  selectedProject: Project | null;
  isLoading: boolean;
  favoriteProjects: string[];
  
  // Actions
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'grid' | 'timeline') => void;
  setSelectedProject: (project: Project | null) => void;
  setIsLoading: (loading: boolean) => void;
  resetFilters: () => void;
  toggleFavoriteProject: (projectId: string) => void;
}

// Animation Types
export interface AnimationConfig {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition: Record<string, unknown>;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface GitHubApiError {
  message: string;
  status: number;
  documentation_url?: string;
}
