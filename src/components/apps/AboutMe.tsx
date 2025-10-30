'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Download, 
  MapPin, 
  Phone, 
  Globe, 
  Award, 
  GraduationCap, 
  Briefcase,
  Code,
  Database,
  Cloud,
  Zap,
  Users,
  Target,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logger } from '@/lib/logger';
import { 
  personalInfo, 
  workExperience, 
  education, 
  certifications, 
  skills, 
  socialLinks, 
  skillCategories,
  professionalSummary 
} from '@/data/personal-info';
import { resumeGenerator } from '@/services/resume-generator';
import { GitHubStats } from './AboutMe/GitHubStats';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

export default function AboutMe() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const { t } = useLanguage();

  const groupedSkills = skillCategories.map(category => ({
    ...category,
    skills: skills.filter(skill => skill.category === category.id)
  }));

  const handleDownloadResume = async (format: 'pdf' | 'html') => {
    setIsDownloading(true);
    try {
      if (format === 'pdf') {
        await resumeGenerator.generatePDF();
      } else {
        await resumeGenerator.generateHTMLFile();
      }
    } catch (error) {
      logger.error('Error downloading resume', { error });
      alert('Failed to download resume. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-full p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-shrink-0">
            <div className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700 hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/koushik-profile.jpg"
                alt="Koushik Chandra Saha"
                width={176}
                height={176}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-avatar.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-2 right-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    {personalInfo.name}
                  </h1>
                  <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
                </div>
                <p className="text-2xl text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  {personalInfo.title}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {personalInfo.location}
                  </div>
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-2 rounded-lg">
                    <Phone className="w-4 h-4 text-green-500" />
                    {personalInfo.phone}
                  </div>
                </div>
              </div>
              <LanguageSwitcher />
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-white/20 dark:border-gray-700/50">
              {personalInfo.description}
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Badge variant="info" size="lg">
                <Code className="w-4 h-4 mr-1" />
                Python
              </Badge>
              <Badge variant="success" size="lg">
                <Database className="w-4 h-4 mr-1" />
                MERN Stack
              </Badge>
              <Badge variant="secondary" size="lg">
                <Cloud className="w-4 h-4 mr-1" />
                Google Cloud
              </Badge>
              <Badge variant="warning" size="lg">
                <TrendingUp className="w-4 h-4 mr-1" />
                Power BI
              </Badge>
              <Badge variant="destructive" size="lg">
                <Zap className="w-4 h-4 mr-1" />
                AWS
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-xl p-1">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-lg">
              <Users className="w-4 h-4" />
              {t('overview')}
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-lg">
              <Briefcase className="w-4 h-4" />
              {t('experience')}
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-lg">
              <Target className="w-4 h-4" />
              {t('skillsNavigation')}
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-lg">
              <Github className="w-4 h-4" />
              {t('github')}
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-lg">
              <Mail className="w-4 h-4" />
              {t('contact')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Professional Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    {t('professionalSummary')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Current Role</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{professionalSummary.currentRole}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Experience</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{professionalSummary.experience}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Education</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{professionalSummary.education}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Availability</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{professionalSummary.availability}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {professionalSummary.recentAchievements.map((achievement) => (
                      <li key={`achievement-${achievement}`} className="flex items-start gap-2 text-sm">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-600 dark:text-gray-400">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Key Strengths */}
            <Card>
              <CardHeader>
                <CardTitle>Key Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {professionalSummary.keyStrengths.map((strength) => (
                    <div key={`strength-${strength}`} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            {/* Work Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {workExperience.map((exp) => (
                  <div key={exp.id} className="border-l-4 border-blue-500 pl-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{exp.position}</h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{exp.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{exp.duration}</p>
                        {exp.current && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {exp.technologies.map((tech) => (
                        <Badge key={`${exp.id}-tech-${tech}`} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-4 border-green-500 pl-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                        <p className="text-green-600 dark:text-green-400 font-medium">{edu.institution}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{edu.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{edu.duration}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{edu.grade}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{edu.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-start p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">{cert.issuer}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{cert.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Credential ID: {cert.credentialId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{cert.issuedDate}</p>
                      {cert.expiryDate && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">Expires: {cert.expiryDate}</p>
                      )}
                      {cert.current && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            {groupedSkills.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <Badge variant="outline">{category.count} skills</Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.skills.map((skill) => (
                      <div key={skill.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {skill.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                        {skill.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {skill.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                          <span>{skill.yearsOfExperience}y exp</span>
                          <span>{skill.projects.length} projects</span>
                        </div>
                        {skill.certifications && skill.certifications.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {skill.certifications.map((cert) => (
                                <Badge key={`cert-${cert}`} variant="outline" className="text-xs">
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="github" className="space-y-6">
            <GitHubStats />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{personalInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{personalInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Location</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{personalInfo.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Website</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{personalInfo.website}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Connect With Me</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {socialLinks.map((link) => (
                    <Button 
                      key={`social-${link.platform}`} 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.open(link.url, '_blank')}
                    >
                      {link.icon === 'github' && <Github className="w-4 h-4 mr-2" />}
                      {link.icon === 'linkedin' && <Linkedin className="w-4 h-4 mr-2" />}
                      {link.icon === 'mail' && <Mail className="w-4 h-4 mr-2" />}
                      {link.icon === 'globe' && <Globe className="w-4 h-4 mr-2" />}
                      {link.platform}
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Languages */}
            {personalInfo.languages && personalInfo.languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {personalInfo.languages.map((lang) => (
                      <div key={`language-${lang.name}`} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{lang.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{lang.proficiency}</p>
                        </div>
                        <Badge variant="outline">
                          {lang.name === 'Bengali' ? '🇧🇩' : lang.name === 'English' ? '🇺🇸' : '🇮🇳'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resume Download */}
            <Card>
              <CardHeader>
                <CardTitle>Resume & Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Download Resume</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {personalInfo.name} - {personalInfo.currentRole}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleDownloadResume('pdf')}
                      disabled={isDownloading}
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isDownloading ? 'Generating...' : 'PDF'}
                    </Button>
                    <Button 
                      onClick={() => handleDownloadResume('html')}
                      disabled={isDownloading}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      HTML
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  💡 PDF will open in print dialog. HTML will download as a file.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
