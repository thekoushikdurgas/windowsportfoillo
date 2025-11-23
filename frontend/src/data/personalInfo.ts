// Personal Information Data
// Contact and personal details for Koushik Chandra Saha

import { PersonalInfo } from '@/types/portfolio';

export const personalInfo: PersonalInfo = {
  name: 'Koushik Chandra Saha',
  username: 'TheKoushikDurgas',
  title: 'Full Stack Developer & DC Analytics',
  currentRole: 'DC Analytics at Deloitte',
  location: 'Hyderabad, Karnataka, India',
  email: 'koushikchandrasaha558@gmail.com',
  website: 'www.thekoushikdurgas.com',
  linkedin: 'https://linkedin.com/in/koushikchandrasaha',
  github: 'https://github.com/thekoushikdurgas',
  phone: '9933454265 & 8167334088',
  address:
    '13/23 Edison Road, B-zone, Durgapur, Paschim Bardhaman, West Bengal, Pin code: 713205',
  description:
    'Full Stack Developer & DC Analytics at Deloitte with expertise in MERN stack, Python, and cloud technologies.',
  avatar: '/avatars/koushik.jpg',
  resumeUrl: '/resume/koushik-chandra-saha-resume.pdf',
  availability: 'Available for opportunities',
  languages: [
    { name: 'Bengali', proficiency: 'Native or bilingual proficiency' },
    { name: 'English', proficiency: 'Professional working proficiency' },
    { name: 'Hindi', proficiency: 'Professional working proficiency' },
  ],
};

// Social media handles
export const socialMedia = {
  linkedin: '@koushikchandrasaha',
  github: '@thekoushikdurgas',
  twitter: '@thekoushikdurgas',
  instagram: '@thekoushikdurgas',
};

// Professional summary
export const professionalSummary = {
  title: 'About Me',
  description:
    'I, KOUSHIK Chandra Saha am Tech geek and Web Developer, worked as fast than others and managed any technical projects. I am passionate about creating innovative solutions using modern technologies and have extensive experience in full-stack development, data analytics, and cloud computing.',
  keyPoints: [
    'Experienced Full-Stack Developer with 4+ years of experience',
    'Currently working as DC Analytics at Deloitte',
    'Expertise in MERN stack, Python, and cloud technologies',
    'Passionate about data analytics and machine learning',
    'Strong problem-solving and analytical skills',
    'Experience in building scalable web applications',
  ],
};

// Objectives
export const objectives = {
  title: 'Career Objectives',
  description:
    'To work with an organization with great enthusiasm and energy, where I can contribute my best and get an opportunity to learn and grow with the organization. I aim to leverage my technical skills and experience to drive innovation and deliver exceptional results.',
  goals: [
    'Contribute to cutting-edge technology projects',
    'Continue learning and growing in the tech industry',
    'Make a positive impact through technology solutions',
    'Mentor and guide junior developers',
    'Stay updated with latest technologies and trends',
  ],
};

// Hobbies and interests
export const hobbies = [
  'Reading',
  'Playing Cricket & Volleyball & Badminton',
  'Tabla',
  'Painting',
  'Travelling',
];

// Languages
export const languages = [
  { name: 'Bengali', proficiency: 'Native or bilingual proficiency' },
  { name: 'English', proficiency: 'Professional working proficiency' },
  { name: 'Hindi', proficiency: 'Professional working proficiency' },
];

// Helper functions
export const getContactInfo = () => {
  return {
    email: personalInfo.email,
    phone: personalInfo.phone,
    location: personalInfo.location,
    website: personalInfo.website,
  };
};

export const getSocialLinks = () => {
  return {
    linkedin: personalInfo.linkedin,
    github: personalInfo.github,
    website: personalInfo.website,
  };
};

export const getFullName = () => {
  return personalInfo.name;
};

export const getCurrentRole = () => {
  return personalInfo.currentRole;
};
