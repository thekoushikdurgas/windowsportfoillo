// Personal Information Data for AboutMe App
// Real data from Koushik Chandra Saha's LinkedIn profile

import { PersonalInfo, WorkExperience, Education, Certification, Skill, SocialLink } from '@/types/portfolio';

export const personalInfo: PersonalInfo = {
  name: "Koushik Chandra (TheKoushikDurgas) Saha",
  username: "thekoushikdurgas",
  title: "DC Analytics at Deloitte || Student at NIT Arunachal Pradesh",
  currentRole: "DC Analytics at Deloitte",
  location: "Bengaluru, Karnataka, India",
  email: "koushikchandrasaha558@gmail.com",
  website: "www.thekoushikdurgas.com",
  linkedin: "https://linkedin.com/in/koushikchandrasaha",
  github: "https://github.com/thekoushikdurgas",
  phone: "9933454265 & 8167334088",
  address: "13/23 Edison Road, B-zone, Durgapur, Paschim Bardhaman, West Bengal, Pin code: 713205",
  description: "Tech geek and Web Developer, worked faster than others and managed any technical projects. Currently working as DC Analytics at Deloitte with expertise in data analysis, full-stack development, and cloud technologies.",
  avatar: "/images/koushik-profile.jpg",
  resumeUrl: "/resume/koushik-chandra-saha-resume.pdf",
  availability: "Open to work for Data Analyst, Full Stack Developer and Artificial Intelligence Developer roles",
  languages: [
    { name: "Bengali", proficiency: "Native or bilingual proficiency" },
    { name: "English", proficiency: "Professional working proficiency" },
    { name: "Hindi", proficiency: "Professional working proficiency" }
  ]
};

export const workExperience: WorkExperience[] = [
  {
    id: "deloitte-dc-analytics",
    company: "Deloitte USI",
    position: "DC Analytics",
    duration: "Jan 2024 - Present",
    location: "Hyderabad, India",
    description: "Working on data analytics projects using Python, Pandas, Power BI, and Google Cloud Platform. Involved in big data analytics, data engineering, and machine learning projects. Collaborating with cross-functional teams to deliver data-driven insights and solutions.",
    technologies: ["Python", "Pandas", "Power BI", "Google Cloud Platform", "BigQuery", "AWS", "Data Analysis", "Machine Learning", "Data Engineering"],
    startDate: "2024-01-01",
    endDate: "present",
    current: true
  },
  {
    id: "karmaa-lab-fullstack",
    company: "Karmaa Lab",
    position: "Full-stack Developer (Intern)",
    duration: "Jun 2022 - Aug 2022",
    location: "Bengaluru, India",
    description: "Worked on multiple full-stack development projects using MERN stack and other modern technologies. Gained hands-on experience in building scalable web applications and collaborating with development teams.",
    technologies: ["MongoDB", "Express.js", "React", "Node.js", "JavaScript", "HTML", "CSS", "Bootstrap", "Git"],
    startDate: "2022-06-01",
    endDate: "2022-08-31",
    current: false
  },
  {
    id: "flexon-php-developer",
    company: "Flexon Technologies Limited",
    position: "PHP Developer",
    duration: "Oct 2021 - Dec 2021",
    location: "Durgapur, India",
    description: "Created a college management software using PHP and MySQL. Developed and deployed the complete system from scratch, including database design, backend API development, and frontend interface.",
    technologies: ["PHP", "MySQL", "HTML", "CSS", "JavaScript", "Bootstrap", "Apache", "Linux"],
    startDate: "2021-10-01",
    endDate: "2021-12-31",
    current: false
  }
];

export const education: Education[] = [
  {
    id: "nit-arunachal-pradesh",
    institution: "National Institute of Technology Arunachal Pradesh",
    degree: "Bachelor of Technology in Computer Science and Engineering",
    duration: "2019 - 2023",
    grade: "7.3 CGPA",
    location: "Arunachal Pradesh, India",
    description: "Key project: AI-powered resume editor. Completed comprehensive coursework in computer science fundamentals, data structures, algorithms, and software engineering. Gained expertise in programming languages, database management, and software development methodologies.",
    startDate: "2019-01-01",
    endDate: "2023-12-31"
  },
  {
    id: "bidhan-chandra-institution",
    institution: "Bidhan Chandra Institution",
    degree: "Higher Secondary in Computer Science",
    duration: "2017 - 2019",
    grade: "80%",
    location: "West Bengal, India",
    description: "Completed higher secondary education with focus on computer science and mathematics. Developed strong foundation in programming concepts and problem-solving skills.",
    startDate: "2017-01-01",
    endDate: "2019-03-31"
  },
  {
    id: "suren-chandra-modern-school",
    institution: "Suren Chandra Modern School (H.S.)",
    degree: "Secondary Education in Computer Science",
    duration: "2007 - 2016",
    grade: "85%",
    location: "West Bengal, India",
    description: "Completed secondary education with excellent academic performance. Established strong foundation in mathematics, science, and computer science fundamentals.",
    startDate: "2007-01-01",
    endDate: "2016-12-31"
  }
];

