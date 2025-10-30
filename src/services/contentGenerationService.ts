import { logger, errorToLogContext } from '../lib/logger';

export interface ContentGenerationRequest {
  id: string;
  type: 'text' | 'image' | 'code' | 'document' | 'presentation' | 'spreadsheet' | 'email' | 'social_media';
  prompt: string;
  options: ContentGenerationOptions;
  context?: Record<string, unknown>;
  userId?: string;
  createdAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: Record<string, unknown>;
  error?: string;
}

export interface ContentGenerationOptions {
  // Text generation options
  maxLength?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  
  // Image generation options
  width?: number;
  height?: number;
  style?: 'realistic' | 'artistic' | 'cartoon' | 'abstract' | 'minimalist';
  quality?: 'draft' | 'standard' | 'high' | 'ultra';
  format?: 'png' | 'jpg' | 'webp' | 'svg';
  
  // Code generation options
  language?: string;
  framework?: string;
  includeComments?: boolean;
  includeTests?: boolean;
  codeStyle?: 'standard' | 'airbnb' | 'google' | 'prettier';
  
  // Document generation options
  documentFormat?: 'markdown' | 'html' | 'pdf' | 'docx' | 'txt';
  template?: string;
  includeTOC?: boolean;
  includeReferences?: boolean;
  
  // Presentation options
  slideCount?: number;
  theme?: 'modern' | 'classic' | 'minimal' | 'corporate' | 'creative';
  includeAnimations?: boolean;
  
  // Spreadsheet options
  rowCount?: number;
  columnCount?: number;
  includeFormulas?: boolean;
  includeCharts?: boolean;
  
  // Email options
  tone?: 'formal' | 'casual' | 'friendly' | 'professional' | 'urgent';
  length?: 'short' | 'medium' | 'long';
  includeSignature?: boolean;
  
  // Social media options
  platform?: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok';
  hashtags?: string[];
  mentions?: string[];
  includeEmojis?: boolean;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  prompt: string;
  options: ContentGenerationOptions;
  examples: string[];
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

export interface ContentGenerationResult {
  id: string;
  requestId: string;
  content: string | Record<string, unknown>;
  metadata: {
    wordCount?: number;
    characterCount?: number;
    processingTime: number;
    model: string;
    version: string;
    tokens?: {
      prompt: number;
      completion: number;
      total: number;
    };
  };
  files?: {
    url: string;
    filename: string;
    size: number;
    type: string;
  }[];
  createdAt: Date;
}

export class ContentGenerationService {
  private requests: Map<string, ContentGenerationRequest> = new Map();
  private templates: Map<string, ContentTemplate> = new Map();
  private results: Map<string, ContentGenerationResult> = new Map();
  private isProcessing = false;
  private processingQueue: string[] = [];
  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor() {
    this.loadTemplates();
    this.startProcessing();
  }

  private loadTemplates() {
    if (typeof window === 'undefined') return;
    const savedTemplates = localStorage.getItem('durgasos-content-templates');
    if (savedTemplates) {
      try {
        const templates = JSON.parse(savedTemplates);
        templates.forEach((template: ContentTemplate) => {
          this.templates.set(template.id, {
            ...template,
            createdAt: new Date(template.createdAt),
            updatedAt: new Date(template.updatedAt)
          });
        });
      } catch (error) {
        logger.error('Failed to load content templates:', errorToLogContext(error));
      }
    }

    // Load default templates
    this.loadDefaultTemplates();
  }

