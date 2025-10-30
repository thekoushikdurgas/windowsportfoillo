// Portfolio Projects Data
// Real projects from Koushik Chandra Saha's GitHub repositories
// 
// Lottie animations are loaded from local JSON files in /public/projects/

import { Project } from '@/types/portfolio';

export const projects: Project[] = [
  {
    id: 'chat-app',
    title: 'Chat App on MERN Stack',
    description: 'Real-time messaging application with user authentication and group chats',
    longDescription: 'A full-stack real-time chat application built with MERN stack. Features include user authentication, real-time messaging using Socket.io, group chat functionality, message history, and responsive design.',
    image: '/projects/chat-app.jpg',
    lottieUrl: '/projects/Email.json',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io', 'JWT', 'Bcrypt'],
    githubUrl: 'https://github.com/thekoushikdurgas/chatapp',
    demoUrl: 'https://chatapp-demo.vercel.app',
    category: 'mern',
    status: 'completed',
    startDate: '2022-01-01',
    endDate: '2022-05-31',
    duration: '5 months',
    features: [
      'Real-time messaging',
      'User authentication with JWT',
      'Group chat functionality',
      'Message history storage',
      'Responsive design',
      'Online/offline status'
    ],
    metrics: {
      stars: 0,
      forks: 0,
      commits: 0,
      languages: { 'JavaScript': 60, 'HTML': 25, 'CSS': 15 },
      lastUpdated: '2022-05-31'
    },
    repository: {
      name: 'chatapp',
      fullName: 'thekoushikdurgas/chatapp',
      description: 'Real-time chat application built with MERN stack',
      htmlUrl: 'https://github.com/thekoushikdurgas/chatapp',
      cloneUrl: 'https://github.com/thekoushikdurgas/chatapp.git',
      languages: ['JavaScript', 'HTML', 'CSS'],
      topics: ['mern', 'chat', 'realtime', 'socketio'],
      createdAt: '2022-01-01T00:00:00Z',
      updatedAt: '2022-05-31T00:00:00Z'
    },
    screenshots: ['/projects/chat-app-1.jpg', '/projects/chat-app-2.jpg'],
    difficulty: 'intermediate',
    teamSize: 1,
    myRole: 'Full-stack Developer'
  },
  {
    id: 'portfolio',
    title: 'Portfolio on MERN Stack',
    description: 'Personal portfolio website showcasing projects and skills',
    longDescription: 'A comprehensive portfolio website built with MERN stack featuring project showcase, contact form, blog section, and admin panel for content management.',
    image: '/projects/portfolio.jpg',
    lottieUrl: '/projects/Creative 3D Visual Animation - Website Development.json',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Tailwind CSS', 'Multer'],
    githubUrl: 'https://github.com/thekoushikdurgas/Portfolio',
    demoUrl: 'https://thekoushikdurgas.com',
    category: 'mern',
    status: 'completed',
    startDate: '2021-12-01',
    endDate: '2022-01-31',
    duration: '2 months',
    features: [
      'Project showcase gallery',
      'Contact form with email integration',
      'Blog section',
      'Admin panel',
      'Responsive design',
      'SEO optimization'
    ],
    metrics: {
      stars: 0,
      forks: 0,
      commits: 0,
      languages: { 'JavaScript': 70, 'HTML': 20, 'CSS': 10 },
      lastUpdated: '2022-01-31'
    },
    repository: {
      name: 'Portfolio',
      fullName: 'thekoushikdurgas/Portfolio',
      description: 'Personal portfolio website built with MERN stack',
      htmlUrl: 'https://github.com/thekoushikdurgas/Portfolio',
      cloneUrl: 'https://github.com/thekoushikdurgas/Portfolio.git',
      languages: ['JavaScript', 'HTML', 'CSS'],
      topics: ['mern', 'portfolio', 'react', 'nodejs'],
      createdAt: '2021-12-01T00:00:00Z',
      updatedAt: '2022-01-31T00:00:00Z'
    },
    screenshots: ['/projects/portfolio-1.jpg', '/projects/portfolio-2.jpg'],
    difficulty: 'intermediate',
    teamSize: 1,
    myRole: 'Full-stack Developer'
  },
  {
    id: 'todo-list',
    title: 'To-Do List on MERN Stack',
    description: 'Task management application with CRUD operations and user authentication',
    longDescription: 'A comprehensive task management application featuring user authentication, CRUD operations, task categorization, priority levels, and deadline tracking.',
    image: '/projects/todo-list.jpg',
    lottieUrl: '/projects/Task Loader.json',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JWT', 'Bcrypt'],
    githubUrl: 'https://github.com/thekoushikdurgas/tkdtodolist',
    demoUrl: 'https://todo-demo.vercel.app',
    category: 'mern',
    status: 'completed',
    startDate: '2021-10-01',
    endDate: '2021-12-31',
    duration: '3 months',
    features: [
      'User authentication',
      'CRUD operations for tasks',
      'Task categorization',
      'Priority levels',
      'Deadline tracking',
      'Task filtering and sorting'
    ],
    metrics: {
      stars: 0,
      forks: 0,
      commits: 0,
      languages: { 'JavaScript': 65, 'HTML': 25, 'CSS': 10 },
      lastUpdated: '2021-12-31'
    },
    repository: {
      name: 'tkdtodolist',
      fullName: 'thekoushikdurgas/tkdtodolist',
      description: 'Task management application built with MERN stack',
      htmlUrl: 'https://github.com/thekoushikdurgas/tkdtodolist',
      cloneUrl: 'https://github.com/thekoushikdurgas/tkdtodolist.git',
      languages: ['JavaScript', 'HTML', 'CSS'],
      topics: ['mern', 'todo', 'task-management', 'react'],
      createdAt: '2021-10-01T00:00:00Z',
      updatedAt: '2021-12-31T00:00:00Z'
    },
    screenshots: ['/projects/todo-1.jpg', '/projects/todo-2.jpg'],
    difficulty: 'intermediate',
    teamSize: 1,
    myRole: 'Full-stack Developer'
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter on MERN Stack',
    description: 'Multi-unit conversion tool with conversion history and favorites',
    longDescription: 'A comprehensive unit conversion application supporting multiple unit types including length, weight, temperature, currency, and more with conversion history and favorites functionality.',
    image: '/projects/unit-converter.jpg',
    lottieUrl: '/projects/Maths formula.json',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'API Integration'],
    githubUrl: 'https://github.com/thekoushikdurgas/UnitConverter',
    demoUrl: 'https://unit-converter-demo.vercel.app',
    category: 'mern',
    status: 'completed',
    startDate: '2021-10-01',
    endDate: '2021-12-31',
    duration: '3 months',
    features: [
      'Multiple unit types conversion',
      'Conversion history',
      'Favorites functionality',
      'Real-time currency rates',
      'Responsive design',
      'Offline functionality'
    ],
    metrics: {
      stars: 0,
      forks: 0,
      commits: 0,
      languages: { 'JavaScript': 60, 'HTML': 30, 'CSS': 10 },
      lastUpdated: '2021-12-31'
    },
    repository: {
      name: 'UnitConverter',
      fullName: 'thekoushikdurgas/UnitConverter',
      description: 'Unit conversion application built with MERN stack',
      htmlUrl: 'https://github.com/thekoushikdurgas/UnitConverter',
      cloneUrl: 'https://github.com/thekoushikdurgas/UnitConverter.git',
      languages: ['JavaScript', 'HTML', 'CSS'],
      topics: ['mern', 'unit-converter', 'react', 'nodejs'],
      createdAt: '2021-10-01T00:00:00Z',
      updatedAt: '2021-12-31T00:00:00Z'
    },
    screenshots: ['/projects/unit-converter-1.jpg', '/projects/unit-converter-2.jpg'],
    difficulty: 'intermediate',
    teamSize: 1,
    myRole: 'Full-stack Developer'
  },
  {
    id: 'password-generator',
    title: 'Password Generator on MERN Stack',
    description: 'Secure password generator with customizable options and strength analysis',
    longDescription: 'A secure password generation tool with customizable length, character types, strength analysis, and password history for enhanced security.',
    image: '/projects/password-generator.jpg',
    lottieUrl: '/projects/LOCK WITH GREEN TICK.json',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Crypto'],
    githubUrl: 'https://github.com/thekoushikdurgas/tkdpasswordgenerator',
    demoUrl: 'https://password-generator-demo.vercel.app',
    category: 'mern',
    status: 'completed',
    startDate: '2021-08-01',
    endDate: '2021-10-31',
    duration: '3 months',
    features: [
      'Customizable password length',
      'Character type selection',
      'Password strength analysis',
      'Password history',
      'Copy to clipboard',
      'Secure generation'
    ],
    metrics: {
      stars: 0,
      forks: 0,
      commits: 0,
      languages: { 'JavaScript': 70, 'HTML': 20, 'CSS': 10 },
      lastUpdated: '2021-10-31'
    },
    repository: {
      name: 'tkdpasswordgenerator',
      fullName: 'thekoushikdurgas/tkdpasswordgenerator',
      description: 'Password generator application built with MERN stack',
      htmlUrl: 'https://github.com/thekoushikdurgas/tkdpasswordgenerator',
      cloneUrl: 'https://github.com/thekoushikdurgas/tkdpasswordgenerator.git',
      languages: ['JavaScript', 'HTML', 'CSS'],
      topics: ['mern', 'password-generator', 'security', 'react'],
      createdAt: '2021-08-01T00:00:00Z',
      updatedAt: '2021-10-31T00:00:00Z'
    },
    screenshots: ['/projects/password-generator-1.jpg', '/projects/password-generator-2.jpg'],
    difficulty: 'beginner',
    teamSize: 1,
    myRole: 'Full-stack Developer'
  },
  {
    id: 'resume-cv',
    title: 'Resume/CV on MERN Stack',
    description: 'Dynamic resume builder with multiple templates and PDF export',
    longDescription: 'A comprehensive resume builder application with multiple professional templates, real-time preview, PDF export functionality, and template customization options.',
    image: '/projects/resume-cv.jpg',
    lottieUrl: '/projects/Finding documents.json',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'PDF Generation', 'Tailwind CSS'],
    githubUrl: 'https://github.com/thekoushikdurgas/tkdcv',
    demoUrl: 'https://resume-builder-demo.vercel.app',
    category: 'mern',
    status: 'completed',
    startDate: '2021-05-01',
    endDate: '2021-07-31',
    duration: '3 months',
    features: [
      'Multiple resume templates',
      'Real-time preview',
      'PDF export functionality',
      'Template customization',
      'Data persistence',
      'Professional formatting'
    ],
    metrics: {
      stars: 0,
      forks: 0,
      commits: 0,
      languages: { 'JavaScript': 65, 'HTML': 25, 'CSS': 10 },
      lastUpdated: '2021-07-31'
    },
    repository: {
      name: 'tkdcv',
      fullName: 'thekoushikdurgas/tkdcv',
      description: 'Resume builder application built with MERN stack',
      htmlUrl: 'https://github.com/thekoushikdurgas/tkdcv',
      cloneUrl: 'https://github.com/thekoushikdurgas/tkdcv.git',
      languages: ['JavaScript', 'HTML', 'CSS'],
      topics: ['mern', 'resume-builder', 'pdf-generation', 'react'],
      createdAt: '2021-05-01T00:00:00Z',
      updatedAt: '2021-07-31T00:00:00Z'
    },
    screenshots: ['/projects/resume-1.jpg', '/projects/resume-2.jpg'],
    difficulty: 'intermediate',
    teamSize: 1,
    myRole: 'Full-stack Developer'
  },
  {
    id: 'icons',
    title: 'Icons on MERN Stack',
    description: 'Icon library and management system with search and categorization',
    longDescription: 'A comprehensive icon library application with search functionality, categorization, icon preview, and download capabilities for developers and designers.',
    image: '/projects/icons.jpg',
    lottieUrl: '/projects/Wonder Things.json',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'SVG Processing'],
    githubUrl: 'https://github.com/thekoushikdurgas/tkdicons',
    demoUrl: 'https://icons-demo.vercel.app',
    category: 'mern',
    status: 'completed',
    startDate: '2021-01-01',
    endDate: '2021-05-31',
    duration: '5 months',
    features: [
      'Icon search functionality',
      'Categorization system',
      'Icon preview',
      'Download capabilities',
      'SVG optimization',
      'Responsive design'
    ],
    metrics: {
      stars: 0,
      forks: 0,
      commits: 0,
      languages: { 'JavaScript': 60, 'HTML': 30, 'CSS': 10 },
      lastUpdated: '2021-05-31'
    },
    repository: {
      name: 'tkdicons',
      fullName: 'thekoushikdurgas/tkdicons',
      description: 'Icon library application built with MERN stack',
      htmlUrl: 'https://github.com/thekoushikdurgas/tkdicons',
      cloneUrl: 'https://github.com/thekoushikdurgas/tkdicons.git',
      languages: ['JavaScript', 'HTML', 'CSS'],
      topics: ['mern', 'icons', 'svg', 'react'],
      createdAt: '2021-01-01T00:00:00Z',
      updatedAt: '2021-05-31T00:00:00Z'
    },
    screenshots: ['/projects/icons-1.jpg', '/projects/icons-2.jpg'],
    difficulty: 'intermediate',
    teamSize: 1,
    myRole: 'Full-stack Developer'
  },
  {
    id: 'minify',
    title: 'Minify on MERN Stack',
    description: 'Code minification tool for CSS, JavaScript, and HTML optimization',
    longDescription: 'A web-based code minification tool supporting CSS, JavaScript, and HTML with optimization features, file upload, and batch processing capabilities.',
    image: '/projects/minify.jpg',
    lottieUrl: '/projects/code dark.json',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Code Minification'],
    githubUrl: 'https://github.com/thekoushikdurgas/tkdminify',
    demoUrl: 'https://minify-demo.vercel.app',
    category: 'mern',
    status: 'completed',
    startDate: '2021-01-01',
    endDate: '2021-05-31',
    duration: '5 months',
    features: [
      'CSS minification',
      'JavaScript minification',
      'HTML minification',
      'File upload support',
      'Batch processing',
      'Optimization statistics'
    ],
    metrics: {
      stars: 0,
      forks: 0,
      commits: 0,
      languages: { 'JavaScript': 70, 'HTML': 20, 'CSS': 10 },
      lastUpdated: '2021-05-31'
    },
    repository: {
      name: 'tkdminify',
      fullName: 'thekoushikdurgas/tkdminify',
      description: 'Code minification tool built with MERN stack',
      htmlUrl: 'https://github.com/thekoushikdurgas/tkdminify',
      cloneUrl: 'https://github.com/thekoushikdurgas/tkdminify.git',
      languages: ['JavaScript', 'HTML', 'CSS'],
      topics: ['mern', 'minification', 'optimization', 'react'],
      createdAt: '2021-01-01T00:00:00Z',
      updatedAt: '2021-05-31T00:00:00Z'
    },
    screenshots: ['/projects/minify-1.jpg', '/projects/minify-2.jpg'],
    difficulty: 'intermediate',
    teamSize: 1,
    myRole: 'Full-stack Developer'
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe on MERN Stack',
    description: 'Multiplayer tic-tac-toe game with real-time gameplay and score tracking',
    longDescription: 'A multiplayer tic-tac-toe game featuring real-time gameplay, score tracking, game history, and responsive design for both desktop and mobile devices.',
    image: '/projects/tic-tac-toe.jpg',
    lottieUrl: '/projects/Tic Tac Toe.json',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io'],
    githubUrl: 'https://github.com/thekoushikdurgas/tkdtictactoe',
    demoUrl: 'https://tictactoe-demo.vercel.app',
    category: 'game',
    status: 'completed',
    startDate: '2020-08-01',
    endDate: '2020-12-31',
    duration: '5 months',
    features: [
      'Real-time multiplayer gameplay',
      'Score tracking',
      'Game history',
      'Responsive design',
      'AI opponent option',
      'Game statistics'
    ],
    metrics: {
      stars: 0,
      forks: 0,
      commits: 0,
      languages: { 'JavaScript': 65, 'HTML': 25, 'CSS': 10 },
      lastUpdated: '2020-12-31'
    },
    repository: {
      name: 'tkdtictactoe',
      fullName: 'thekoushikdurgas/tkdtictactoe',
      description: 'Tic-tac-toe game built with MERN stack',
      htmlUrl: 'https://github.com/thekoushikdurgas/tkdtictactoe',
      cloneUrl: 'https://github.com/thekoushikdurgas/tkdtictactoe.git',
      languages: ['JavaScript', 'HTML', 'CSS'],
      topics: ['mern', 'tic-tac-toe', 'game', 'react'],
      createdAt: '2020-08-01T00:00:00Z',
      updatedAt: '2020-12-31T00:00:00Z'
    },
    screenshots: ['/projects/tic-tac-toe-1.jpg', '/projects/tic-tac-toe-2.jpg'],
    difficulty: 'beginner',
    teamSize: 1,
    myRole: 'Full-stack Developer'
  },
  {
    id: 'ludo',
    title: 'Ludo on MERN Stack',
    description: 'Digital Ludo board game with multiplayer support and game rules',
    longDescription: 'A digital implementation of the classic Ludo board game with multiplayer support, dice rolling, piece movement, and complete game rules implementation.',
    image: '/projects/ludo.jpg',
    lottieUrl: '/projects/red and green ludo dice.json',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io', 'Canvas'],
    githubUrl: 'https://github.com/thekoushikdurgas/tkdLudo',
    demoUrl: 'https://ludo-demo.vercel.app',
    category: 'game',
    status: 'completed',
    startDate: '2020-05-01',
    endDate: '2020-08-31',
    duration: '4 months',
    features: [
      'Multiplayer support',
      'Dice rolling animation',
      'Piece movement logic',
      'Game rules implementation',
      'Score tracking',
      'Responsive design'
    ],
    metrics: {
      stars: 0,
      forks: 0,
      commits: 0,
      languages: { 'JavaScript': 60, 'HTML': 30, 'CSS': 10 },
      lastUpdated: '2020-08-31'
    },
    repository: {
      name: 'tkdLudo',
      fullName: 'thekoushikdurgas/tkdLudo',
      description: 'Ludo game built with MERN stack',
      htmlUrl: 'https://github.com/thekoushikdurgas/tkdLudo',
      cloneUrl: 'https://github.com/thekoushikdurgas/tkdLudo.git',
      languages: ['JavaScript', 'HTML', 'CSS'],
      topics: ['mern', 'ludo', 'game', 'react'],
      createdAt: '2020-05-01T00:00:00Z',
      updatedAt: '2020-08-31T00:00:00Z'
    },
    screenshots: ['/projects/ludo-1.jpg', '/projects/ludo-2.jpg'],
    difficulty: 'advanced',
    teamSize: 1,
    myRole: 'Full-stack Developer'
  },
  {
    id: 'music-player',
    title: 'Music Player on MERN Stack',
    description: 'Web-based music player with playlist management and audio controls',
    longDescription: 'A comprehensive web-based music player featuring playlist management, audio controls, music library, search functionality, and responsive design.',
    image: '/projects/music-player.jpg',
    lottieUrl: '/projects/Music Loader.json',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Audio API', 'File Upload'],
    githubUrl: 'https://github.com/thekoushikdurgas/tkdmusic',
    demoUrl: 'https://music-player-demo.vercel.app',
    category: 'utility',
    status: 'completed',
    startDate: '2020-02-01',
    endDate: '2020-05-31',
    duration: '4 months',
    features: [
      'Playlist management',
      'Audio controls (play, pause, skip)',
      'Music library',
      'Search functionality',
      'File upload support',
      'Responsive design'
    ],
    metrics: {
      stars: 0,
      forks: 0,
      commits: 0,
      languages: { 'JavaScript': 65, 'HTML': 25, 'CSS': 10 },
      lastUpdated: '2020-05-31'
    },
    repository: {
      name: 'tkdmusic',
      fullName: 'thekoushikdurgas/tkdmusic',
      description: 'Music player application built with MERN stack',
      htmlUrl: 'https://github.com/thekoushikdurgas/tkdmusic',
      cloneUrl: 'https://github.com/thekoushikdurgas/tkdmusic.git',
      languages: ['JavaScript', 'HTML', 'CSS'],
      topics: ['mern', 'music-player', 'audio', 'react'],
      createdAt: '2020-02-01T00:00:00Z',
      updatedAt: '2020-05-31T00:00:00Z'
    },
    screenshots: ['/projects/music-player-1.jpg', '/projects/music-player-2.jpg'],
    difficulty: 'intermediate',
    teamSize: 1,
    myRole: 'Full-stack Developer'
  },
  {
    id: 'wordle',
    title: 'Wordle on MERN Stack',
    description: 'Word guessing game with daily challenges and score tracking',
    longDescription: 'A web-based implementation of the popular Wordle game featuring daily challenges, score tracking, game statistics, and responsive design.',
    image: '/projects/wordle.jpg',
    lottieUrl: '/projects/Word puzzle.json',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Word API'],
    githubUrl: 'https://github.com/thekoushikdurgas/Wordle',
    demoUrl: 'https://wordle-demo.vercel.app',
    category: 'game',
    status: 'completed',
    startDate: '2019-11-01',
    endDate: '2020-01-31',
    duration: '3 months',
    features: [
      'Daily word challenges',
      'Score tracking',
      'Game statistics',
      'Word validation',
      'Responsive design',
      'Keyboard input'
    ],
    metrics: {
      stars: 0,
      forks: 0,
      commits: 0,
      languages: { 'JavaScript': 70, 'HTML': 20, 'CSS': 10 },
      lastUpdated: '2020-01-31'
    },
    repository: {
      name: 'Wordle',
      fullName: 'thekoushikdurgas/Wordle',
      description: 'Wordle game built with MERN stack',
      htmlUrl: 'https://github.com/thekoushikdurgas/Wordle',
      cloneUrl: 'https://github.com/thekoushikdurgas/Wordle.git',
      languages: ['JavaScript', 'HTML', 'CSS'],
      topics: ['mern', 'wordle', 'game', 'react'],
      createdAt: '2019-11-01T00:00:00Z',
      updatedAt: '2020-01-31T00:00:00Z'
    },
    screenshots: ['/projects/wordle-1.jpg', '/projects/wordle-2.jpg'],
    difficulty: 'intermediate',
    teamSize: 1,
    myRole: 'Full-stack Developer'
  },
  {
    id: 'login-auth',
    title: 'Login/Auth System on MERN Stack',
    description: 'Complete authentication system with login, registration, and password reset',
    longDescription: 'A comprehensive authentication system featuring user registration, login, password reset, email verification, and secure session management.',
    image: '/projects/login-auth.jpg',
    lottieUrl: '/projects/Email.json',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JWT', 'Bcrypt', 'Nodemailer'],
    githubUrl: 'https://github.com/thekoushikdurgas/tkdlogin',
    demoUrl: 'https://auth-demo.vercel.app',
    category: 'mern',
    status: 'completed',
    startDate: '2019-01-01',
    endDate: '2019-12-31',
    duration: '12 months',
    features: [
      'User registration',
      'Login functionality',
      'Password reset',
      'Email verification',
      'Session management',
      'Security features'
    ],
    metrics: {
      stars: 0,
      forks: 0,
      commits: 0,
      languages: { 'JavaScript': 70, 'HTML': 20, 'CSS': 10 },
      lastUpdated: '2019-12-31'
    },
    repository: {
      name: 'tkdlogin',
      fullName: 'thekoushikdurgas/tkdlogin',
      description: 'Authentication system built with MERN stack',
      htmlUrl: 'https://github.com/thekoushikdurgas/tkdlogin',
      cloneUrl: 'https://github.com/thekoushikdurgas/tkdlogin.git',
      languages: ['JavaScript', 'HTML', 'CSS'],
      topics: ['mern', 'authentication', 'jwt', 'react'],
      createdAt: '2019-01-01T00:00:00Z',
      updatedAt: '2019-12-31T00:00:00Z'
    },
    screenshots: ['/projects/login-auth-1.jpg', '/projects/login-auth-2.jpg'],
    difficulty: 'intermediate',
    teamSize: 1,
    myRole: 'Full-stack Developer'
  }
];