export const certifications: Certification[] = [
  {
    id: "google-associate-cloud-engineer",
    name: "Associate Cloud Engineer Certification",
    issuer: "Google",
    issuedDate: "Sep 2024",
    expiryDate: "Sep 2027",
    credentialId: "GCP-ACE-2024",
    description: "Google Cloud Platform Associate Cloud Engineer certification covering cloud architecture, security, and operations. Demonstrates expertise in deploying applications, monitoring operations, and managing enterprise solutions on Google Cloud.",
    current: true
  },
  {
    id: "deloitte-data-engineering",
    name: "Data Engineering - Foundation",
    issuer: "Deloitte",
    issuedDate: "Mar 2024",
    expiryDate: "Mar 2027",
    credentialId: "DEL-DE-2024",
    description: "Deloitte Data Engineering Foundation certification covering data pipeline development and management. Focuses on big data processing, ETL workflows, and data warehousing solutions.",
    current: true
  },
  {
    id: "deloitte-machine-learning",
    name: "Machine Learning - Foundation",
    issuer: "Deloitte",
    issuedDate: "Mar 2024",
    expiryDate: "Mar 2027",
    credentialId: "DEL-ML-2024",
    description: "Deloitte Machine Learning Foundation certification covering ML algorithms and implementation. Covers supervised and unsupervised learning, model evaluation, and deployment strategies.",
    current: true
  },
  {
    id: "codility-silver-award",
    name: "Silver Award Fury Road",
    issuer: "Codility",
    issuedDate: "May 2022",
    credentialId: "certX3BWWR-8UPZAJF8DZEHCVQG",
    description: "Codility Silver Award for algorithmic problem solving and coding challenges. Demonstrates strong problem-solving skills and algorithmic thinking in competitive programming.",
    current: false
  },
  {
    id: "hackerrank-problem-solving",
    name: "Problem Solving (Basic)",
    issuer: "HackerRank",
    issuedDate: "Aug 2020",
    credentialId: "e7a3db1f91ab",
    description: "HackerRank Problem Solving certification demonstrating algorithmic thinking and coding skills. Validates proficiency in data structures, algorithms, and programming fundamentals.",
    current: false
  }
];

