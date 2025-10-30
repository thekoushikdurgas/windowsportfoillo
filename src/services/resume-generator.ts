 // Resume Generator Service
// Generates PDF resume from personal data

import { personalInfo, workExperience, education, certifications, skills, professionalSummary } from '@/data/personal-info';

export interface ResumeData {
  personalInfo: typeof personalInfo;
  workExperience: typeof workExperience;
  education: typeof education;
  certifications: typeof certifications;
  skills: typeof skills;
  professionalSummary: typeof professionalSummary;
}

export class ResumeGenerator {
  private data: ResumeData;

  constructor() {
    this.data = {
      personalInfo,
      workExperience,
      education,
      certifications,
      skills,
      professionalSummary
    };
  }

  /**
   * Generate HTML content for the resume
   */
  generateHTML(): string {
    const { personalInfo, workExperience, education, certifications, skills, professionalSummary } = this.data;

    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      const categorySkills = acc[skill.category];
      if (categorySkills) {
        categorySkills.push(skill);
      }
      return acc;
    }, {} as Record<string, typeof skills>);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.name} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
        }
        
        .header h1 {
            font-size: 2.5em;
            color: #1e40af;
            margin-bottom: 10px;
        }
        
        .header h2 {
            font-size: 1.3em;
            color: #64748b;
            margin-bottom: 15px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            font-size: 0.9em;
            color: #64748b;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section-title {
            font-size: 1.5em;
            color: #1e40af;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        
        .experience-item, .education-item, .certification-item {
            margin-bottom: 20px;
            padding-left: 20px;
            border-left: 3px solid #e2e8f0;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 5px;
        }
        
        .item-title {
            font-weight: bold;
            color: #1e40af;
            font-size: 1.1em;
        }
        
        .item-company {
            color: #64748b;
            font-weight: 500;
        }
        
        .item-duration {
            color: #64748b;
            font-size: 0.9em;
        }
        
        .item-description {
            margin: 10px 0;
            color: #475569;
        }
        
        .technologies {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
        }
        
        .tech-tag {
            background: #e2e8f0;
            color: #475569;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .skill-category {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
        }
        
        .skill-category h4 {
            color: #1e40af;
            margin-bottom: 10px;
            font-size: 1.1em;
        }
        
        .skill-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .skill-name {
            font-weight: 500;
        }
        
        .skill-proficiency {
            color: #64748b;
            font-size: 0.9em;
        }
        
        .summary {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .summary h3 {
            color: #1e40af;
            margin-bottom: 15px;
        }
        
        .strengths {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 10px;
        }
        
        .strength-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .strength-item::before {
            content: "✓";
            color: #10b981;
            font-weight: bold;
        }
        
        .achievements {
            margin-top: 15px;
        }
        
        .achievement-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 5px;
        }
        
        .achievement-item::before {
            content: "•";
            color: #2563eb;
            font-weight: bold;
        }
        
        @media print {
            body {
                font-size: 12px;
            }
            
            .container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .section {
                margin-bottom: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>${personalInfo.name}</h1>
            <h2>${personalInfo.title}</h2>
            <div class="contact-info">
                <span>📧 ${personalInfo.email}</span>
                <span>📱 ${personalInfo.phone}</span>
                <span>📍 ${personalInfo.location}</span>
                <span>🌐 ${personalInfo.website}</span>
            </div>
        </div>

        <!-- Professional Summary -->
        <div class="summary">
            <h3>Professional Summary</h3>
            <p><strong>Current Role:</strong> ${professionalSummary.currentRole}</p>
            <p><strong>Experience:</strong> ${professionalSummary.experience}</p>
            <p><strong>Education:</strong> ${professionalSummary.education}</p>
            <p><strong>Availability:</strong> ${professionalSummary.availability}</p>
            
            <div class="strengths">
                <h4>Key Strengths:</h4>
                ${professionalSummary.keyStrengths.map(strength => 
                    `<div class="strength-item">${strength}</div>`
                ).join('')}
            </div>
            
            <div class="achievements">
                <h4>Recent Achievements:</h4>
                ${professionalSummary.recentAchievements.map(achievement => 
                    `<div class="achievement-item">${achievement}</div>`
                ).join('')}
            </div>
        </div>

        <!-- Work Experience -->
        <div class="section">
            <h2 class="section-title">Work Experience</h2>
            ${workExperience.map(exp => `
                <div class="experience-item">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${exp.position}</div>
                            <div class="item-company">${exp.company}</div>
                            <div style="color: #64748b; font-size: 0.9em;">${exp.location}</div>
                        </div>
                        <div class="item-duration">${exp.duration}</div>
                    </div>
                    <div class="item-description">${exp.description}</div>
                    <div class="technologies">
                        ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            `).join('')}
        </div>

        <!-- Education -->
        <div class="section">
            <h2 class="section-title">Education</h2>
            ${education.map(edu => `
                <div class="education-item">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${edu.degree}</div>
                            <div class="item-company">${edu.institution}</div>
                            <div style="color: #64748b; font-size: 0.9em;">${edu.location}</div>
                        </div>
                        <div class="item-duration">${edu.duration} | ${edu.grade}</div>
                    </div>
                    <div class="item-description">${edu.description}</div>
                </div>
            `).join('')}
        </div>

        <!-- Certifications -->
        <div class="section">
            <h2 class="section-title">Certifications</h2>
            ${certifications.map(cert => `
                <div class="certification-item">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${cert.name}</div>
                            <div class="item-company">${cert.issuer}</div>
                            <div style="color: #64748b; font-size: 0.9em;">Credential ID: ${cert.credentialId}</div>
                        </div>
                        <div class="item-duration">${cert.issuedDate}${cert.expiryDate ? ` - ${cert.expiryDate}` : ''}</div>
                    </div>
                    <div class="item-description">${cert.description}</div>
                </div>
            `).join('')}
        </div>

        <!-- Skills -->
        <div class="section">
            <h2 class="section-title">Technical Skills</h2>
            <div class="skills-grid">
                ${Object.entries(skillsByCategory).map(([category, categorySkills]) => `
                    <div class="skill-category">
                        <h4>${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</h4>
                        ${categorySkills.map(skill => `
                            <div class="skill-item">
                                <span class="skill-name">${skill.name}</span>
                                <span class="skill-proficiency">${skill.proficiency}% (${skill.yearsOfExperience}y)</span>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Generate and download PDF resume
   */
  async generatePDF(): Promise<void> {
    try {
      const html = this.generateHTML();
      
      // Create a new window with the HTML content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Unable to open print window. Please check your popup blocker settings.');
      }

      printWindow.document.write(html);
      printWindow.document.close();

      // Wait for content to load
      printWindow.onload = () => {
        // Trigger print dialog
        printWindow.print();
        
        // Close the window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    } catch (error) {
      throw new Error('Failed to generate PDF resume. Please try again.');
    }
  }

  /**
   * Generate and download HTML resume
   */
  async generateHTMLFile(): Promise<void> {
    try {
      const html = this.generateHTML();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${personalInfo.name.replace(/\s+/g, '_')}_Resume.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Failed to generate HTML resume. Please try again.');
    }
  }

  /**
   * Get resume data as JSON
   */
  getResumeData(): ResumeData {
    return this.data;
  }
}

// Export singleton instance
export const resumeGenerator = new ResumeGenerator();
