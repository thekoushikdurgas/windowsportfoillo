import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Github, Filter, Briefcase } from "lucide-react";
import type { Project } from "@shared/schema";

export function PortfolioApp() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const defaultProjects: Project[] = projects || [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with real-time inventory management and payment processing.",
      category: "Web Development",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      imageUrl: null,
      demoUrl: "https://demo.example.com",
      githubUrl: "https://github.com/example/project",
      featured: 1,
    },
    {
      id: "2",
      title: "Mobile Task Manager",
      description: "Cross-platform mobile app for team collaboration and task tracking.",
      category: "Mobile Development",
      technologies: ["React Native", "Firebase", "Redux"],
      imageUrl: null,
      demoUrl: null,
      githubUrl: "https://github.com/example/project2",
      featured: 0,
    },
    {
      id: "3",
      title: "AI Analytics Dashboard",
      description: "Real-time analytics dashboard with machine learning insights.",
      category: "Data Science",
      technologies: ["Python", "TensorFlow", "React", "D3.js"],
      imageUrl: null,
      demoUrl: "https://analytics.example.com",
      githubUrl: null,
      featured: 1,
    },
  ];

  const categories = ["all", ...Array.from(new Set(defaultProjects.map(p => p.category)))];
  
  const filteredProjects = selectedCategory === "all"
    ? defaultProjects
    : defaultProjects.filter(p => p.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#1a1a1a]">
        <div className="w-8 h-8 border-2 border-[#0078D4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-[#1a1a1a] to-[#252525]">
      {/* Header */}
      <div className="px-8 py-8">
        <h1 className="text-2xl font-semibold text-white mb-2">My Portfolio</h1>
        <p className="text-sm text-white/60">A collection of my recent projects</p>
        
        {/* Category Filter */}
        <div className="flex items-center gap-2 mt-6">
          <Filter className="w-4 h-4 text-white/60" />
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover-elevate active-elevate-2 ${
                  selectedCategory === category
                    ? 'bg-[#0078D4] text-white'
                    : 'bg-white/5 text-white/70 border border-white/10'
                }`}
                data-testid={`filter-${category}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg overflow-hidden hover-elevate active-elevate-2 transition-all group"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            data-testid={`project-card-${project.id}`}
          >
            {/* Project Image Placeholder */}
            <div className="h-40 bg-gradient-to-br from-[#0078D4] to-[#0067C0] flex items-center justify-center">
              <Briefcase className="w-16 h-16 text-white/50" />
            </div>

            {/* Project Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-semibold text-white" data-testid={`project-title-${project.id}`}>
                  {project.title}
                </h3>
                {project.featured === 1 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0078D4]/20 text-[#0078D4] border border-[#0078D4]/30">
                    Featured
                  </span>
                )}
              </div>
              
              <p className="text-sm text-white/60 mb-3 line-clamp-2" data-testid={`project-description-${project.id}`}>
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-white/70 border border-white/10"
                    data-testid={`tech-${project.id}-${idx}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-2">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0078D4] text-white hover-elevate active-elevate-2 transition-all"
                    data-testid={`link-demo-${project.id}`}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/90 border border-white/10 hover-elevate active-elevate-2 transition-all"
                    data-testid={`link-github-${project.id}`}
                  >
                    <Github className="w-3 h-3" />
                    Code
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
