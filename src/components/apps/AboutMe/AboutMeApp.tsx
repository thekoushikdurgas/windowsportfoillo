'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLearn } from '@/contexts/LearnContext';

export default function AboutMeApp() {
  const { showHelp } = useLearn();
  const [activeSection, setActiveSection] = useState('personal');
  const sections = [
    { id: 'personal', title: 'Personal Info', icon: '👋' },
    { id: 'skills', title: 'Skills', icon: '🛠️' },
    { id: 'experience', title: 'Experience', icon: '💼' },
    { id: 'projects', title: 'Projects', icon: '🚀' },
    { id: 'contact', title: 'Contact', icon: '📞' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
    >
      <div className="h-full flex flex-col">
        {/* Enhanced Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center p-8 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
              <span className="text-4xl text-white">👨‍💻</span>
            </div>
            {/* Floating particles around avatar */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 20}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">John Doe</h1>
          <p className="text-gray-600 text-lg mb-1">Senior Full Stack Developer</p>
          <p className="text-gray-500 text-sm">Creating digital experiences that matter</p>
          
          {/* Status indicator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Available for opportunities
          </motion.div>
        </motion.div>

        {/* Navigation */}
        <div className="flex bg-white/60 backdrop-blur-sm border-b border-gray-200">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeSection === 'personal' && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">👋</span>
                  Personal Information
                  <button
                    onClick={() => showHelp('personal-info')}
                    className="ml-auto text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Learn more
                  </button>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📍</span>
                      <span className="text-gray-700">Based in San Francisco, CA</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📧</span>
                      <span className="text-gray-700">hello@example.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🎓</span>
                      <span className="text-gray-700">Computer Science Degree</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">💼</span>
                      <span className="text-gray-700">5+ years experience</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🌐</span>
                      <span className="text-gray-700">Available for remote work</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">⏰</span>
                      <span className="text-gray-700">PST Timezone</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  About Me
                  <button
                    onClick={() => showHelp('about-bio')}
                    className="ml-auto text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Learn more
                  </button>
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    I&apos;m a passionate full-stack developer with a love for creating beautiful, 
                    functional applications. I specialize in modern web technologies and 
                    have a keen eye for design and user experience.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    When I&apos;m not coding, you can find me exploring new technologies, 
                    contributing to open source projects, or enjoying the great outdoors 
                    in the Bay Area.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🛠️</span>
                  Technical Skills
                  <button
                    onClick={() => showHelp('technical-skills')}
                    className="ml-auto text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Learn more
                  </button>
                </h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-xl">⚛️</span>
                      Frontend Development
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { name: 'React', level: 95, color: 'blue' },
                        { name: 'Next.js', level: 90, color: 'blue' },
                        { name: 'TypeScript', level: 88, color: 'blue' },
                        { name: 'Vue.js', level: 75, color: 'blue' },
                        { name: 'Tailwind CSS', level: 92, color: 'blue' },
                        { name: 'Framer Motion', level: 85, color: 'blue' }
                      ].map((skill) => (
                        <motion.div
                          key={skill.name}
                          className="bg-blue-50 border border-blue-200 rounded-lg p-3 hover:shadow-md transition-all duration-300 cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-800">{skill.name}</span>
                            <span className="text-xs text-blue-600">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <motion.div
                              className="bg-blue-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-xl">🔧</span>
                      Backend Development
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { name: 'Node.js', level: 90, color: 'green' },
                        { name: 'Python', level: 85, color: 'green' },
                        { name: 'PostgreSQL', level: 88, color: 'green' },
                        { name: 'MongoDB', level: 82, color: 'green' },
                        { name: 'Redis', level: 75, color: 'green' },
                        { name: 'Docker', level: 80, color: 'green' }
                      ].map((skill) => (
                        <motion.div
                          key={skill.name}
                          className="bg-green-50 border border-green-200 rounded-lg p-3 hover:shadow-md transition-all duration-300 cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-800">{skill.name}</span>
                            <span className="text-xs text-green-600">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-green-100 rounded-full h-2">
                            <motion.div
                              className="bg-green-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: 0.4 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-xl">🛠️</span>
                      Tools & Technologies
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { name: 'Git', level: 95, color: 'purple' },
                        { name: 'AWS', level: 78, color: 'purple' },
                        { name: 'Figma', level: 88, color: 'purple' },
                        { name: 'Adobe XD', level: 75, color: 'purple' },
                        { name: 'Agile', level: 85, color: 'purple' },
                        { name: 'Jest', level: 82, color: 'purple' }
                      ].map((skill) => (
                        <motion.div
                          key={skill.name}
                          className="bg-purple-50 border border-purple-200 rounded-lg p-3 hover:shadow-md transition-all duration-300 cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-purple-800">{skill.name}</span>
                            <span className="text-xs text-purple-600">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-purple-100 rounded-full h-2">
                            <motion.div
                              className="bg-purple-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: 0.6 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💼</span>
                  Work Experience
                  <button
                    onClick={() => showHelp('work-experience')}
                    className="ml-auto text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Learn more
                  </button>
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-800 text-lg">Senior Full Stack Developer</h3>
                    <p className="text-sm text-gray-600">Tech Corp • 2021 - Present</p>
                    <p className="text-gray-700 mt-2">Leading development of scalable web applications using React, Node.js, and cloud technologies.</p>
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                      <li>Architected microservices infrastructure serving 100K+ users</li>
                      <li>Led team of 5 developers in agile environment</li>
                      <li>Improved application performance by 40%</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-800 text-lg">Frontend Developer</h3>
                    <p className="text-sm text-gray-600">StartupXYZ • 2019 - 2021</p>
                    <p className="text-gray-700 mt-2">Built responsive user interfaces with React and modern CSS frameworks.</p>
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                      <li>Developed component library used across 10+ projects</li>
                      <li>Implemented automated testing reducing bugs by 60%</li>
                      <li>Collaborated with designers on user experience improvements</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-gray-800 text-lg">Junior Developer</h3>
                    <p className="text-sm text-gray-600">WebAgency • 2018 - 2019</p>
                    <p className="text-gray-700 mt-2">Developed and maintained client websites using various technologies.</p>
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                      <li>Created 20+ responsive websites for local businesses</li>
                      <li>Learned modern development practices and tools</li>
                      <li>Contributed to open source projects</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  Featured Projects
                  <button
                    onClick={() => showHelp('featured-projects')}
                    className="ml-auto text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Learn more
                  </button>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-800 mb-2">E-commerce Platform</h3>
                    <p className="text-sm text-gray-600 mb-3">Full-stack e-commerce solution with React, Node.js, and PostgreSQL</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {['React', 'Node.js', 'PostgreSQL', 'Stripe'].map((tech) => (
                        <span key={tech} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Project →
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-800 mb-2">Task Management App</h3>
                    <p className="text-sm text-gray-600 mb-3">Collaborative task management with real-time updates</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {['Vue.js', 'Socket.io', 'MongoDB', 'Docker'].map((tech) => (
                        <span key={tech} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Project →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📞</span>
                  Let&apos;s Connect
                  <button
                    onClick={() => showHelp('contact-info')}
                    className="ml-auto text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Learn more
                  </button>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📧</span>
                      <div>
                        <p className="font-medium text-gray-800">Email</p>
                        <p className="text-gray-600">hello@example.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💼</span>
                      <div>
                        <p className="font-medium text-gray-800">LinkedIn</p>
                        <p className="text-gray-600">linkedin.com/in/yourprofile</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🐙</span>
                      <div>
                        <p className="font-medium text-gray-800">GitHub</p>
                        <p className="text-gray-600">github.com/yourusername</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      📧 Send Email
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      💼 View LinkedIn
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors font-medium"
                    >
                      🐙 View GitHub
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
