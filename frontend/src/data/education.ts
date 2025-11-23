// Education Data
// Academic background from Koushik Chandra Saha's educational journey

import { Education } from '@/types/portfolio';

export const education: Education[] = [
  {
    id: 'nit-arunachal-pradesh',
    institution: 'National Institute of Technology Arunachal Pradesh',
    degree: 'Bachelor of Technology in Computer Science and Engineering',
    field: 'Computer Science and Engineering',
    duration: '2019 - 2023',
    grade: '7.3 CGPA',
    location: 'Arunachal Pradesh, India',
    description:
      'Key project: AI-powered resume editor. Completed comprehensive coursework in computer science fundamentals, data structures, algorithms, software engineering, database management, computer networks, and artificial intelligence.',
    startDate: '2019-07-01',
    endDate: '2023-06-30',
    current: false,
  },
  {
    id: 'bidhan-chandra-institution',
    institution: 'Bidhan Chandra Institution',
    degree: 'Higher Secondary in Computer Science',
    field: 'Computer Science',
    duration: '2017 - 2019',
    grade: '80%',
    location: 'West Bengal, India',
    description:
      'Completed higher secondary education with focus on computer science and mathematics. Participated in various technical competitions and coding events.',
    startDate: '2017-04-01',
    endDate: '2019-03-31',
    current: false,
  },
  {
    id: 'suren-chandra-modern-school',
    institution: 'Suren Chandra Modern School (H.S.)',
    degree: 'Secondary Education in Computer Science',
    field: 'Computer Science',
    duration: '2007 - 2016',
    grade: '85%',
    location: 'West Bengal, India',
    description:
      'Completed secondary education with excellent academic performance. Developed early interest in computer science and programming.',
    startDate: '2007-04-01',
    endDate: '2016-03-31',
    current: false,
  },
];

// Helper functions
export const getHighestEducation = (): Education => {
  const highest = education[0];
  if (!highest) {
    throw new Error('No education data available');
  }
  return highest; // Assuming the first entry is the highest degree
};

export const getEducationByInstitution = (
  institution: string
): Education | undefined => {
  return education.find(edu =>
    edu.institution.toLowerCase().includes(institution.toLowerCase())
  );
};

export const getEducationByDegree = (degree: string): Education | undefined => {
  return education.find(edu =>
    edu.degree.toLowerCase().includes(degree.toLowerCase())
  );
};

export const getTotalEducationYears = (): number => {
  const firstEducation = education[education.length - 1]; // Oldest education
  const lastEducation = education[0]; // Most recent education

  if (!firstEducation || !lastEducation) return 0;

  const startYear = new Date(firstEducation.startDate).getFullYear();
  const endYear = new Date(lastEducation.endDate).getFullYear();

  return endYear - startYear + 1; // +1 to include both start and end years
};
