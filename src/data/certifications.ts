// Certifications Data
// Professional certifications and achievements from Koushik Chandra Saha

import { Certification } from '@/types/portfolio';

export const certifications: Certification[] = [
  {
    id: 'google-cloud-engineer',
    name: 'Associate Cloud Engineer Certification',
    issuer: 'Google',
    issuedDate: 'Sep 2024',
    expiryDate: 'Sep 2027',
    credentialId: 'GCP-ACE-2024',
    description: 'Google Cloud Platform Associate Cloud Engineer certification covering cloud architecture, security, and operations. Demonstrates expertise in deploying, monitoring, and maintaining applications on Google Cloud Platform.',
    current: true
  },
  {
    id: 'deloitte-data-engineering',
    name: 'Data Engineering - Foundation',
    issuer: 'Deloitte',
    issuedDate: 'Mar 2024',
    expiryDate: 'Mar 2027',
    credentialId: 'DEL-DE-2024',
    description: 'Deloitte Data Engineering Foundation certification covering data pipeline development and management. Includes knowledge of data processing, ETL operations, and data warehousing concepts.',
    current: true
  },
  {
    id: 'deloitte-machine-learning',
    name: 'Machine Learning - Foundation',
    issuer: 'Deloitte',
    issuedDate: 'Mar 2024',
    expiryDate: 'Mar 2027',
    credentialId: 'DEL-ML-2024',
    description: 'Deloitte Machine Learning Foundation certification covering ML algorithms and implementation. Includes supervised learning, unsupervised learning, and model evaluation techniques.',
    current: true
  },
  {
    id: 'codility-silver-award',
    name: 'Silver Award Fury Road',
    issuer: 'Codility',
    issuedDate: 'May 2022',
    credentialId: 'certX3BWWR-8UPZAJF8DZEHCVQG',
    description: 'Codility Silver Award for algorithmic problem solving and coding challenges. Demonstrates strong problem-solving skills and algorithmic thinking abilities.',
    current: true
  },
  {
    id: 'hackerrank-problem-solving',
    name: 'Problem Solving (Basic)',
    issuer: 'HackerRank',
    issuedDate: 'Aug 2020',
    credentialId: 'e7a3db1f91ab',
    description: 'HackerRank Problem Solving certification demonstrating algorithmic thinking and coding skills. Covers data structures, algorithms, and problem-solving methodologies.',
    current: true
  }
];

// Helper functions
export const getCurrentCertifications = (): Certification[] => {
  return certifications.filter(cert => cert.current);
};

export const getCertificationsByIssuer = (issuer: string): Certification[] => {
  return certifications.filter(cert => 
    cert.issuer.toLowerCase().includes(issuer.toLowerCase())
  );
};

export const getCertificationsByYear = (year: string): Certification[] => {
  return certifications.filter(cert => 
    cert.issuedDate.includes(year)
  );
};

export const getTotalCertifications = (): number => {
  return certifications.length;
};

export const getActiveCertifications = (): number => {
  return certifications.filter(cert => cert.current).length;
};