// Project categories for filtering
export const categories = [
  { id: 'all', name: 'All Projects', count: 13, color: 'blue', description: 'All projects in the portfolio' },
  { id: 'mern', name: 'MERN Stack', count: 8, color: 'green', description: 'Projects built with MongoDB, Express.js, React, and Node.js' },
  { id: 'game', name: 'Games', count: 3, color: 'purple', description: 'Interactive games and entertainment applications' },
  { id: 'utility', name: 'Utilities', count: 2, color: 'orange', description: 'Utility applications and tools' },
  { id: 'python', name: 'Python', count: 0, color: 'yellow', description: 'Projects built with Python and related frameworks' },
  { id: 'php', name: 'PHP', count: 0, color: 'pink', description: 'Projects built with PHP and related technologies' }
];

// Helper functions
export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'all') return projects;
  return projects.filter(project => project.category === category);
};

export const getProjectsByTechnology = (technology: string): Project[] => {
  return projects.filter(project => 
    project.technologies.some(tech => 
      tech.toLowerCase().includes(technology.toLowerCase())
    )
  );
};

export const searchProjects = (query: string): Project[] => {
  const lowercaseQuery = query.toLowerCase();
  return projects.filter(project => 
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.technologies.some(tech => 
      tech.toLowerCase().includes(lowercaseQuery)
    )
  );
};