export const skills: Skill[] = [
  // Data Analytics & Cloud (Primary Focus)
  { 
    id: "python", 
    name: "Python", 
    category: "data-analytics", 
    proficiency: 100, 
    description: "Advanced proficiency with Pandas, data analysis, and machine learning",
    projects: ["chat-app", "portfolio", "todo-list", "unit-converter", "password-generator", "resume-cv", "icons", "minify", "tic-tac-toe", "ludo", "music-player", "wordle", "login-auth"],
    yearsOfExperience: 3,
    certifications: ["Google Associate Cloud Engineer", "Deloitte Data Engineering"]
  },
  { 
    id: "pandas", 
    name: "Pandas", 
    category: "data-analytics", 
    proficiency: 90, 
    description: "Data manipulation and analysis library for Python",
    projects: [],
    yearsOfExperience: 2,
    certifications: ["Deloitte Data Engineering"]
  },
  { 
    id: "powerbi", 
    name: "Power BI", 
    category: "data-analytics", 
    proficiency: 90, 
    description: "Business intelligence and data visualization platform",
    projects: [],
    yearsOfExperience: 2,
    certifications: ["Deloitte Data Engineering"]
  },
  { 
    id: "gcp", 
    name: "Google Cloud Platform", 
    category: "cloud", 
    proficiency: 90, 
    description: "Associate Cloud Engineer certified - cloud architecture and operations",
    projects: [],
    yearsOfExperience: 2,
    certifications: ["Google Associate Cloud Engineer"]
  },
  { 
    id: "bigquery", 
    name: "BigQuery", 
    category: "data-analytics", 
    proficiency: 80, 
    description: "Data warehousing and analytics on Google Cloud",
    projects: [],
    yearsOfExperience: 1,
    certifications: ["Google Associate Cloud Engineer"]
  },
  { 
    id: "aws", 
    name: "AWS", 
    category: "cloud", 
    proficiency: 80, 
    description: "Amazon Web Services - cloud computing and Lambda functions",
    projects: [],
    yearsOfExperience: 1,
    certifications: []
  },

  // Full-Stack Development (Strong Background)
  { 
    id: "mern", 
    name: "MERN Stack", 
    category: "full-stack", 
    proficiency: 90, 
    description: "MongoDB, Express.js, React, Node.js - complete full-stack solution",
    projects: ["chat-app", "portfolio", "todo-list", "unit-converter", "password-generator", "resume-cv", "icons", "minify", "tic-tac-toe", "ludo", "music-player", "wordle", "login-auth"],
    yearsOfExperience: 3,
    certifications: []
  },
  { 
    id: "react", 
    name: "React", 
    category: "frontend", 
    proficiency: 90, 
    description: "Frontend library for building user interfaces",
    projects: ["chat-app", "portfolio", "todo-list", "unit-converter", "password-generator", "resume-cv", "icons", "minify", "tic-tac-toe", "ludo", "music-player", "wordle", "login-auth"],
    yearsOfExperience: 3,
    certifications: []
  },
  { 
    id: "nodejs", 
    name: "Node.js", 
    category: "backend", 
    proficiency: 90, 
    description: "JavaScript runtime for backend development",
    projects: ["chat-app", "portfolio", "todo-list", "unit-converter", "password-generator", "resume-cv", "icons", "minify", "tic-tac-toe", "ludo", "music-player", "wordle", "login-auth"],
    yearsOfExperience: 3,
    certifications: []
  },
  { 
    id: "mongodb", 
    name: "MongoDB", 
    category: "database", 
    proficiency: 90, 
    description: "NoSQL database for modern applications",
    projects: ["chat-app", "portfolio", "todo-list", "unit-converter", "password-generator", "resume-cv", "icons", "minify", "tic-tac-toe", "ludo", "music-player", "wordle", "login-auth"],
    yearsOfExperience: 3,
    certifications: []
  },
  { 
    id: "express", 
    name: "Express.js", 
    category: "backend", 
    proficiency: 90, 
    description: "Web application framework for Node.js",
    projects: ["chat-app", "portfolio", "todo-list", "unit-converter", "password-generator", "resume-cv", "icons", "minify", "tic-tac-toe", "ludo", "music-player", "wordle", "login-auth"],
    yearsOfExperience: 3,
    certifications: []
  },

  // Programming Languages
  { 
    id: "javascript", 
    name: "JavaScript", 
    category: "programming", 
    proficiency: 90, 
    description: "Modern JavaScript for web development",
    projects: ["chat-app", "portfolio", "todo-list", "unit-converter", "password-generator", "resume-cv", "icons", "minify", "tic-tac-toe", "ludo", "music-player", "wordle", "login-auth"],
    yearsOfExperience: 4,
    certifications: []
  },
  { 
    id: "cpp", 
    name: "C/C++", 
    category: "programming", 
    proficiency: 100, 
    description: "System programming and algorithms",
    projects: [],
    yearsOfExperience: 5,
    certifications: []
  },
  { 
    id: "java", 
    name: "Java", 
    category: "programming", 
    proficiency: 90, 
    description: "Object-oriented programming language",
    projects: [],
    yearsOfExperience: 3,
    certifications: []
  },
  { 
    id: "php", 
    name: "PHP", 
    category: "programming", 
    proficiency: 90, 
    description: "Server-side scripting language",
    projects: [],
    yearsOfExperience: 2,
    certifications: []
  },

  // Frontend Technologies
  { 
    id: "html5", 
    name: "HTML5", 
    category: "frontend", 
    proficiency: 100, 
    description: "Markup language for web pages",
    projects: ["chat-app", "portfolio", "todo-list", "unit-converter", "password-generator", "resume-cv", "icons", "minify", "tic-tac-toe", "ludo", "music-player", "wordle", "login-auth"],
    yearsOfExperience: 4,
    certifications: []
  },
  { 
    id: "css3", 
    name: "CSS3", 
    category: "frontend", 
    proficiency: 100, 
    description: "Styling language for web pages",
    projects: ["chat-app", "portfolio", "todo-list", "unit-converter", "password-generator", "resume-cv", "icons", "minify", "tic-tac-toe", "ludo", "music-player", "wordle", "login-auth"],
    yearsOfExperience: 4,
    certifications: []
  },
  { 
    id: "bootstrap", 
    name: "Bootstrap 5", 
    category: "frontend", 
    proficiency: 100, 
    description: "CSS framework for responsive design",
    projects: [],
    yearsOfExperience: 3,
    certifications: []
  },
  { 
    id: "tailwind", 
    name: "Tailwind CSS", 
    category: "frontend", 
    proficiency: 100, 
    description: "Utility-first CSS framework",
    projects: ["portfolio", "resume-cv"],
    yearsOfExperience: 2,
    certifications: []
  },

  // Backend Technologies
  { 
    id: "django", 
    name: "Django", 
    category: "backend", 
    proficiency: 100, 
    description: "Python web framework",
    projects: [],
    yearsOfExperience: 2,
    certifications: []
  },
  { 
    id: "mysql", 
    name: "MySQL", 
    category: "database", 
    proficiency: 90, 
    description: "Relational database management system",
    projects: [],
    yearsOfExperience: 2,
    certifications: []
  },
  { 
    id: "sqlite", 
    name: "SQLite", 
    category: "database", 
    proficiency: 100, 
    description: "Lightweight database engine",
    projects: [],
    yearsOfExperience: 2,
    certifications: []
  },

  // Tools & Platforms
  { 
    id: "git", 
    name: "Git", 
    category: "tools", 
    proficiency: 90, 
    description: "Version control system",
    projects: ["chat-app", "portfolio", "todo-list", "unit-converter", "password-generator", "resume-cv", "icons", "minify", "tic-tac-toe", "ludo", "music-player", "wordle", "login-auth"],
    yearsOfExperience: 4,
    certifications: []
  },
  { 
    id: "github", 
    name: "GitHub", 
    category: "tools", 
    proficiency: 90, 
    description: "Code hosting and collaboration platform",
    projects: ["chat-app", "portfolio", "todo-list", "unit-converter", "password-generator", "resume-cv", "icons", "minify", "tic-tac-toe", "ludo", "music-player", "wordle", "login-auth"],
    yearsOfExperience: 4,
    certifications: []
  },
  { 
    id: "heroku", 
    name: "Heroku", 
    category: "tools", 
    proficiency: 100, 
    description: "Cloud platform for deploying applications",
    projects: [],
    yearsOfExperience: 2,
    certifications: []
  },
  { 
    id: "netlify", 
    name: "Netlify", 
    category: "tools", 
    proficiency: 100, 
    description: "Web development platform",
    projects: [],
    yearsOfExperience: 2,
    certifications: []
  }
];

