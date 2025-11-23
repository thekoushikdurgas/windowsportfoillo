// Portfolio Types
// Type definitions for personal portfolio data

export interface Language {
  name: string;
  proficiency: string;
}

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
  description: string;
  avatar: string;
  resumeUrl: string;
  availability: string;
  languages: Language[];
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
  field: string;
  duration: string;
  grade: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  issuedDate?: string; // Alias for backward compatibility
  expiryDate?: string; // Optional as some certifications don't expire
  credentialId: string;
  description: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  proficiency: number;
  description?: string; // Optional as some skills may not have descriptions
  projects: string[];
  yearsOfExperience: number;
  certifications?: string[]; // Optional as some skills may not have certifications
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ProjectMetrics {
  stars: number;
  forks: number;
  commits: number;
  languages: Record<string, number>;
  lastUpdated: string;
}

export interface ProjectRepository {
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
  lottieUrl: string;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  category: string;
  status: string;
  startDate: string;
  endDate: string;
  duration: string;
  features: string[];
  metrics: ProjectMetrics;
  repository: ProjectRepository;
  screenshots: string[];
  difficulty: string;
  teamSize: number;
  myRole: string;
}

