'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ExternalLink, Github, Search, Filter, Grid, List, Star, GitFork, Calendar, User, Award, Code, Database, Cloud, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LottiePlayer } from '@/components/shared/LottiePlayer';
import { usePortfolio } from '@/hooks/usePortfolio';
import { usePortfolioFilters } from '@/store/portfolioStore';
import { type Skill, ProjectCardProps, FilterButtonsProps, SearchBarProps, TimelineViewProps, ProfessionalTimelineProps, SkillsRadarProps } from '@/types/portfolio';

// Project Card Component
function ProjectCard({ project, onProjectClick, className = '' }: ProjectCardProps) {
  const { toggleFavoriteProject, favoriteProjects } = usePortfolioFilters();
  const isFavorite = favoriteProjects.includes(project.id);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mern': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'game': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'utility': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'python': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'php': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${className}`}
      onClick={() => onProjectClick?.(project)}
    >
      <div className="relative">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          {project.lottieUrl ? (
            <LottiePlayer
              url={project.lottieUrl}
              className="w-full h-full"
              ariaLabel={`${project.title} animation`}
              onError={() => {
                // Fallback to static image if Lottie fails
                console.warn(`Lottie animation failed for project: ${project.title}`);
              }}
            />
          ) : (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/projects/default-project.jpg';
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge className={getDifficultyColor(project.difficulty)}>
              {project.difficulty}
            </Badge>
            <Badge className={getCategoryColor(project.category)}>
              {project.category.toUpperCase()}
            </Badge>
          </div>
          <div className="absolute bottom-2 left-2 flex gap-2">
            {project.metrics?.stars > 0 && (
              <div className="flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
                <Star className="w-3 h-3" />
                {project.metrics.stars}
              </div>
            )}
            {project.metrics?.forks > 0 && (
              <div className="flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
                <GitFork className="w-3 h-3" />
                {project.metrics.forks}
              </div>
            )}
          </div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {project.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteProject(project.id);
            }}
            className="p-1 h-auto"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
          </Button>
        </div>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 4} more
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {project.duration}
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {project.teamSize} person{project.teamSize > 1 ? 's' : ''}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.githubUrl, '_blank');
              }}
            >
              <Github className="w-4 h-4 mr-2" />
              Code
            </Button>
            {project.demoUrl && (
              <Button
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.demoUrl, '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Demo
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Filter Buttons Component
function FilterButtons({ categories, selectedCategory, onCategoryChange, className = '' }: FilterButtonsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="transition-all duration-200"
        >
          {category.name}
          <Badge variant="secondary" className="ml-2 text-xs">
            {category.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
}

// Search Bar Component
function SearchBar({ searchQuery, onSearchChange, placeholder = 'Search projects...', className = '' }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4"
      />
    </div>
  );
}

// Timeline View Component
function TimelineView({ projects, onProjectClick, className = '' }: TimelineViewProps) {
  const sortedProjects = [...projects].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {sortedProjects.map((project, index) => (
        <div key={project.id} className="relative">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg" />
              {index < sortedProjects.length - 1 && (
                <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-700 mt-2" />
              )}
            </div>
            <div className="flex-1 pb-8">
              <ProjectCard 
                project={project} 
                {...(onProjectClick && { onProjectClick })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Professional Timeline Component
function ProfessionalTimeline({ workExperience, education, certifications, className = '' }: ProfessionalTimelineProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Journey</h3>
      
      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="experience" className="space-y-4">
          {workExperience.map((exp, index) => (
            <Card key={exp.id} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg" />
                  {index < workExperience.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-700 mt-2" />
                  )}
                </div>
                <div className="flex-1">
                  <CardHeader>
                    <CardTitle className="text-lg">{exp.position}</CardTitle>
                    <CardDescription className="text-base font-medium">{exp.company}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{exp.duration}</span>
                      <span>{exp.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{exp.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="education" className="space-y-4">
          {education.map((edu, index) => (
            <Card key={edu.id} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg" />
                  {index < education.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-700 mt-2" />
                  )}
                </div>
                <div className="flex-1">
                  <CardHeader>
                    <CardTitle className="text-lg">{edu.degree}</CardTitle>
                    <CardDescription className="text-base font-medium">{edu.institution}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{edu.duration}</span>
                      <span>{edu.grade}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{edu.description}</p>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="certifications" className="space-y-4">
          {certifications.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{cert.name}</CardTitle>
                    <CardDescription className="text-base font-medium">{cert.issuer}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>Issued: {cert.issuedDate}</span>
                      {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                    </div>
                  </div>
                  <Award className="w-6 h-6 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">{cert.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Skills Radar Component
function SkillsRadar({ skills, selectedCategory, onSkillClick, className = '' }: SkillsRadarProps) {
  const filteredSkills = selectedCategory 
    ? skills.filter(skill => skill.category === selectedCategory)
    : skills;

  const categories = [...new Set(skills.map(skill => skill.category))];

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Skills & Technologies</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={!selectedCategory ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSkillClick?.({} as Skill)}
        >
          All Skills
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSkillClick?.({} as Skill)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSkills.slice(0, 12).map((skill) => {
          const SkillBar = () => {
            const barRef = useRef<HTMLDivElement>(null);
            
            useEffect(() => {
              if (barRef.current) {
                barRef.current.style.width = `${skill.proficiency}%`;
              }
            }, []);
            
            return (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  ref={barRef}
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                />
              </div>
            );
          };
          
          return (
            <Card key={skill.id} className="p-4 text-center">
              <div className="space-y-2">
                <div className="text-sm font-medium">{skill.name}</div>
                <SkillBar />
                <div className="text-xs text-gray-500">{skill.proficiency}%</div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Main Portfolio Component
export default function Portfolio() {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    setSelectedProject,
    resetFilters
  } = usePortfolioFilters();

  const {
    filteredProjects,
    categories,
    workExperience,
    education,
    certifications,
    skills,
    personalInfo,
    isLoading,
    error
  } = usePortfolio(selectedCategory, searchQuery);

  const [showProfessionalTimeline, setShowProfessionalTimeline] = useState(false);

  if (error) {
    return (
      <div className="h-full p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Portfolio</h1>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            My Portfolio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of {filteredProjects.length} projects showcasing my skills in full-stack development, 
            data analytics, and modern web technologies.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Code className="w-4 h-4" />
              {personalInfo.currentRole}
            </div>
            <div className="flex items-center gap-1">
              <Database className="w-4 h-4" />
              {skills.length} Skills
            </div>
            <div className="flex items-center gap-1">
              <Cloud className="w-4 h-4" />
              {workExperience.length} Companies
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder="Search projects by name, description, or technology..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('timeline')}
              >
                <List className="w-4 h-4 mr-2" />
                Timeline
              </Button>
            </div>
          </div>

          <FilterButtons
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProfessionalTimeline(!showProfessionalTimeline)}
            >
              <Brain className="w-4 h-4 mr-2" />
              {showProfessionalTimeline ? 'Hide' : 'Show'} Professional Timeline
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Loading projects...</p>
          </div>
        )}

        {/* Projects Grid/Timeline */}
        {!isLoading && (
          <div className="space-y-6">
            {viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onProjectClick={setSelectedProject}
                  />
                ))}
              </div>
            ) : (
              <TimelineView
                projects={filteredProjects}
                onProjectClick={setSelectedProject}
              />
            )}

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No projects found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        )}

        {/* Professional Timeline */}
        {showProfessionalTimeline && (
          <div className="mt-12">
            <ProfessionalTimeline
              workExperience={workExperience}
              education={education}
              certifications={certifications}
            />
          </div>
        )}

        {/* Skills Section */}
        <div className="mt-12">
          <SkillsRadar
            skills={skills}
            onSkillClick={() => {
              // TODO: Implement skill click handler
            }}
          />
        </div>
      </div>
    </div>
  );
}
