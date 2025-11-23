# AboutMe Data Structure - Koushik Chandra Saha

## 📊 Complete Personal Data Structure

Based on the LinkedIn profile analysis, here's the comprehensive data structure for the AboutMe app:

### Personal Information

```typescript
interface PersonalInfo {
  name: string;
  username: string;
  title: string;
  description: string;
  avatar: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  availability: string;
  resumeUrl: string;
  languages: Language[];
  socialLinks: SocialLink[];
}
```

### Complete Personal Data

```typescript
const personalInfo: PersonalInfo = {
  name: 'Koushik Chandra (TheKoushikDurgas) Saha',
  username: 'thekoushikdurgas',
  title: 'DC Analytics at Deloitte || Student at NIT Arunachal Pradesh',
  description:
    'Tech geek and Web Developer, worked faster than others and managed any technical projects. Currently working as DC Analytics at Deloitte with expertise in data analysis, full-stack development, and cloud technologies.',
  avatar: '/images/koushik-profile.jpg',
  location: 'Bengaluru, Karnataka, India',
  email: 'koushikchandrasaha558@gmail.com',
  phone: '9933454265 & 8167334088',
  website: 'www.thekoushikdurgas.com',
  address:
    '13/23 Edison Road, B-zone, Durgapur, Paschim Bardhaman, West Bengal, Pin code: 713205',
  availability:
    'Open to work for Data Analyst, Full Stack Developer and Artificial Intelligence Developer roles',
  resumeUrl: '/resume/koushik-chandra-saha-resume.pdf',
  languages: [
    { name: 'Bengali', proficiency: 'Native or bilingual proficiency' },
    { name: 'English', proficiency: 'Professional working proficiency' },
    { name: 'Hindi', proficiency: 'Professional working proficiency' },
  ],
  socialLinks: [
    {
      platform: 'GitHub',
      url: 'https://github.com/thekoushikdurgas',
      icon: 'github',
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/koushikchandrasaha',
      icon: 'linkedin',
    },
    {
      platform: 'Email',
      url: 'mailto:koushikchandrasaha558@gmail.com',
      icon: 'mail',
    },
    {
      platform: 'Website',
      url: 'https://www.thekoushikdurgas.com',
      icon: 'globe',
    },
  ],
};
```

## 🏢 Professional Experience Data

```typescript
const workExperience: WorkExperience[] = [
  {
    id: 'deloitte-dc-analytics',
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
    logo: '/logos/deloitte.png',
    achievements: [
      'Working on multiple data analytics projects',
      'Using Python and Pandas for data analysis',
      'Power BI for data visualization',
      'Google Cloud Platform for cloud analytics',
      'BigQuery for data warehousing',
    ],
    skills: [
      'Python',
      'Pandas',
      'Power BI',
      'GCP',
      'BigQuery',
      'AWS',
      'Data Analysis',
    ],
  },
  {
    id: 'karmaa-lab-fullstack',
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
    logo: '/logos/karmaa-lab.png',
    achievements: [
      'Developed multiple full-stack applications',
      'Worked with MERN stack technologies',
      'Gained experience in modern web development',
      'Collaborated on various projects',
    ],
    skills: [
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
    id: 'flexon-php-developer',
    company: 'Flexon Technologies Limited',
    position: 'PHP Developer',
    duration: 'Oct 2021 - Dec 2021',
    location: 'Durgapur, India',
    description:
      'Created a college management software using PHP and MySQL. Developed and deployed the complete system.',
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    logo: '/logos/flexon.png',
    achievements: [
      'Created college management software',
      'Developed complete system from scratch',
      'Deployed and maintained the application',
      'Used PHP and MySQL for backend',
    ],
    skills: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Bootstrap'],
  },
];
```

## 🎓 Education Data

