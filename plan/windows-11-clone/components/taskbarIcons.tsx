import React from 'react';

export const AboutMeTaskbarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="10" fill="#3B82F6" />
        <path d="M16 17.5C16 15.567 14.2091 14 12 14C9.79086 14 8 15.567 8 17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="1.5"/>
    </svg>
);

export const WelcomeTaskbarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="10" fill="#3B82F6"/>
        <path d="M12 4L14.472 9.528L20 10.36L15.5 14.472L17.056 20L12 17.2L6.944 20L8.5 14.472L4 10.36L9.528 9.528L12 4Z" fill="#FBBF24"/>
    </svg>
);

export const NotepadTaskbarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="5" y="3" width="14" height="18" rx="2" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
        <rect x="5" y="3" width="14" height="4" rx="1" fill="#3B82F6"/>
        <path d="M8 10H16" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
        <path d="M8 14H16" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
        <path d="M8 18H12" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
    </svg>
);

export const CalculatorTaskbarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="4" y="2" width="16" height="20" rx="2" fill="#4B5563"/>
        <rect x="6" y="4" width="12" height="5" rx="1" fill="#D1D5DB"/>
        <circle cx="8" cy="12" r="1.5" fill="#F97316"/>
        <circle cx="12" cy="12" r="1.5" fill="#E5E7EB"/>
        <circle cx="16" cy="12" r="1.5" fill="#E5E7EB"/>
        <circle cx="8" cy="16" r="1.5" fill="#E5E7EB"/>
        <circle cx="12" cy="16" r="1.5" fill="#E5E7EB"/>
        <circle cx="16" cy="16" r="1.5" fill="#3B82F6"/>
        <circle cx="8" cy="20" r="1.5" fill="#E5E7EB"/>
        <circle cx="12" cy="20" r="1.5" fill="#E5E7EB"/>
        <circle cx="16" cy="20" r="1.5" fill="#E5E7EB"/>
    </svg>
);

export const ContactTaskbarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="4" y="2" width="16" height="20" rx="2" fill="#4B5563"/>
        <path d="M8 2V22" stroke="#6B7280" strokeWidth="1"/>
        <path d="M17 17C17 15.3431 15.6569 14 14 14C12.3431 14 11 15.3431 11 17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="10" r="2" stroke="white" strokeWidth="1.5"/>
    </svg>
);
