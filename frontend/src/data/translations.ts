// Multi-language translations for AboutMe app
// Supporting Bengali, English, and Hindi

export type Language = 'en' | 'bn' | 'hi';

export interface Translations {
  // Navigation
  overview: string;
  experience: string;
  skillsNavigation: string;
  github: string;
  contact: string;

  // Header
  professionalSummary: string;
  recentAchievements: string;
  keyStrengths: string;

  // Experience
  workExperience: string;
  education: string;
  certifications: string;
  current: string;
  issuedDate: string;
  expiryDate: string;

  // Skills
  technicalSkills: string;
  skills: string;
  yearsExperience: string;
  projects: string;

  // Contact
  contactInformation: string;
  connectWithMe: string;
  resumeDocuments: string;
  downloadResume: string;
  generating: string;
  pdfHint: string;

  // GitHub
  githubStatistics: string;
  githubProfile: string;
  repositories: string;
  stars: string;
  forks: string;
  followers: string;
  topLanguages: string;
  recentActivity: string;
  contributionGraph: string;
  viewProfile: string;
  viewOnGitHub: string;

  // Common
  loading: string;
  error: string;
  retry: string;
  viewMore: string;
  close: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    overview: 'Overview',
    experience: 'Experience',
    skillsNavigation: 'Skills',
    github: 'GitHub',
    contact: 'Contact',

    // Header
    professionalSummary: 'Professional Summary',
    recentAchievements: 'Recent Achievements',
    keyStrengths: 'Key Strengths',

    // Experience
    workExperience: 'Work Experience',
    education: 'Education',
    certifications: 'Certifications',
    current: 'Current',
    issuedDate: 'Issued',
    expiryDate: 'Expires',

    // Skills
    technicalSkills: 'Technical Skills',
    skills: 'Skills',
    yearsExperience: 'y exp',
    projects: 'projects',

    // Contact
    contactInformation: 'Contact Information',
    connectWithMe: 'Connect With Me',
    resumeDocuments: 'Resume & Documents',
    downloadResume: 'Download Resume',
    generating: 'Generating...',
    pdfHint: '💡 PDF will open in print dialog. HTML will download as a file.',

    // GitHub
    githubStatistics: 'GitHub Statistics',
    githubProfile: 'GitHub Profile',
    repositories: 'Repositories',
    stars: 'Stars',
    forks: 'Forks',
    followers: 'Followers',
    topLanguages: 'Top Languages',
    recentActivity: 'Recent Activity',
    contributionGraph: 'Contribution Graph',
    viewProfile: 'View Profile',
    viewOnGitHub: 'View on GitHub',

    // Common
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    viewMore: 'View More',
    close: 'Close',
  },

  bn: {
    // Navigation
    overview: 'সারসংক্ষেপ',
    experience: 'অভিজ্ঞতা',
    skillsNavigation: 'দক্ষতা',
    github: 'গিটহাব',
    contact: 'যোগাযোগ',

    // Header
    professionalSummary: 'পেশাগত সারসংক্ষেপ',
    recentAchievements: 'সাম্প্রতিক অর্জন',
    keyStrengths: 'প্রধান শক্তি',

    // Experience
    workExperience: 'কাজের অভিজ্ঞতা',
    education: 'শিক্ষা',
    certifications: 'সার্টিফিকেশন',
    current: 'বর্তমান',
    issuedDate: 'জারি করা হয়েছে',
    expiryDate: 'মেয়াদ শেষ',

    // Skills
    technicalSkills: 'প্রযুক্তিগত দক্ষতা',
    skills: 'দক্ষতা',
    yearsExperience: 'বছর অভিজ্ঞতা',
    projects: 'প্রকল্প',

    // Contact
    contactInformation: 'যোগাযোগের তথ্য',
    connectWithMe: 'আমার সাথে যুক্ত হন',
    resumeDocuments: 'রিজিউম এবং নথি',
    downloadResume: 'রিজিউম ডাউনলোড',
    generating: 'তৈরি হচ্ছে...',
    pdfHint:
      '💡 PDF প্রিন্ট ডায়ালগে খুলবে। HTML একটি ফাইল হিসাবে ডাউনলোড হবে।',

    // GitHub
    githubStatistics: 'গিটহাব পরিসংখ্যান',
    githubProfile: 'গিটহাব প্রোফাইল',
    repositories: 'রিপোজিটরি',
    stars: 'স্টার',
    forks: 'ফর্ক',
    followers: 'ফলোয়ার',
    topLanguages: 'শীর্ষ ভাষা',
    recentActivity: 'সাম্প্রতিক কার্যক্রম',
    contributionGraph: 'অবদান গ্রাফ',
    viewProfile: 'প্রোফাইল দেখুন',
    viewOnGitHub: 'গিটহাবে দেখুন',

    // Common
    loading: 'লোড হচ্ছে...',
    error: 'ত্রুটি',
    retry: 'পুনরায় চেষ্টা',
    viewMore: 'আরও দেখুন',
    close: 'বন্ধ',
  },

  hi: {
    // Navigation
    overview: 'अवलोकन',
    experience: 'अनुभव',
    skillsNavigation: 'कौशल',
    github: 'गिटहब',
    contact: 'संपर्क',

    // Header
    professionalSummary: 'व्यावसायिक सारांश',
    recentAchievements: 'हाल की उपलब्धियां',
    keyStrengths: 'मुख्य शक्तियां',

    // Experience
    workExperience: 'कार्य अनुभव',
    education: 'शिक्षा',
    certifications: 'प्रमाणपत्र',
    current: 'वर्तमान',
    issuedDate: 'जारी किया गया',
    expiryDate: 'समाप्ति',

    // Skills
    technicalSkills: 'तकनीकी कौशल',
    skills: 'कौशल',
    yearsExperience: 'वर्ष अनुभव',
    projects: 'परियोजनाएं',

    // Contact
    contactInformation: 'संपर्क जानकारी',
    connectWithMe: 'मुझसे जुड़ें',
    resumeDocuments: 'रिज्यूम और दस्तावेज',
    downloadResume: 'रिज्यूम डाउनलोड करें',
    generating: 'तैयार हो रहा है...',
    pdfHint:
      '💡 PDF प्रिंट डायलॉग में खुलेगा। HTML एक फ़ाइल के रूप में डाउनलोड होगा।',

    // GitHub
    githubStatistics: 'गिटहब आंकड़े',
    githubProfile: 'गिटहब प्रोफाइल',
    repositories: 'रिपॉजिटरी',
    stars: 'स्टार',
    forks: 'फोर्क',
    followers: 'फॉलोअर्स',
    topLanguages: 'शीर्ष भाषाएं',
    recentActivity: 'हाल की गतिविधि',
    contributionGraph: 'योगदान ग्राफ',
    viewProfile: 'प्रोफाइल देखें',
    viewOnGitHub: 'गिटहब पर देखें',

    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    retry: 'पुनः प्रयास',
    viewMore: 'और देखें',
    close: 'बंद करें',
  },
};

// Language names for display
export const languageNames: Record<Language, string> = {
  en: 'English',
  bn: 'বাংলা',
  hi: 'हिन्दी',
};

// Language flags for display
export const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  bn: '🇧🇩',
  hi: '🇮🇳',
};

// Get translation for current language
export const getTranslation = (
  language: Language,
  key: keyof Translations
): string => {
  return translations[language][key] || translations.en[key] || key;
};

// Get all translations for a language
export const getTranslations = (language: Language): Translations => {
  return translations[language];
};