```typescript
const education: Education[] = [
  {
    id: 'nit-arunachal-pradesh',
    institution: 'National Institute of Technology Arunachal Pradesh',
    degree: 'Bachelor of Technology in Computer Science and Engineering',
    duration: '2019 - 2023',
    grade: '7.3 CGPA',
    location: 'Arunachal Pradesh, India',
    description:
      'Key project: AI-powered resume editor. Completed comprehensive coursework in computer science fundamentals, data structures, algorithms, and software engineering.',
    logo: '/logos/nit-ap.png',
    achievements: [
      'Key project: AI-powered resume editor',
      'Comprehensive coursework in CS fundamentals',
      'Data structures and algorithms',
      'Software engineering principles',
    ],
    skills: [
      'Computer Science',
      'Data Structures',
      'Algorithms',
      'Software Engineering',
      'AI/ML',
    ],
  },
  {
    id: 'bidhan-chandra-institution',
    institution: 'Bidhan Chandra Institution',
    degree: 'Higher Secondary in Computer Science',
    duration: '2017 - 2019',
    grade: '80%',
    location: 'West Bengal, India',
    description:
      'Completed higher secondary education with focus on computer science and mathematics.',
    logo: '/logos/bidhan-chandra.png',
    achievements: [
      'Focus on computer science',
      'Strong foundation in mathematics',
      'Excellent academic performance',
    ],
    skills: ['Computer Science', 'Mathematics', 'Problem Solving'],
  },
  {
    id: 'suren-chandra-modern-school',
    institution: 'Suren Chandra Modern School (H.S.)',
    degree: 'Secondary Education in Computer Science',
    duration: '2007 - 2016',
    grade: '85%',
    location: 'West Bengal, India',
    description:
      'Completed secondary education with excellent academic performance.',
    logo: '/logos/suren-chandra.png',
    achievements: [
      'Excellent academic performance',
      'Strong foundation in computer science',
      'Consistent academic excellence',
    ],
    skills: ['Computer Science', 'Mathematics', 'English', 'Bengali'],
  },
];
```

## 🏆 Certifications Data

```typescript
const certifications: Certification[] = [
  {
    id: 'google-associate-cloud-engineer',
    name: 'Associate Cloud Engineer Certification',
    issuer: 'Google',
    issuedDate: 'Sep 2024',
    expiryDate: 'Sep 2027',
    credentialId: 'GCP-ACE-2024',
    description:
      'Google Cloud Platform Associate Cloud Engineer certification covering cloud architecture, security, and operations.',
    logo: '/logos/google.png',
    skills: [
      'Google Cloud Platform',
      'Cloud Architecture',
      'Security',
      'Operations',
    ],
    verificationUrl:
      'https://www.credential.net/google-cloud-certified-associate-cloud-engineer',
  },
  {
    id: 'deloitte-data-engineering',
    name: 'Data Engineering - Foundation',
    issuer: 'Deloitte',
    issuedDate: 'Mar 2024',
    expiryDate: 'Mar 2027',
    credentialId: 'DEL-DE-2024',
    description:
      'Deloitte Data Engineering Foundation certification covering data pipeline development and management.',
    logo: '/logos/deloitte.png',
    skills: [
      'Data Engineering',
      'Data Pipelines',
      'Data Management',
      'Big Data',
    ],
    verificationUrl: 'https://www.deloitte.com/certifications',
  },
  {
    id: 'deloitte-machine-learning',
    name: 'Machine Learning - Foundation',
    issuer: 'Deloitte',
    issuedDate: 'Mar 2024',
    expiryDate: 'Mar 2027',
    credentialId: 'DEL-ML-2024',
    description:
      'Deloitte Machine Learning Foundation certification covering ML algorithms and implementation.',
    logo: '/logos/deloitte.png',
    skills: ['Machine Learning', 'Algorithms', 'Data Science', 'AI'],
    verificationUrl: 'https://www.deloitte.com/certifications',
  },
  {
    id: 'codility-silver-award',
    name: 'Silver Award Fury Road',
    issuer: 'Codility',
    issuedDate: 'May 2022',
    credentialId: 'certX3BWWR-8UPZAJF8DZEHCVQG',
    description:
      'Codility Silver Award for algorithmic problem solving and coding challenges.',
    logo: '/logos/codility.png',
    skills: [
      'Algorithmic Thinking',
      'Problem Solving',
      'Coding Challenges',
      'Data Structures',
    ],
    verificationUrl:
      'https://app.codility.com/cert/view/certX3BWWR-8UPZAJF8DZEHCVQG',
  },
  {
    id: 'hackerrank-problem-solving',
    name: 'Problem Solving (Basic)',
    issuer: 'HackerRank',
    issuedDate: 'Aug 2020',
    credentialId: 'e7a3db1f91ab',
    description:
      'HackerRank Problem Solving certification demonstrating algorithmic thinking and coding skills.',
    logo: '/logos/hackerrank.png',
    skills: ['Problem Solving', 'Algorithms', 'Coding', 'Data Structures'],
    verificationUrl: 'https://www.hackerrank.com/certificates/e7a3db1f91ab',
  },
];
```

## 🛠️ Skills Data

