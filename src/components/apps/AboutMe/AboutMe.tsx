'use client'

import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Github, Linkedin, Code } from 'lucide-react'

export default function AboutMe() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-32 h-32 bg-gradient-to-br from-windows-blue to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <User className="w-16 h-16 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
          >
            Durgas User
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            Full Stack Developer & Windows 11 Enthusiast
          </motion.p>
        </div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Code className="w-6 h-6 mr-2 text-windows-blue" />
            About Me
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            I'm a passionate developer who loves creating innovative web applications. 
            This DurgasOS project showcases my skills in building complex user interfaces 
            that replicate real-world operating systems. I specialize in React, Next.js, 
            TypeScript, and modern web technologies.
          </p>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-windows-blue" />
              <span className="text-gray-600 dark:text-gray-300">durgas@example.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-windows-blue" />
              <span className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-windows-blue" />
              <span className="text-gray-600 dark:text-gray-300">San Francisco, CA</span>
            </div>
            <div className="flex items-center space-x-3">
              <Github className="w-5 h-5 text-windows-blue" />
              <span className="text-gray-600 dark:text-gray-300">github.com/durgas</span>
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Technical Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'React & Next.js',
              'TypeScript',
              'Node.js',
              'Python',
              'PostgreSQL',
              'MongoDB',
              'AWS',
              'Docker',
              'Git'
            ].map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                className="bg-windows-blue bg-opacity-10 rounded-lg p-3 text-center"
              >
                <span className="text-windows-blue font-medium">{skill}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
