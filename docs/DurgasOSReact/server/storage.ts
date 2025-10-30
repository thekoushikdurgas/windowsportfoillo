import { 
  type Profile, 
  type InsertProfile,
  type Project,
  type InsertProject,
  type App,
  type InsertApp
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Profile methods
  getProfile(): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(profile: InsertProfile): Promise<Profile>;

  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;

  // App methods
  getAllApps(): Promise<App[]>;
  getApp(id: string): Promise<App | undefined>;
  createApp(app: InsertApp): Promise<App>;
}

export class MemStorage implements IStorage {
  private profile: Profile | undefined;
  private projects: Map<string, Project>;
  private apps: Map<string, App>;

  constructor() {
    this.projects = new Map();
    this.apps = new Map();
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default profile
    this.profile = {
      id: randomUUID(),
      name: "John Doe",
      title: "Full Stack Developer",
      bio: "Passionate developer with expertise in building modern web applications. I love creating intuitive user experiences and solving complex problems.",
      email: "john.doe@durgasos.com",
      skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Docker"],
      experience: "5+ years in software development, specializing in full-stack web applications",
      education: "Bachelor's in Computer Science, Master's in Software Engineering",
    };

    // Initialize default projects
    const defaultProjects: InsertProject[] = [
      {
        title: "E-Commerce Platform",
        description: "A full-stack e-commerce solution with real-time inventory management, payment processing, and advanced analytics dashboard.",
        category: "Web Development",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Redis"],
        imageUrl: null,
        demoUrl: "https://demo.example.com",
        githubUrl: "https://github.com/example/ecommerce",
        featured: 1,
      },
      {
        title: "Mobile Task Manager",
        description: "Cross-platform mobile app for team collaboration and task tracking with real-time sync and push notifications.",
        category: "Mobile Development",
        technologies: ["React Native", "Firebase", "Redux", "TypeScript"],
        imageUrl: null,
        demoUrl: null,
        githubUrl: "https://github.com/example/taskmanager",
        featured: 0,
      },
      {
        title: "AI Analytics Dashboard",
        description: "Real-time analytics dashboard with machine learning insights, predictive modeling, and interactive data visualizations.",
        category: "Data Science",
        technologies: ["Python", "TensorFlow", "React", "D3.js", "FastAPI"],
        imageUrl: null,
        demoUrl: "https://analytics.example.com",
        githubUrl: null,
        featured: 1,
      },
      {
        title: "DevOps Automation Tool",
        description: "Streamline deployment workflows with automated CI/CD pipelines, infrastructure as code, and monitoring.",
        category: "DevOps",
        technologies: ["Docker", "Kubernetes", "Jenkins", "Terraform", "AWS"],
        imageUrl: null,
        demoUrl: null,
        githubUrl: "https://github.com/example/devops-tool",
        featured: 0,
      },
      {
        title: "Social Media Dashboard",
        description: "Unified dashboard for managing multiple social media accounts with analytics and scheduled posting.",
        category: "Web Development",
        technologies: ["Vue.js", "Express", "MongoDB", "OAuth2"],
        imageUrl: null,
        demoUrl: "https://social.example.com",
        githubUrl: "https://github.com/example/social-dashboard",
        featured: 1,
      },
    ];

    defaultProjects.forEach(project => {
      const id = randomUUID();
      this.projects.set(id, { ...project, id });
    });

    // Initialize default apps
    const defaultApps: InsertApp[] = [
      {
        name: "Photo Editor Pro",
        description: "Professional photo editing with advanced filters, layers, and AI-powered enhancements",
        category: "Creativity",
        icon: "image",
        version: "2.5.0",
        developer: "Creative Studio",
        featured: 1,
      },
      {
        name: "Code Editor",
        description: "Powerful code editor with syntax highlighting, IntelliSense, and Git integration",
        category: "Development",
        icon: "code",
        version: "1.8.2",
        developer: "Dev Tools Inc",
        featured: 1,
      },
      {
        name: "Music Player",
        description: "Listen to your favorite music with high-quality audio and smart playlists",
        category: "Entertainment",
        icon: "music",
        version: "3.2.1",
        developer: "Media Corp",
        featured: 0,
      },
      {
        name: "Task Manager Pro",
        description: "Organize your tasks and boost productivity with smart reminders and analytics",
        category: "Productivity",
        icon: "check-square",
        version: "1.4.5",
        developer: "Productivity Labs",
        featured: 1,
      },
      {
        name: "Video Conferencing",
        description: "High-quality video calls with screen sharing and virtual backgrounds",
        category: "Communication",
        icon: "video",
        version: "4.1.0",
        developer: "Connect Inc",
        featured: 0,
      },
      {
        name: "Cloud Storage",
        description: "Secure cloud storage with automatic sync and file sharing",
        category: "Productivity",
        icon: "cloud",
        version: "2.9.3",
        developer: "Cloud Solutions",
        featured: 1,
      },
      {
        name: "Gaming Hub",
        description: "Access your game library and connect with friends",
        category: "Entertainment",
        icon: "gamepad",
        version: "5.0.1",
        developer: "Gaming Network",
        featured: 0,
      },
      {
        name: "Note Taking",
        description: "Capture ideas quickly with rich text formatting and organization",
        category: "Productivity",
        icon: "file-text",
        version: "1.6.8",
        developer: "Note Labs",
        featured: 0,
      },
    ];

    defaultApps.forEach(app => {
      const id = randomUUID();
      this.apps.set(id, { ...app, id });
    });
  }

  // Profile methods
  async getProfile(): Promise<Profile | undefined> {
    return this.profile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const profile: Profile = {
      id: randomUUID(),
      ...insertProfile,
    };
    this.profile = profile;
    return profile;
  }

  async updateProfile(insertProfile: InsertProfile): Promise<Profile> {
    if (!this.profile) {
      return this.createProfile(insertProfile);
    }
    this.profile = {
      ...this.profile,
      ...insertProfile,
    };
    return this.profile;
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  // App methods
  async getAllApps(): Promise<App[]> {
    return Array.from(this.apps.values());
  }

  async getApp(id: string): Promise<App | undefined> {
    return this.apps.get(id);
  }

  async createApp(insertApp: InsertApp): Promise<App> {
    const id = randomUUID();
    const app: App = { ...insertApp, id };
    this.apps.set(id, app);
    return app;
  }
}

export const storage = new MemStorage();