```typescript
const skills: Skill[] = [
  // Data Analytics & Cloud (Primary Focus)
  {
    id: 'python',
    name: 'Python',
    category: 'data-analytics',
    level: 100,
    description:
      'Advanced proficiency with Pandas, data analysis, and machine learning',
    icon: 'python',
    projects: [],
    yearsOfExperience: 3,
    certifications: [
      'Google Associate Cloud Engineer',
      'Deloitte Data Engineering',
    ],
  },
  {
    id: 'pandas',
    name: 'Pandas',
    category: 'data-analytics',
    level: 90,
    description: 'Data manipulation and analysis library for Python',
    icon: 'pandas',
    projects: [],
    yearsOfExperience: 2,
    certifications: ['Deloitte Data Engineering'],
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    category: 'data-analytics',
    level: 90,
    description: 'Business intelligence and data visualization platform',
    icon: 'powerbi',
    projects: [],
    yearsOfExperience: 2,
    certifications: ['Deloitte Data Engineering'],
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    category: 'cloud',
    level: 90,
    description:
      'Associate Cloud Engineer certified - cloud architecture and operations',
    icon: 'gcp',
    projects: [],
    yearsOfExperience: 2,
    certifications: ['Google Associate Cloud Engineer'],
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    category: 'data-analytics',
    level: 80,
    description: 'Data warehousing and analytics on Google Cloud',
    icon: 'bigquery',
    projects: [],
    yearsOfExperience: 1,
    certifications: ['Google Associate Cloud Engineer'],
  },
  {
    id: 'aws',
    name: 'AWS',
    category: 'cloud',
    level: 80,
    description: 'Amazon Web Services - cloud computing and Lambda functions',
    icon: 'aws',
    projects: [],
    yearsOfExperience: 1,
    certifications: [],
  },

  // Full-Stack Development (Strong Background)
  {
    id: 'mern',
    name: 'MERN Stack',
    category: 'full-stack',
    level: 90,
    description:
      'MongoDB, Express.js, React, Node.js - complete full-stack solution',
    icon: 'mern',
    projects: [
      'chat-app',
      'portfolio',
      'todo-list',
      'unit-converter',
      'password-generator',
      'resume-cv',
      'icons',
      'minify',
      'login-auth',
    ],
    yearsOfExperience: 3,
    certifications: [],
  },
  {
    id: 'react',
    name: 'React',
    category: 'full-stack',
    level: 90,
    description: 'Frontend library for building user interfaces',
    icon: 'react',
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
    yearsOfExperience: 3,
    certifications: [],
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'full-stack',
    level: 90,
    description: 'JavaScript runtime for backend development',
    icon: 'nodejs',
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
    yearsOfExperience: 3,
    certifications: [],
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'full-stack',
    level: 90,
    description: 'NoSQL database for modern applications',
    icon: 'mongodb',
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
    yearsOfExperience: 3,
    certifications: [],
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'full-stack',
    level: 90,
    description: 'Web application framework for Node.js',
    icon: 'express',
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
    yearsOfExperience: 3,
    certifications: [],
  },

  // Programming Languages
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'programming',
    level: 90,
    description: 'Modern JavaScript for web development',
    icon: 'javascript',
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
    yearsOfExperience: 4,
    certifications: [],
  },
  {
    id: 'cpp',
    name: 'C/C++',
    category: 'programming',
    level: 100,
    description: 'System programming and algorithms',
    icon: 'cpp',
    projects: [],
    yearsOfExperience: 5,
    certifications: [],
  },
  {
    id: 'java',
    name: 'Java',
    category: 'programming',
    level: 90,
    description: 'Object-oriented programming language',
    icon: 'java',
    projects: [],
    yearsOfExperience: 3,
    certifications: [],
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'programming',
    level: 90,
    description: 'Server-side scripting language',
    icon: 'php',
    projects: [],
    yearsOfExperience: 2,
    certifications: [],
  },

  // Frontend Technologies
  {
    id: 'html5',
    name: 'HTML5',
    category: 'frontend',
    level: 100,
    description: 'Markup language for web pages',
    icon: 'html5',
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
    yearsOfExperience: 4,
    certifications: [],
  },
  {
    id: 'css3',
    name: 'CSS3',
    category: 'frontend',
    level: 100,
    description: 'Styling language for web pages',
    icon: 'css3',
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
    yearsOfExperience: 4,
    certifications: [],
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap 5',
    category: 'frontend',
    level: 100,
    description: 'CSS framework for responsive design',
    icon: 'bootstrap',
    projects: [],
    yearsOfExperience: 3,
    certifications: [],
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    level: 100,
    description: 'Utility-first CSS framework',
    icon: 'tailwind',
    projects: ['portfolio', 'resume-cv'],
    yearsOfExperience: 2,
    certifications: [],
  },

  // Backend Technologies
  {
    id: 'django',
    name: 'Django',
    category: 'backend',
    level: 100,
    description: 'Python web framework',
    icon: 'django',
    projects: [],
    yearsOfExperience: 2,
    certifications: [],
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'database',
    level: 90,
    description: 'Relational database management system',
    icon: 'mysql',
    projects: [],
    yearsOfExperience: 2,
    certifications: [],
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    category: 'database',
    level: 100,
    description: 'Lightweight database engine',
    icon: 'sqlite',
    projects: [],
    yearsOfExperience: 2,
    certifications: [],
  },

  // Tools & Platforms
  {
    id: 'git',
    name: 'Git',
    category: 'tools',
    level: 90,
    description: 'Version control system',
    icon: 'git',
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
    yearsOfExperience: 4,
    certifications: [],
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'tools',
    level: 90,
    description: 'Code hosting and collaboration platform',
    icon: 'github',
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
    yearsOfExperience: 4,
    certifications: [],
  },
  {
    id: 'heroku',
    name: 'Heroku',
    category: 'tools',
    level: 100,
    description: 'Cloud platform for deploying applications',
    icon: 'heroku',
    projects: [],
    yearsOfExperience: 2,
    certifications: [],
  },
  {
    id: 'netlify',
    name: 'Netlify',
    category: 'tools',
    level: 100,
    description: 'Web development platform',
    icon: 'netlify',
    projects: [],
    yearsOfExperience: 2,
    certifications: [],
  },
];
```