  private loadDefaultTemplates() {
    const defaultTemplates: ContentTemplate[] = [
      {
        id: 'blog-post',
        name: 'Blog Post',
        description: 'Generate a comprehensive blog post on any topic',
        type: 'text',
        category: 'writing',
        prompt: 'Write a comprehensive blog post about {topic}. Include an engaging introduction, well-structured body paragraphs with subheadings, and a compelling conclusion. Make it informative and engaging for readers.',
        options: {
          maxLength: 2000,
          temperature: 0.7,
          includeTOC: true
        },
        examples: ['Write a blog post about artificial intelligence in healthcare', 'Create a blog post about sustainable living tips'],
        tags: ['blog', 'writing', 'content', 'seo'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0
      },
      {
        id: 'product-description',
        name: 'Product Description',
        description: 'Generate compelling product descriptions for e-commerce',
        type: 'text',
        category: 'marketing',
        prompt: 'Write a compelling product description for {product}. Highlight key features, benefits, and unique selling points. Use persuasive language to encourage purchases.',
        options: {
          maxLength: 500,
          temperature: 0.8,
          tone: 'professional'
        },
        examples: ['Write a product description for wireless headphones', 'Create a product description for organic skincare set'],
        tags: ['ecommerce', 'marketing', 'sales', 'product'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0
      },
      {
        id: 'code-function',
        name: 'Code Function',
        description: 'Generate code functions in various programming languages',
        type: 'code',
        category: 'development',
        prompt: 'Write a {language} function that {description}. Include proper error handling, documentation, and examples.',
        options: {
          language: 'javascript',
          includeComments: true,
          includeTests: true,
          codeStyle: 'standard'
        },
        examples: ['Write a JavaScript function that sorts an array', 'Create a Python function that validates email addresses'],
        tags: ['code', 'programming', 'development', 'function'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0
      },
      {
        id: 'social-media-post',
        name: 'Social Media Post',
        description: 'Generate engaging social media posts for various platforms',
        type: 'social_media',
        category: 'marketing',
        prompt: 'Create an engaging {platform} post about {topic}. Use appropriate tone, hashtags, and emojis for the platform.',
        options: {
          platform: 'twitter',
          includeEmojis: true,
          tone: 'casual'
        },
        examples: ['Create a Twitter post about new product launch', 'Write an Instagram post about team building'],
        tags: ['social', 'marketing', 'engagement', 'content'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0
      },
      {
        id: 'email-template',
        name: 'Email Template',
        description: 'Generate professional email templates for various purposes',
        type: 'email',
        category: 'communication',
        prompt: 'Write a {tone} email about {subject}. Include proper greeting, body, and closing.',
        options: {
          tone: 'professional',
          length: 'medium',
          includeSignature: true
        },
        examples: ['Write a professional email about project update', 'Create a friendly email for customer follow-up'],
        tags: ['email', 'communication', 'business', 'template'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0
      }
    ];

    defaultTemplates.forEach(template => {
      if (!this.templates.has(template.id)) {
        this.templates.set(template.id, template);
      }
    });

    this.saveTemplates();
  }

  private saveTemplates() {
    if (typeof window === 'undefined') return;
    const templates = Array.from(this.templates.values());
    localStorage.setItem('durgasos-content-templates', JSON.stringify(templates));
  }

  private startProcessing() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    this.processQueue();
  }

  private async processQueue() {
    while (this.processingQueue.length > 0 && this.isProcessing) {
      const requestId = this.processingQueue.shift();
      if (requestId) {
        await this.processRequest(requestId);
      }
    }
    
    if (this.isProcessing) {
      setTimeout(() => this.processQueue(), 1000);
    }
  }

  private async processRequest(requestId: string) {
    const request = this.requests.get(requestId);
    if (!request) return;

    try {
      request.status = 'processing';
      this.emit('requestProcessing', request);

      const result = await this.processContent(request);
      
      request.status = 'completed';
      request.result = result;
      
      this.results.set(requestId, {
        id: requestId,
        requestId,
        content: result,
        metadata: {
          processingTime: Date.now() - request.createdAt.getTime(),
          model: 'durgasos-ai',
          version: '1.0.0'
        },
        createdAt: new Date()
      });

      this.emit('requestCompleted', { request, result });
    } catch (error) {
      request.status = 'failed';
      request.error = error instanceof Error ? error.message : 'Unknown error';
      this.emit('requestFailed', { request, error });
    }
  }

  private async processContent(request: ContentGenerationRequest): Promise<{ content: string; metadata?: Record<string, unknown> }> {
    switch (request.type) {
      case 'text':
        return { content: await this.generateText(request) };
      case 'image':
        return { content: await this.generateImage(request) };
      case 'code':
        return { content: await this.generateCode(request) };
      case 'document':
        return { content: await this.generateDocument(request) };
      case 'presentation':
        return { content: JSON.stringify(await this.generatePresentation(request)) };
      case 'spreadsheet':
        return { content: JSON.stringify(await this.generateSpreadsheet(request)) };
      case 'email':
        return { content: await this.generateEmail(request) };
      case 'social_media':
        return { content: await this.generateSocialMediaPost(request) };
      default:
        throw new Error(`Unsupported content type: ${request.type}`);
    }
  }

  private async generateText(request: ContentGenerationRequest): Promise<string> {
    // In a real implementation, this would call an AI service
    const { prompt, options } = request;
    
    // Simulate AI text generation
    const maxLength = options.maxLength || 1000;
    const temperature = options.temperature || 0.7;
    
    // Generate placeholder content based on prompt
    const words = prompt.split(' ').length;
    const estimatedLength = Math.min(maxLength, words * 50);
    
    return `Generated text content for: "${prompt}"\n\nThis is a placeholder response that would be generated by an AI model. The content would be tailored to the specific prompt and options provided. The response would be approximately ${estimatedLength} characters long and generated with a temperature of ${temperature}.\n\nIn a real implementation, this would use advanced language models to create high-quality, contextually relevant content.`;
  }

  private async generateImage(request: ContentGenerationRequest): Promise<string> {
    // In a real implementation, this would call an image generation AI service
    const { prompt, options } = request;
    
    // Simulate image generation based on request parameters
    const width = options?.width || 512;
    const height = options?.height || 512;
    const style = options?.style || 'realistic';
    
    // Log the generation request for debugging
    logger.info(`Generating image: "${prompt}" (${width}x${height}, ${style})`);
    
    // Return a placeholder data URL
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
  }

  private async generateCode(request: ContentGenerationRequest): Promise<string> {
    const { prompt, options } = request;
    const language = options.language || 'javascript';
    const includeComments = options.includeComments !== false;
    const includeTests = options.includeTests || false;
    
    // Generate placeholder code
    let code = `// Generated ${language} code for: ${prompt}\n\n`;
    
    if (includeComments) {
      code += `/**\n * ${prompt}\n * Generated by DurgasOS AI\n */\n`;
    }
    
    code += `function generatedFunction() {\n`;
    code += `  // Implementation would be generated here\n`;
    code += `  return "Generated result";\n`;
    code += `}\n`;
    
    if (includeTests) {
      code += `\n// Generated tests\n`;
      code += `describe('Generated Function', () => {\n`;
      code += `  it('should work correctly', () => {\n`;
      code += `    expect(generatedFunction()).toBe("Generated result");\n`;
      code += `  });\n`;
      code += `});\n`;
    }
    
    return code;
  }

  private async generateDocument(request: ContentGenerationRequest): Promise<string> {
    const { prompt, options } = request;
    const format = options.documentFormat || 'markdown';
    
    let document = '';
    
    if (format === 'markdown') {
      document += `# ${prompt}\n\n`;
      document += `## Introduction\n\n`;
      document += `This document was generated by DurgasOS AI based on the prompt: "${prompt}"\n\n`;
      document += `## Main Content\n\n`;
      document += `The main content would be generated here based on the specific requirements and context provided.\n\n`;
      document += `## Conclusion\n\n`;
      document += `This concludes the generated document.\n`;
    } else if (format === 'html') {
      document += `<!DOCTYPE html>\n<html>\n<head>\n<title>${prompt}</title>\n</head>\n<body>\n`;
      document += `<h1>${prompt}</h1>\n`;
      document += `<p>Generated HTML document content would go here.</p>\n`;
      document += `</body>\n</html>`;
    }
    
    return document;
  }

  private async generatePresentation(request: ContentGenerationRequest): Promise<{ slides: Array<{ id: string; title: string; content: string }>; theme: string }> {
    const { prompt, options } = request;
    const slideCount = options.slideCount || 5;
    const theme = options.theme || 'modern';
    
    const slides = [];
    for (let i = 0; i < slideCount; i++) {
      slides.push({
        id: `slide-${i + 1}`,
        title: `Slide ${i + 1}`,
        content: `Content for slide ${i + 1} based on: ${prompt}`,
        theme
      });
    }
    
    return {
      slides,
      theme
    };
  }

  private async generateSpreadsheet(request: ContentGenerationRequest): Promise<{ data: Array<Array<string>>; headers: string[]; rowCount: number; columnCount: number }> {
    const { options } = request;
    const rowCount = options.rowCount || 10;
    const columnCount = options.columnCount || 5;
    
    const data = [];
    for (let row = 0; row < rowCount; row++) {
      const rowData = [];
      for (let col = 0; col < columnCount; col++) {
        rowData.push(`Data ${row + 1}-${col + 1}`);
      }
      data.push(rowData);
    }
    
    return {
      data,
      headers: Array.from({ length: columnCount }, (_, i) => `Column ${i + 1}`),
      rowCount,
      columnCount
    };
  }

  private async generateEmail(request: ContentGenerationRequest): Promise<string> {
    const { prompt, options } = request;
    // const tone = options.tone || 'professional';
    const length = options.length || 'medium';
    
    let email = `Subject: ${prompt}\n\n`;
    email += `Dear [Recipient],\n\n`;
    email += `I hope this email finds you well. ${prompt}\n\n`;
    
    if (length === 'long') {
      email += `I wanted to provide you with additional details and context regarding this matter. `;
      email += `Please let me know if you have any questions or need further clarification.\n\n`;
    }
    
    email += `Best regards,\n[Your Name]`;
    
    return email;
  }

  private async generateSocialMediaPost(request: ContentGenerationRequest): Promise<string> {
    const { prompt, options } = request;
    const platform = options.platform || 'twitter';
    const includeEmojis = options.includeEmojis !== false;
    
    let post = `${prompt}`;
    
    if (includeEmojis) {
      post += ` ✨`;
    }
    
    if (platform === 'twitter') {
      post += ` #DurgasOS #AI #Generated`;
    } else if (platform === 'instagram') {
      post += ` #DurgasOS #AI #Generated #Tech`;
    }
    
    return post;
  }

  // Public API
  async generateContent(request: Omit<ContentGenerationRequest, 'id' | 'createdAt' | 'status' | 'result' | 'error'>): Promise<string> {
    const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newRequest: ContentGenerationRequest = {
      ...request,
      id,
      createdAt: new Date(),
      status: 'pending'
    };

    this.requests.set(id, newRequest);
    this.processingQueue.push(id);
    
    this.emit('requestCreated', newRequest);
    return id;
  }

  async generateFromTemplate(templateId: string, variables: Record<string, string>): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) throw new Error(`Template not found: ${templateId}`);

    // Replace variables in prompt
    let prompt = template.prompt;
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    const requestId = await this.generateContent({
      type: template.type as 'text' | 'image' | 'code' | 'document' | 'presentation' | 'spreadsheet',
      prompt,
      options: template.options,
      context: { templateId, variables }
    });

    // Update template usage count
    template.usageCount++;
    template.updatedAt = new Date();
    this.saveTemplates();

    return requestId;
  }

  getRequest(requestId: string): ContentGenerationRequest | undefined {
    return this.requests.get(requestId);
  }

  getResult(requestId: string): ContentGenerationResult | undefined {
    return this.results.get(requestId);
  }

  getAllRequests(): ContentGenerationRequest[] {
    return Array.from(this.requests.values());
  }

  getRecentRequests(limit = 10): ContentGenerationRequest[] {
    return Array.from(this.requests.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Template management
  createTemplate(template: Omit<ContentTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): string {
    const id = `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const newTemplate: ContentTemplate = {
      ...template,
      id,
      createdAt: now,
      updatedAt: now,
      usageCount: 0
    };

    this.templates.set(id, newTemplate);
    this.saveTemplates();
    
    this.emit('templateCreated', newTemplate);
    return id;
  }

  updateTemplate(templateId: string, updates: Partial<ContentTemplate>): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date()
    };

    this.templates.set(templateId, updatedTemplate);
    this.saveTemplates();
    
    this.emit('templateUpdated', updatedTemplate);
    return true;
  }

  deleteTemplate(templateId: string): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    this.templates.delete(templateId);
    this.saveTemplates();
    
    this.emit('templateDeleted', template);
    return true;
  }

  getTemplate(templateId: string): ContentTemplate | undefined {
    return this.templates.get(templateId);
  }

  getAllTemplates(): ContentTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category: string): ContentTemplate[] {
    return Array.from(this.templates.values()).filter(template => template.category === category);
  }

  searchTemplates(query: string): ContentTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.templates.values()).filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Event system
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.add(callback);
    }
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data: unknown) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Analytics
  getUsageStats(): Record<string, unknown> {
    const requests = Array.from(this.requests.values());
    const templates = Array.from(this.templates.values());
    
    return {
      totalRequests: requests.length,
      completedRequests: requests.filter(r => r.status === 'completed').length,
      failedRequests: requests.filter(r => r.status === 'failed').length,
      totalTemplates: templates.length,
      mostUsedTemplate: templates.reduce((prev, current) => 
        (prev.usageCount > current.usageCount) ? prev : current
      ),
      requestsByType: requests.reduce((acc, req) => {
        acc[req.type] = (acc[req.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  destroy() {
    this.isProcessing = false;
    this.processingQueue = [];
    this.requests.clear();
    this.templates.clear();
    this.results.clear();
    this.eventListeners.clear();
  }
}

// Singleton instance
export const contentGenerationService = new ContentGenerationService();
