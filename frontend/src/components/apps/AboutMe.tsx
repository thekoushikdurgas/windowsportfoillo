'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { WindowProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils/cn';
import {
  personalInfo,
  workExperience,
  education,
  certifications,
  skills,
  socialLinks,
  skillCategories,
  professionalSummary,
} from '@/data/personal-info';
import { translations, getTranslation, type Language } from '@/data/translations';
import {
  Github,
  Linkedin,
  Mail,
  Globe,
  MapPin,
  Phone,
  Download,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Languages as LanguagesIcon,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const AboutMe: React.FC<WindowProps> = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'skills' | 'contact'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const t = translations[currentLanguage];

  // Get icon component for social links
  const getSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'github':
        return Github;
      case 'linkedin':
        return Linkedin;
      case 'mail':
      case 'email':
        return Mail;
      case 'globe':
      case 'website':
        return Globe;
      default:
        return ExternalLink;
    }
  };

  // Filter skills by category
  const getSkillsByCategory = (categoryId: string) => {
    return skills.filter((skill) => skill.category === categoryId);
  };

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    const category = skillCategories.find((cat) => cat.id === categoryId);
    if (!category) return 'blue';
    return category.color;
  };

  // Get category border color class
  const getCategoryBorderColor = (categoryId: string) => {
    const color = getCategoryColor(categoryId);
    const colorMap: Record<string, string> = {
      blue: 'border-l-blue-500',
      green: 'border-l-green-500',
      purple: 'border-l-purple-500',
      orange: 'border-l-orange-500',
      red: 'border-l-red-500',
      yellow: 'border-l-yellow-500',
      gray: 'border-l-gray-500',
    };
    return colorMap[color] || 'border-l-blue-500';
  };

  // Get category background color class
  const getCategoryBgColor = (categoryId: string) => {
    const color = getCategoryColor(categoryId);
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      gray: 'bg-gray-500',
    };
    return colorMap[color] || 'bg-blue-500';
  };

  // Handle resume download
  const handleResumeDownload = () => {
    // For now, open the resume URL
    window.open(personalInfo.resumeUrl, '_blank');
  };

  return (
    <div
      className={cn(
        'aboutme-container h-full overflow-hidden flex flex-col',
        isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 to-blue-50'
      )}
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      {/* Header with Navigation */}
      <div
        className={cn(
          'flex items-center justify-between p-4 border-b',
          isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white/50'
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {(['overview', 'experience', 'skills', 'contact'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  activeTab === tab
                    ? isDarkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {t[tab === 'overview' ? 'overview' : tab === 'experience' ? 'experience' : tab === 'skills' ? 'skillsNavigation' : 'contact']}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            {(['en', 'bn', 'hi'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setCurrentLanguage(lang)}
                className={cn(
                  'px-2 py-1 rounded text-xs transition-colors',
                  currentLanguage === lang
                    ? isDarkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
                title={translations[lang].overview}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto win11-scrollbar">
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            {/* Profile Header */}
            <div
              className={cn(
                'rounded-lg p-6 shadow-sm',
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
              )}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32">
                    {personalInfo.avatar.startsWith('http') || personalInfo.avatar.startsWith('/') ? (
                      <Image
                        src={personalInfo.avatar}
                        alt={personalInfo.name}
                        className="rounded-full object-cover border-4 shadow-lg"
                        width={128}
                        height={128}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/128?text=KC';
                        }}
                      />
                    ) : (
                      // Fallback to regular img for data URLs or other formats
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={personalInfo.avatar}
                        alt={personalInfo.name}
                        className="w-32 h-32 rounded-full object-cover border-4 shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/128?text=KC';
                        }}
                      />
                    )}
                    <div
                      className={cn(
                        'absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 flex items-center justify-center',
                        isDarkMode ? 'bg-green-500 border-gray-800' : 'bg-green-500 border-white'
                      )}
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h1
                    className={cn(
                      'text-2xl font-bold mb-2',
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    {personalInfo.name}
                  </h1>
                  <p
                    className={cn(
                      'text-lg mb-3',
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    )}
                  >
                    {personalInfo.title}
                  </p>
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {personalInfo.location}
                      </span>
                    </div>
                  </div>
                  <p
                    className={cn(
                      'text-sm leading-relaxed mb-4',
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    )}
                  >
                    {personalInfo.description}
                  </p>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'MERN Stack', 'AWS', 'GCP', 'Power BI'].map((tech) => (
                      <span
                        key={tech}
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          isDarkMode
                            ? 'bg-blue-900/50 text-blue-300 border border-blue-700'
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        )}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div
              className={cn(
                'rounded-lg p-6 shadow-sm',
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
              )}
            >
              <h2
                className={cn(
                  'text-xl font-semibold mb-4',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}
              >
                {t.professionalSummary}
              </h2>
              <div className="space-y-4">
                <div>
                  <p
                    className={cn(
                      'text-sm mb-2',
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    )}
                  >
                    <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      {t.current}:
                    </strong>{' '}
                    {professionalSummary.currentRole}
                  </p>
                  <p
                    className={cn(
                      'text-sm mb-2',
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    )}
                  >
                    <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      {t.experience}:
                    </strong>{' '}
                    {professionalSummary.experience}
                  </p>
                  <p
                    className={cn(
                      'text-sm',
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    )}
                  >
                    <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      {t.education}:
                    </strong>{' '}
                    {professionalSummary.education}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Strengths */}
            <div
              className={cn(
                'rounded-lg p-6 shadow-sm',
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
              )}
            >
              <h2
                className={cn(
                  'text-xl font-semibold mb-4',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}
              >
                {t.keyStrengths}
              </h2>
              <ul className="space-y-2">
                {professionalSummary.keyStrengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight
                      size={16}
                      className={cn(
                        'mt-0.5 flex-shrink-0',
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      )}
                    />
                    <span className={cn('text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                      {strength}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Achievements */}
            <div
              className={cn(
                'rounded-lg p-6 shadow-sm',
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
              )}
            >
              <h2
                className={cn(
                  'text-xl font-semibold mb-4',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}
              >
                {t.recentAchievements}
              </h2>
              <ul className="space-y-2">
                {professionalSummary.recentAchievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Award
                      size={16}
                      className={cn(
                        'mt-0.5 flex-shrink-0',
                        isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                      )}
                    />
                    <span className={cn('text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                      {achievement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="p-6 space-y-6">
            {/* Work Experience */}
            <div>
              <h2
                className={cn(
                  'text-xl font-semibold mb-4 flex items-center gap-2',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}
              >
                <Briefcase size={20} />
                {t.workExperience}
              </h2>
              <div className="space-y-4">
                {workExperience.map((exp) => (
                  <div
                    key={exp.id}
                    className={cn(
                      'rounded-lg p-5 shadow-sm border-l-4',
                      isDarkMode
                        ? 'bg-gray-800/50 border-gray-700 border-l-blue-500'
                        : 'bg-white border-gray-200 border-l-blue-500'
                    )}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <div>
                        <h3
                          className={cn(
                            'text-lg font-semibold',
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          )}
                        >
                          {exp.position}
                        </h3>
                        <p
                          className={cn(
                            'text-base font-medium',
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          )}
                        >
                          {exp.company}
                        </p>
                      </div>
                      <div className="flex flex-col items-start md:items-end mt-2 md:mt-0">
                        <span
                          className={cn(
                            'text-sm font-medium',
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          )}
                        >
                          {exp.duration}
                        </span>
                        {exp.current && (
                          <span
                            className={cn(
                              'text-xs px-2 py-1 rounded-full mt-1',
                              isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                            )}
                          >
                            {t.current}
                          </span>
                        )}
                      </div>
                    </div>
                    <p
                      className={cn(
                        'text-sm mb-2 flex items-center gap-1',
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      )}
                    >
                      <MapPin size={14} />
                      {exp.location}
                    </p>
                    <p
                      className={cn(
                        'text-sm mb-3',
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      )}
                    >
                      {exp.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className={cn(
                            'px-2 py-1 rounded text-xs font-medium',
                            isDarkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          )}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2
                className={cn(
                  'text-xl font-semibold mb-4 flex items-center gap-2',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}
              >
                <GraduationCap size={20} />
                {t.education}
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className={cn(
                      'rounded-lg p-5 shadow-sm border-l-4',
                      isDarkMode
                        ? 'bg-gray-800/50 border-gray-700 border-l-purple-500'
                        : 'bg-white border-gray-200 border-l-purple-500'
                    )}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <div>
                        <h3
                          className={cn(
                            'text-lg font-semibold',
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          )}
                        >
                          {edu.degree}
                        </h3>
                        <p
                          className={cn(
                            'text-base font-medium',
                            isDarkMode ? 'text-purple-400' : 'text-purple-600'
                          )}
                        >
                          {edu.institution}
                        </p>
                      </div>
                      <div className="flex flex-col items-start md:items-end mt-2 md:mt-0">
                        <span
                          className={cn(
                            'text-sm font-medium',
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          )}
                        >
                          {edu.duration}
                        </span>
                        <span
                          className={cn(
                            'text-sm mt-1',
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          )}
                        >
                          {edu.grade}
                        </span>
                      </div>
                    </div>
                    <p
                      className={cn(
                        'text-sm mb-2 flex items-center gap-1',
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      )}
                    >
                      <MapPin size={14} />
                      {edu.location}
                    </p>
                    <p
                      className={cn(
                        'text-sm',
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      )}
                    >
                      {edu.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h2
                className={cn(
                  'text-xl font-semibold mb-4 flex items-center gap-2',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}
              >
                <Award size={20} />
                {t.certifications}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className={cn(
                      'rounded-lg p-5 shadow-sm border',
                      isDarkMode
                        ? 'bg-gray-800/50 border-gray-700'
                        : 'bg-white border-gray-200'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3
                          className={cn(
                            'text-base font-semibold mb-1',
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          )}
                        >
                          {cert.name}
                        </h3>
                        <p
                          className={cn(
                            'text-sm',
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          )}
                        >
                          {cert.issuer}
                        </p>
                      </div>
                      {cert.current && (
                        <Award
                          size={20}
                          className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}
                        />
                      )}
                    </div>
                    <p
                      className={cn(
                        'text-xs mb-2',
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      )}
                    >
                      {cert.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span
                        className={cn(
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        )}
                      >
                        {t.issuedDate}: {cert.issueDate}
                      </span>
                      {cert.expiryDate && (
                        <span
                          className={cn(
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          )}
                        >
                          {t.expiryDate}: {cert.expiryDate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="p-6 space-y-6">
            <h2
              className={cn(
                'text-xl font-semibold mb-4 flex items-center gap-2',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}
            >
              <Code size={20} />
              {t.technicalSkills}
            </h2>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  selectedCategory === null
                    ? isDarkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                All Skills
              </button>
              {skillCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    selectedCategory === category.id
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills
                .filter((skill) => !selectedCategory || skill.category === selectedCategory)
                .map((skill) => {
                  const category = skillCategories.find((cat) => cat.id === skill.category);
                  return (
                    <div
                      key={skill.id}
                      className={cn(
                        'rounded-lg p-4 shadow-sm border border-l-4',
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700'
                          : 'bg-white border-gray-200',
                        getCategoryBorderColor(skill.category)
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3
                            className={cn(
                              'text-base font-semibold',
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            )}
                          >
                            {skill.name}
                          </h3>
                          {category && (
                            <p
                              className={cn(
                                'text-xs mt-1',
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              )}
                            >
                              {category.name}
                            </p>
                          )}
                        </div>
                        <span
                          className={cn(
                            'text-xs font-bold px-2 py-1 rounded',
                            isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                          )}
                        >
                          {skill.proficiency}%
                        </span>
                      </div>
                      {skill.description && (
                        <p
                          className={cn(
                            'text-xs mb-3',
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          )}
                        >
                          {skill.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs">
                        <span
                          className={cn(
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          )}
                        >
                          {skill.yearsOfExperience} {t.yearsExperience}
                        </span>
                        {skill.projects.length > 0 && (
                          <span
                            className={cn(
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            )}
                          >
                            {skill.projects.length} {t.projects}
                          </span>
                        )}
                      </div>
                      {/* Proficiency Bar */}
                      <div className="mt-3">
                        <div
                          className={cn(
                            'h-2 rounded-full overflow-hidden',
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                          )}
                        >
                          <div
                            className={cn(
                              'h-full transition-all duration-1000',
                              getCategoryBgColor(skill.category)
                            )}
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="p-6 space-y-6">
            <h2
              className={cn(
                'text-xl font-semibold mb-4',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}
            >
              {t.contactInformation}
            </h2>

            {/* Social Links */}
            <div
              className={cn(
                'rounded-lg p-6 shadow-sm',
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
              )}
            >
              <h3
                className={cn(
                  'text-lg font-semibold mb-4',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}
              >
                {t.connectWithMe}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {socialLinks.map((link) => {
                  const IconComponent = getSocialIcon(link.icon);
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-lg transition-all hover:scale-105',
                        isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      )}
                    >
                      <IconComponent
                        size={24}
                        className={cn(
                          'mb-2',
                          isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        )}
                      />
                      <span
                        className={cn(
                          'text-sm font-medium',
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        )}
                      >
                        {link.platform}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Contact Details */}
            <div
              className={cn(
                'rounded-lg p-6 shadow-sm',
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
              )}
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail
                    size={20}
                    className={cn(
                      'mt-0.5 flex-shrink-0',
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    )}
                  />
                  <div>
                    <p
                      className={cn(
                        'text-sm font-medium mb-1',
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      )}
                    >
                      Email
                    </p>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className={cn(
                        'text-sm',
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      )}
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone
                    size={20}
                    className={cn(
                      'mt-0.5 flex-shrink-0',
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    )}
                  />
                  <div>
                    <p
                      className={cn(
                        'text-sm font-medium mb-1',
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      )}
                    >
                      Phone
                    </p>
                    <a
                      href={`tel:${personalInfo.phone.replace(/\s/g, '')}`}
                      className={cn(
                        'text-sm',
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      )}
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin
                    size={20}
                    className={cn(
                      'mt-0.5 flex-shrink-0',
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    )}
                  />
                  <div>
                    <p
                      className={cn(
                        'text-sm font-medium mb-1',
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      )}
                    >
                      Location
                    </p>
                    <p
                      className={cn(
                        'text-sm',
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      )}
                    >
                      {personalInfo.location}
                    </p>
                    <p
                      className={cn(
                        'text-xs mt-1',
                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      )}
                    >
                      {personalInfo.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Download */}
            <div
              className={cn(
                'rounded-lg p-6 shadow-sm',
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
              )}
            >
              <h3
                className={cn(
                  'text-lg font-semibold mb-4',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}
              >
                {t.resumeDocuments}
              </h3>
              <button
                onClick={handleResumeDownload}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105',
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                )}
              >
                <Download size={20} />
                {t.downloadResume}
              </button>
              <p
                className={cn(
                  'text-xs mt-3',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}
              >
                {t.pdfHint}
              </p>
            </div>

            {/* Languages */}
            <div
              className={cn(
                'rounded-lg p-6 shadow-sm',
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
              )}
            >
              <h3
                className={cn(
                  'text-lg font-semibold mb-4 flex items-center gap-2',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}
              >
                <LanguagesIcon size={20} />
                Languages
              </h3>
              <div className="space-y-2">
                {personalInfo.languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      )}
                    >
                      {lang.name}
                    </span>
                    <span
                      className={cn(
                        'text-xs',
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      )}
                    >
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutMe;

