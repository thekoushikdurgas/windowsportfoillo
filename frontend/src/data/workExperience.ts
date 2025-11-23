// Work Experience Data
// Professional experience from Koushik Chandra Saha's career

import { WorkExperience } from '@/types/portfolio';

export const workExperience: WorkExperience[] = [
  {
    id: 'deloitte-dc-analytics',
    company: 'Deloitte USI',
    position: 'DC Analytics',
    duration: 'Jan 2024 - Present',
    location: 'Hyderabad, India',
    description:
      'Working on data analytics projects using Python, Pandas, Power BI, and Google Cloud Platform. Involved in big data analytics, data engineering, and machine learning projects. Collaborating with cross-functional teams to deliver data-driven insights and solutions.',
    technologies: [
      'Python',
      'Pandas',
      'Power BI',
      'Google Cloud Platform',
      'BigQuery',
      'AWS',
      'Data Analysis',
      'Machine Learning',
      'SQL',
      'Excel',
    ],
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    current: true,
  },
  {
    id: 'karmaa-lab-intern',
    company: 'Karmaa Lab',
    position: 'Full-stack Developer (Intern)',
    duration: 'Jun 2022 - Aug 2022',
    location: 'Bengaluru, India',
    description:
      'Worked on multiple full-stack development projects using MERN stack and other modern technologies. Gained hands-on experience in building scalable web applications and working in an agile development environment.',
    technologies: [
      'MongoDB',
      'Express.js',
      'React',
      'Node.js',
      'JavaScript',
      'HTML',
      'CSS',
      'Git',
      'REST APIs',
    ],
    startDate: '2022-06-01',
    endDate: '2022-08-31',
    current: false,
  },
  {
    id: 'flexon-technologies-php',
    company: 'Flexon Technologies Limited',
    position: 'PHP Developer',
    duration: 'Oct 2021 - Dec 2021',
    location: 'Durgapur, India',
    description:
      'Created a college management software using PHP and MySQL. Developed and deployed the complete system with features for student management, course administration, and reporting. Worked closely with stakeholders to understand requirements and deliver solutions.',
    technologies: [
      'PHP',
      'MySQL',
      'HTML',
      'CSS',
      'JavaScript',
      'Bootstrap',
      'jQuery',
      'Apache',
      'Linux',
    ],
    startDate: '2021-10-01',
    endDate: '2021-12-31',
    current: false,
  },
];

// Helper functions
export const getCurrentExperience = (): WorkExperience | undefined => {
  return workExperience.find(exp => exp.current);
};

export const getExperienceByCompany = (
  company: string
): WorkExperience | undefined => {
  return workExperience.find(exp =>
    exp.company.toLowerCase().includes(company.toLowerCase())
  );
};

export const getExperienceByTechnology = (
  technology: string
): WorkExperience[] => {
  return workExperience.filter(exp =>
    exp.technologies.some((tech: string) =>
      tech.toLowerCase().includes(technology.toLowerCase())
    )
  );
};

export const getTotalExperienceYears = (): number => {
  const currentDate = new Date();
  let totalMonths = 0;

  workExperience.forEach(exp => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.current ? currentDate : new Date(exp.endDate);
    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
    totalMonths += months;
  });

  return Math.round((totalMonths / 12) * 10) / 10; // Round to 1 decimal place
};
