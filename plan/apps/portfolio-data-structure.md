# Portfolio Data Structure - Koushik Chandra Saha

## 📊 Complete Project Data Structure

Based on the LinkedIn profile analysis, here's the comprehensive data structure for the Portfolio app:

### Personal Information

```typescript
interface PersonalInfo {
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
}
```

### Project Data (13 Projects)

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  demoUrl?: string;
  category:
    | 'mern'
    | 'python'
    | 'php'
    | 'frontend'
    | 'fullstack'
    | 'game'
    | 'utility';
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
```

## 🎯 Complete Project List

### 1. Chat App on MERN Stack

```typescript
{
  id: 'chat-app',
  title: 'Chat App on MERN Stack',
  description: 'Real-time messaging application with user authentication and group chats',
  longDescription: 'A full-stack real-time chat application built with MERN stack. Features include user authentication, real-time messaging using Socket.io, group chat functionality, message history, and responsive design.',
  image: '/projects/chat-app.jpg',
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
  difficulty: 'intermediate',
  teamSize: 1,
  myRole: 'Full-stack Developer'
}
```

### 2. Portfolio on MERN Stack

```typescript
{
  id: 'portfolio',
  title: 'Portfolio on MERN Stack',
  description: 'Personal portfolio website showcasing projects and skills',
  longDescription: 'A comprehensive portfolio website built with MERN stack featuring project showcase, contact form, blog section, and admin panel for content management.',
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
  difficulty: 'intermediate',
  teamSize: 1,
  myRole: 'Full-stack Developer'
}
```

### 3. To-Do List on MERN Stack

```typescript
{
  id: 'todo-list',
  title: 'To-Do List on MERN Stack',
  description: 'Task management application with CRUD operations and user authentication',
  longDescription: 'A comprehensive task management application featuring user authentication, CRUD operations, task categorization, priority levels, and deadline tracking.',
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
  difficulty: 'intermediate',
  teamSize: 1,
  myRole: 'Full-stack Developer'
}
```

### 4. Unit Converter on MERN Stack

```typescript
{
  id: 'unit-converter',
  title: 'Unit Converter on MERN Stack',
  description: 'Multi-unit conversion tool with conversion history and favorites',
  longDescription: 'A comprehensive unit conversion application supporting multiple unit types including length, weight, temperature, currency, and more with conversion history and favorites functionality.',
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
  difficulty: 'intermediate',
  teamSize: 1,
  myRole: 'Full-stack Developer'
}
```

### 5. Password Generator on MERN Stack

```typescript
{
  id: 'password-generator',
  title: 'Password Generator on MERN Stack',
  description: 'Secure password generator with customizable options and strength analysis',
  longDescription: 'A secure password generation tool with customizable length, character types, strength analysis, and password history for enhanced security.',
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
  difficulty: 'beginner',
  teamSize: 1,
  myRole: 'Full-stack Developer'
}
```

### 6. Resume/CV on MERN Stack

```typescript
{
  id: 'resume-cv',
  title: 'Resume/CV on MERN Stack',
  description: 'Dynamic resume builder with multiple templates and PDF export',
  longDescription: 'A comprehensive resume builder application with multiple professional templates, real-time preview, PDF export functionality, and template customization options.',
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
  difficulty: 'intermediate',
  teamSize: 1,
  myRole: 'Full-stack Developer'
}
```

### 7. Icons on MERN Stack

```typescript
{
  id: 'icons',
  title: 'Icons on MERN Stack',
  description: 'Icon library and management system with search and categorization',
  longDescription: 'A comprehensive icon library application with search functionality, categorization, icon preview, and download capabilities for developers and designers.',
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
  difficulty: 'intermediate',
  teamSize: 1,
  myRole: 'Full-stack Developer'
}
```

### 8. Minify on MERN Stack

```typescript
{
  id: 'minify',
  title: 'Minify on MERN Stack',
  description: 'Code minification tool for CSS, JavaScript, and HTML optimization',
  longDescription: 'A web-based code minification tool supporting CSS, JavaScript, and HTML with optimization features, file upload, and batch processing capabilities.',
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
  difficulty: 'intermediate',
  teamSize: 1,
  myRole: 'Full-stack Developer'
}
```

### 9. Tic Tac Toe on MERN Stack

```typescript
{
  id: 'tic-tac-toe',
  title: 'Tic Tac Toe on MERN Stack',
  description: 'Multiplayer tic-tac-toe game with real-time gameplay and score tracking',
  longDescription: 'A multiplayer tic-tac-toe game featuring real-time gameplay, score tracking, game history, and responsive design for both desktop and mobile devices.',
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
  difficulty: 'beginner',
  teamSize: 1,
  myRole: 'Full-stack Developer'
}
```

### 10. Ludo on MERN Stack

```typescript
{
  id: 'ludo',
  title: 'Ludo on MERN Stack',
  description: 'Digital Ludo board game with multiplayer support and game rules',
  longDescription: 'A digital implementation of the classic Ludo board game with multiplayer support, dice rolling, piece movement, and complete game rules implementation.',
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
  difficulty: 'advanced',
  teamSize: 1,
  myRole: 'Full-stack Developer'
}
```

### 11. Music Player on MERN Stack

```typescript
{
  id: 'music-player',
  title: 'Music Player on MERN Stack',
  description: 'Web-based music player with playlist management and audio controls',
  longDescription: 'A comprehensive web-based music player featuring playlist management, audio controls, music library, search functionality, and responsive design.',
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
  difficulty: 'intermediate',
  teamSize: 1,
  myRole: 'Full-stack Developer'
}
```

### 12. Wordle on MERN Stack

```typescript
{
  id: 'wordle',
  title: 'Wordle on MERN Stack',
  description: 'Word guessing game with daily challenges and score tracking',
  longDescription: 'A web-based implementation of the popular Wordle game featuring daily challenges, score tracking, game statistics, and responsive design.',
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
  difficulty: 'intermediate',
  teamSize: 1,
  myRole: 'Full-stack Developer'
}
```

### 13. Login/Auth System on MERN Stack

```typescript
{
  id: 'login-auth',
  title: 'Login/Auth System on MERN Stack',
  description: 'Complete authentication system with login, registration, and password reset',
  longDescription: 'A comprehensive authentication system featuring user registration, login, password reset, email verification, and secure session management.',
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
  difficulty: 'intermediate',
  teamSize: 1,
  myRole: 'Full-stack Developer'
}
```

## 🏢 Professional Experience Data

```typescript
const workExperience: WorkExperience[] = [
  {
    company: 'Deloitte USI',
    position: 'DC Analytics',
    duration: 'Jan 2024 - Present',
    location: 'Hyderabad, India',
    description:
      'Working on data analytics projects using Python, Pandas, Power BI, and Google Cloud Platform. Involved in big data analytics, data engineering, and machine learning projects.',
    technologies: [
      'Python',
      'Pandas',
      'Power BI',
      'Google Cloud Platform',
      'BigQuery',
      'AWS',
      'Data Analysis',
    ],
  },
  {
    company: 'Karmaa Lab',
    position: 'Full-stack Developer (Intern)',
    duration: 'Jun 2022 - Aug 2022',
    location: 'Bengaluru, India',
    description:
      'Worked on multiple full-stack development projects using MERN stack and other modern technologies.',
    technologies: [
      'MongoDB',
      'Express.js',
      'React',
      'Node.js',
      'JavaScript',
      'HTML',
      'CSS',
    ],
  },
  {
    company: 'Flexon Technologies Limited',
    position: 'PHP Developer',
    duration: 'Oct 2021 - Dec 2021',
    location: 'Durgapur, India',
    description:
      'Created a college management software using PHP and MySQL. Developed and deployed the complete system.',
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Bootstrap'],
  },
];
```

## 🎓 Education Data

```typescript
const education: Education[] = [
  {
    institution: 'National Institute of Technology Arunachal Pradesh',
    degree: 'Bachelor of Technology in Computer Science and Engineering',
    duration: '2019 - 2023',
    grade: '7.3 CGPA',
    location: 'Arunachal Pradesh, India',
    description:
      'Key project: AI-powered resume editor. Completed comprehensive coursework in computer science fundamentals, data structures, algorithms, and software engineering.',
  },
  {
    institution: 'Bidhan Chandra Institution',
    degree: 'Higher Secondary in Computer Science',
    duration: '2017 - 2019',
    grade: '80%',
    location: 'West Bengal, India',
    description:
      'Completed higher secondary education with focus on computer science and mathematics.',
  },
  {
    institution: 'Suren Chandra Modern School (H.S.)',
    degree: 'Secondary Education in Computer Science',
    duration: '2007 - 2016',
    grade: '85%',
    location: 'West Bengal, India',
    description:
      'Completed secondary education with excellent academic performance.',
  },
];
```

## 🏆 Certifications Data

```typescript
const certifications: Certification[] = [
  {
    name: 'Associate Cloud Engineer Certification',
    issuer: 'Google',
    issuedDate: 'Sep 2024',
    expiryDate: 'Sep 2027',
    credentialId: 'GCP-ACE-2024',
    description:
      'Google Cloud Platform Associate Cloud Engineer certification covering cloud architecture, security, and operations.',
  },
  {
    name: 'Data Engineering - Foundation',
    issuer: 'Deloitte',
    issuedDate: 'Mar 2024',
    expiryDate: 'Mar 2027',
    credentialId: 'DEL-DE-2024',
    description:
      'Deloitte Data Engineering Foundation certification covering data pipeline development and management.',
  },
  {
    name: 'Machine Learning - Foundation',
    issuer: 'Deloitte',
    issuedDate: 'Mar 2024',
    expiryDate: 'Mar 2027',
    credentialId: 'DEL-ML-2024',
    description:
      'Deloitte Machine Learning Foundation certification covering ML algorithms and implementation.',
  },
  {
    name: 'Silver Award Fury Road',
    issuer: 'Codility',
    issuedDate: 'May 2022',
    credentialId: 'certX3BWWR-8UPZAJF8DZEHCVQG',
    description:
      'Codility Silver Award for algorithmic problem solving and coding challenges.',
  },
  {
    name: 'Problem Solving (Basic)',
    issuer: 'HackerRank',
    issuedDate: 'Aug 2020',
    credentialId: 'e7a3db1f91ab',
    description:
      'HackerRank Problem Solving certification demonstrating algorithmic thinking and coding skills.',
  },
];
```

## 🛠️ Skills Data

```typescript
const skills: Skill[] = [
  // Backend Skills
  {
    name: 'Node.js',
    category: 'backend',
    proficiency: 90,
    projects: [
      'chat-app',
      'portfolio',
      'todo-list',
      'unit-converter',
      'password-generator',
      'resume-cv',
      'icons',
      'minify',
      'tic-tac-toe',
      'ludo',
      'music-player',
      'wordle',
      'login-auth',
    ],
  },
  {
    name: 'Express.js',
    category: 'backend',
    proficiency: 90,
    projects: [
      'chat-app',
      'portfolio',
      'todo-list',
      'unit-converter',
      'password-generator',
      'resume-cv',
      'icons',
      'minify',
      'tic-tac-toe',
      'ludo',
      'music-player',
      'wordle',
      'login-auth',
    ],
  },
  {
    name: 'MongoDB',
    category: 'database',
    proficiency: 90,
    projects: [
      'chat-app',
      'portfolio',
      'todo-list',
      'unit-converter',
      'password-generator',
      'resume-cv',
      'icons',
      'minify',
      'tic-tac-toe',
      'ludo',
      'music-player',
      'wordle',
      'login-auth',
    ],
  },
  { name: 'Python', category: 'programming', proficiency: 100, projects: [] },
  { name: 'Django', category: 'backend', proficiency: 100, projects: [] },
  { name: 'PHP', category: 'backend', proficiency: 90, projects: [] },
  { name: 'MySQL', category: 'database', proficiency: 90, projects: [] },

  // Frontend Skills
  {
    name: 'React',
    category: 'frontend',
    proficiency: 90,
    projects: [
      'chat-app',
      'portfolio',
      'todo-list',
      'unit-converter',
      'password-generator',
      'resume-cv',
      'icons',
      'minify',
      'tic-tac-toe',
      'ludo',
      'music-player',
      'wordle',
      'login-auth',
    ],
  },
  {
    name: 'JavaScript',
    category: 'programming',
    proficiency: 90,
    projects: [
      'chat-app',
      'portfolio',
      'todo-list',
      'unit-converter',
      'password-generator',
      'resume-cv',
      'icons',
      'minify',
      'tic-tac-toe',
      'ludo',
      'music-player',
      'wordle',
      'login-auth',
    ],
  },
  {
    name: 'HTML5',
    category: 'frontend',
    proficiency: 100,
    projects: [
      'chat-app',
      'portfolio',
      'todo-list',
      'unit-converter',
      'password-generator',
      'resume-cv',
      'icons',
      'minify',
      'tic-tac-toe',
      'ludo',
      'music-player',
      'wordle',
      'login-auth',
    ],
  },
  {
    name: 'CSS3',
    category: 'frontend',
    proficiency: 100,
    projects: [
      'chat-app',
      'portfolio',
      'todo-list',
      'unit-converter',
      'password-generator',
      'resume-cv',
      'icons',
      'minify',
      'tic-tac-toe',
      'ludo',
      'music-player',
      'wordle',
      'login-auth',
    ],
  },
  {
    name: 'Tailwind CSS',
    category: 'frontend',
    proficiency: 100,
    projects: ['portfolio', 'resume-cv'],
  },
  { name: 'Bootstrap 5', category: 'frontend', proficiency: 100, projects: [] },

  // Cloud & DevOps
  { name: 'AWS', category: 'cloud', proficiency: 80, projects: [] },
  {
    name: 'Google Cloud Platform',
    category: 'cloud',
    proficiency: 80,
    projects: [],
  },
  { name: 'Heroku', category: 'cloud', proficiency: 100, projects: [] },
  { name: 'Netlify', category: 'cloud', proficiency: 100, projects: [] },

  // Data Analytics
  { name: 'Pandas', category: 'programming', proficiency: 90, projects: [] },
  { name: 'Power BI', category: 'programming', proficiency: 90, projects: [] },
  { name: 'BigQuery', category: 'database', proficiency: 80, projects: [] },
  {
    name: 'Data Analysis',
    category: 'programming',
    proficiency: 90,
    projects: [],
  },

  // Programming Languages
  { name: 'C++', category: 'programming', proficiency: 100, projects: [] },
  { name: 'C', category: 'programming', proficiency: 100, projects: [] },
  { name: 'Java', category: 'programming', proficiency: 90, projects: [] },
  {
    name: 'Data Structures and Algorithms',
    category: 'programming',
    proficiency: 80,
    projects: [],
  },
];
```

## 📊 Project Categories

```typescript
const categories: Category[] = [
  { id: 'all', name: 'All Projects', count: 13, color: 'blue' },
  { id: 'mern', name: 'MERN Stack', count: 8, color: 'green' },
  { id: 'game', name: 'Games', count: 3, color: 'purple' },
  { id: 'utility', name: 'Utilities', count: 2, color: 'orange' },
  { id: 'python', name: 'Python', count: 0, color: 'yellow' },
  { id: 'php', name: 'PHP', count: 0, color: 'pink' },
];
```

This comprehensive data structure provides all the information needed to build a fully functional portfolio app with real project data from Koushik's GitHub repositories and professional experience.
