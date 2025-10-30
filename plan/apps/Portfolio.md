# Portfolio App

## Overview

The Portfolio app showcases Koushik Chandra Saha's collection of projects demonstrating expertise in full-stack development, data analytics, and modern web technologies. The portfolio highlights 13+ projects built using MERN stack and other technologies.

## Features

- **Project Gallery**: Displays 13+ real projects in a responsive grid layout
- **Project Cards**: Each project includes title, description, image, technology tags, and GitHub links
- **Technology Tags**: Visual tags showing MERN stack, Python, Django, and other technologies
- **Action Buttons**: Code (GitHub) and Demo buttons for each project
- **Project Filtering**: Filter by technology stack (MERN, Python, PHP, etc.)
- **Responsive Design**: Adapts to different screen sizes with mobile-first approach
- **Image Support**: Project images with fallback support
- **Timeline View**: Chronological project display from 2019-2022

## Technical Details

- **Component**: `src/components/apps/Portfolio.tsx`
- **Default Size**: 900x650 pixels
- **Pinned**: Yes
- **Desktop**: Yes
- **File Association**: None

## Project Showcase

The portfolio includes 13 real projects from Koushik's GitHub:

### Featured Projects (Top 4)

1. **Chat App on MERN Stack** (Jan 2022 - May 2022)
   - Real-time messaging application
   - Technologies: MongoDB, Express.js, React, Node.js
   - Features: User authentication, real-time messaging, group chats
   - GitHub: https://github.com/thekoushikdurgas/chatapp

2. **Portfolio on MERN Stack** (Dec 2021 - Jan 2022)
   - Personal portfolio website
   - Technologies: MongoDB, Express.js, React, Node.js
   - Features: Project showcase, contact form, responsive design
   - GitHub: https://github.com/thekoushikdurgas/Portfolio

3. **To-Do List on MERN Stack** (Oct 2021 - Dec 2021)
   - Task management application
   - Technologies: MongoDB, Express.js, React, Node.js
   - Features: CRUD operations, user authentication, task categorization
   - GitHub: https://github.com/thekoushikdurgas/tkdtodolist

4. **Unit Converter on MERN Stack** (Oct 2021 - Dec 2021)
   - Multi-unit conversion tool
   - Technologies: MongoDB, Express.js, React, Node.js
   - Features: Multiple unit types, conversion history, responsive UI
   - GitHub: https://github.com/thekoushikdurgas/UnitConverter

### Additional Projects

5. **Password Generator on MERN Stack** (Aug 2021 - Oct 2021)
6. **Resume/CV on MERN Stack** (May 2021 - Jul 2021)
7. **Icons on MERN Stack** (Jan 2021 - May 2021)
8. **Minify on MERN Stack** (Jan 2021 - May 2021)
9. **Tic Tac Toe on MERN Stack** (Aug 2020 - Dec 2020)
10. **Ludo on MERN Stack** (May 2020 - Aug 2020)
11. **Music Player on MERN Stack** (Feb 2020 - May 2020)
12. **Wordle on MERN Stack** (Nov 2019 - Jan 2020)
13. **Login/Forgot Password/Register on MERN Stack**

## Technology Stack

Based on Koushik's expertise and projects:

### Primary Technologies

- **MERN Stack**: MongoDB, Express.js, React, Node.js
- **Python**: Django, Flask, Data Analysis
- **Cloud Platforms**: AWS, Google Cloud Platform, Heroku, Netlify
- **Databases**: MongoDB, MySQL, SQLite
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5, Tailwind CSS

### Professional Skills

- **Data Analytics**: Pandas, Power BI, BigQuery
- **Programming**: C/C++, Java, Python, Data Structures
- **Version Control**: Git, GitHub
- **Certifications**: Google Associate Cloud Engineer, Deloitte Data Engineering

## UI Components

- Gradient background (gray to blue in light mode, gray in dark mode)
- Responsive grid layout (2 columns on medium screens, 4 on large screens)
- Project cards with hover effects and shadows
- Technology tags with color-coded backgrounds (MERN, Python, PHP, etc.)
- Action buttons with icons (GitHub, External Link)
- Project timeline view with chronological sorting
- Filter buttons for technology categories

## Styling Features

- Dark/light mode support
- Hover effects on project cards
- Color-coded technology tags
- Professional typography hierarchy
- Consistent spacing and alignment
- Timeline view with project dates
- GitHub integration styling

## Integration

- Real GitHub repository integration
- Live project demo links where available
- Integrates with Lucide React icons for buttons
- Follows the app configuration pattern
- Responsive design with Tailwind CSS
- Project filtering by technology stack

## User Experience

- Clean, professional layout showcasing real projects
- Easy-to-scan project information with actual GitHub links
- Interactive elements with proper hover states
- Accessible design with proper contrast ratios
- Timeline view for project progression
- Technology-based filtering for easy navigation

## Data Structure

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  demoUrl?: string;
  category: 'mern' | 'python' | 'php' | 'frontend' | 'fullstack';
  status: 'completed' | 'in-progress' | 'archived';
  startDate: string;
  endDate: string;
  features: string[];
}
```

## Future Enhancements

- Live project demos integration
- GitHub API integration for real-time stats
- Project filtering by technology and date
- Detailed project modals with screenshots
- Integration with professional experience timeline
- Skills visualization based on project technologies