export const socialLinks: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/thekoushikdurgas",
    icon: "github",
    username: "thekoushikdurgas",
    description: "View my code repositories and contributions",
    color: "#333333"
  },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/in/koushikchandrasaha",
    icon: "linkedin",
    username: "koushikchandrasaha",
    description: "Connect with me professionally",
    color: "#0077B5"
  },
  {
    platform: "Email",
    url: "mailto:koushikchandrasaha558@gmail.com",
    icon: "mail",
    username: "koushikchandrasaha558@gmail.com",
    description: "Send me an email",
    color: "#EA4335"
  },
  {
    platform: "Website",
    url: "https://www.thekoushikdurgas.com",
    icon: "globe",
    username: "thekoushikdurgas.com",
    description: "Visit my personal website",
    color: "#4285F4"
  }
];

// Skills categories for better organization
export const skillCategories = [
  { 
    id: "data-analytics", 
    name: "Data Analytics & Cloud", 
    color: "blue", 
    count: 6,
    description: "Data analysis, cloud computing, and business intelligence"
  },
  { 
    id: "full-stack", 
    name: "Full-Stack Development", 
    color: "green", 
    count: 1,
    description: "Complete web application development"
  },
  { 
    id: "programming", 
    name: "Programming Languages", 
    color: "purple", 
    count: 4,
    description: "Core programming languages and algorithms"
  },
  { 
    id: "frontend", 
    name: "Frontend Technologies", 
    color: "orange", 
    count: 4,
    description: "User interface and user experience"
  },
  { 
    id: "backend", 
    name: "Backend Technologies", 
    color: "red", 
    count: 2,
    description: "Server-side development and databases"
  },
  { 
    id: "database", 
    name: "Database Technologies", 
    color: "yellow", 
    count: 3,
    description: "Database management and data storage"
  },
  { 
    id: "tools", 
    name: "Tools & Platforms", 
    color: "gray", 
    count: 4,
    description: "Development tools and deployment platforms"
  }
];

// Professional summary
export const professionalSummary = {
  currentRole: "DC Analytics at Deloitte",
  experience: "3+ years in software development and data analytics",
  education: "B.Tech Computer Science from NIT Arunachal Pradesh",
  location: "Bengaluru, Karnataka, India",
  availability: "Open to work for Data Analyst, Full Stack Developer and Artificial Intelligence Developer roles",
  keyStrengths: [
    "Data Analytics with Python and Power BI",
    "Full-Stack Development with MERN Stack",
    "Cloud Computing with GCP and AWS",
    "Problem Solving and Algorithmic Thinking",
    "Project Management and Team Collaboration"
  ],
  recentAchievements: [
    "Google Associate Cloud Engineer Certification (2024)",
    "Deloitte Data Engineering Foundation (2024)",
    "Deloitte Machine Learning Foundation (2024)",
    "13+ MERN Stack projects completed",
    "Codility Silver Award (2022)"
  ]
};