## 📊 Skills Categories

```typescript
const skillCategories: SkillCategory[] = [
  {
    id: 'data-analytics',
    name: 'Data Analytics & Cloud',
    color: 'blue',
    count: 6,
    description: 'Data analysis, cloud computing, and business intelligence',
  },
  {
    id: 'full-stack',
    name: 'Full-Stack Development',
    color: 'green',
    count: 5,
    description: 'Complete web application development',
  },
  {
    id: 'programming',
    name: 'Programming Languages',
    color: 'purple',
    count: 4,
    description: 'Core programming languages and algorithms',
  },
  {
    id: 'frontend',
    name: 'Frontend Technologies',
    color: 'orange',
    count: 4,
    description: 'User interface and user experience',
  },
  {
    id: 'backend',
    name: 'Backend Technologies',
    color: 'red',
    count: 3,
    description: 'Server-side development and databases',
  },
  {
    id: 'tools',
    name: 'Tools & Platforms',
    color: 'gray',
    count: 4,
    description: 'Development tools and deployment platforms',
  },
];
```

## 🌐 Social Links Data

```typescript
const socialLinks: SocialLink[] = [
  {
    platform: 'GitHub',
    url: 'https://github.com/thekoushikdurgas',
    icon: 'github',
    username: 'thekoushikdurgas',
    description: 'View my code repositories and contributions',
    color: '#333333',
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/koushikchandrasaha',
    icon: 'linkedin',
    username: 'koushikchandrasaha',
    description: 'Connect with me professionally',
    color: '#0077B5',
  },
  {
    platform: 'Email',
    url: 'mailto:koushikchandrasaha558@gmail.com',
    icon: 'mail',
    username: 'koushikchandrasaha558@gmail.com',
    description: 'Send me an email',
    color: '#EA4335',
  },
  {
    platform: 'Website',
    url: 'https://www.thekoushikdurgas.com',
    icon: 'globe',
    username: 'thekoushikdurgas.com',
    description: 'Visit my personal website',
    color: '#4285F4',
  },
];
```

## 🎯 Professional Summary

```typescript
const professionalSummary = {
  currentRole: 'DC Analytics at Deloitte',
  experience: '3+ years in software development and data analytics',
  education: 'B.Tech Computer Science from NIT Arunachal Pradesh',
  location: 'Bengaluru, Karnataka, India',
  availability:
    'Open to work for Data Analyst, Full Stack Developer and Artificial Intelligence Developer roles',
  keyStrengths: [
    'Data Analytics with Python and Power BI',
    'Full-Stack Development with MERN Stack',
    'Cloud Computing with GCP and AWS',
    'Problem Solving and Algorithmic Thinking',
    'Project Management and Team Collaboration',
  ],
  recentAchievements: [
    'Google Associate Cloud Engineer Certification (2024)',
    'Deloitte Data Engineering Foundation (2024)',
    'Deloitte Machine Learning Foundation (2024)',
    '13+ MERN Stack projects completed',
    'Codility Silver Award (2022)',
  ],
};
```

This comprehensive data structure provides all the information needed to build a fully functional AboutMe app with real personal and professional data from Koushik's LinkedIn profile and professional experience.
