import { logger, errorToLogContext } from '../lib/logger';

export interface AutomationTask {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  conditions?: AutomationCondition[];
  isEnabled: boolean;
  isRunning: boolean;
  lastRun?: Date;
  nextRun?: Date;
  runCount: number;
  successCount: number;
  errorCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationTrigger {
  type: 'schedule' | 'event' | 'file_change' | 'app_open' | 'voice_command' | 'ai_suggestion';
  config: {
    // Schedule trigger
    cron?: string;
    interval?: number; // in milliseconds
    
    // Event trigger
    event?: string;
    
    // File change trigger
    path?: string;
    watchSubdirectories?: boolean;
    
    // App open trigger
    appId?: string;
    
    // Voice command trigger
    command?: string;
    
    // AI suggestion trigger
    context?: string;
  };
}

export interface AutomationAction {
  type: 'open_app' | 'close_app' | 'create_file' | 'send_notification' | 'ai_generate' | 'file_operation' | 'system_command' | 'web_request';
  config: {
    // App actions
    appId?: string;
    data?: Record<string, unknown>;
    
    // File actions
    filePath?: string;
    content?: string;
    operation?: 'create' | 'update' | 'delete' | 'copy' | 'move';
    
    // Notification actions
    title?: string;
    message?: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    
    // AI generation actions
    prompt?: string;
    model?: string;
    outputType?: 'text' | 'image' | 'code' | 'json';
    
    // System command actions
    command?: string;
    args?: string[];
    workingDirectory?: string;
    
    // Web request actions
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: string | Record<string, unknown>;
  };
}

export interface AutomationCondition {
  type: 'file_exists' | 'time_range' | 'app_running' | 'system_load' | 'ai_evaluation';
  config: {
    // File condition
    filePath?: string;
    
    // Time range condition
    startTime?: string; // HH:MM format
    endTime?: string; // HH:MM format
    days?: number[]; // 0-6 (Sunday-Saturday)
    
    // App running condition
    appId?: string;
    
    // System load condition
    maxCpuUsage?: number; // 0-100
    maxMemoryUsage?: number; // 0-100
    
    // AI evaluation condition
    prompt?: string;
    expectedResult?: string;
  };
}

export interface AutomationExecution {
  id: string;
  taskId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  error?: string;
  results: Record<string, unknown>[];
  logs: string[];
}

export class AIAutomationService {
  private tasks: Map<string, AutomationTask> = new Map();
  private executions: Map<string, AutomationExecution> = new Map();
  private isRunning = false;
  private intervalId: number | null = null;
  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor() {
    this.loadTasks();
    this.startScheduler();
  }

  private loadTasks() {
    if (typeof window === 'undefined') return;
    const savedTasks = localStorage.getItem('durgasos-automation-tasks');
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach((task: AutomationTask) => {
          this.tasks.set(task.id, {
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            lastRun: task.lastRun ? new Date(task.lastRun) : new Date(),
            nextRun: task.nextRun ? new Date(task.nextRun) : new Date()
          });
        });
      } catch (error) {
        logger.error('Failed to load automation tasks:', errorToLogContext(error));
      }
    }
  }

  private saveTasks() {
    if (typeof window === 'undefined') return;
    const tasks = Array.from(this.tasks.values());
    localStorage.setItem('durgasos-automation-tasks', JSON.stringify(tasks));
  }

  private startScheduler() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = window.setInterval(() => {
      this.checkScheduledTasks();
    }, 1000); // Check every second
  }

  private stopScheduler() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  private checkScheduledTasks() {
    const now = new Date();
    
    for (const task of this.tasks.values()) {
      if (!task.isEnabled || task.isRunning) continue;
      
      if (task.trigger.type === 'schedule' && task.nextRun && now >= task.nextRun) {
        this.executeTask(task.id);
      }
    }
  }

  async createTask(task: Omit<AutomationTask, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'successCount' | 'errorCount' | 'isRunning'>): Promise<string> {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const newTask: AutomationTask = {
      ...task,
      id,
      createdAt: now,
      updatedAt: now,
      runCount: 0,
      successCount: 0,
      errorCount: 0,
      isRunning: false
    };

    // Calculate next run time for scheduled tasks
    if (task.trigger.type === 'schedule') {
      newTask.nextRun = this.calculateNextRun(task.trigger) || new Date();
    }

    this.tasks.set(id, newTask);
    this.saveTasks();
    
    this.emit('taskCreated', newTask);
    return id;
  }

  async updateTask(taskId: string, updates: Partial<Omit<AutomationTask, 'id' | 'createdAt' | 'updatedAt'>>): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    const updatedTask: AutomationTask = {
      ...task,
      ...updates,
      updatedAt: new Date()
    };

    // Recalculate next run time if trigger changed
    if (updates.trigger && updates.trigger.type === 'schedule') {
      updatedTask.nextRun = this.calculateNextRun(updates.trigger) || new Date();
    }

    this.tasks.set(taskId, updatedTask);
    this.saveTasks();
    
    this.emit('taskUpdated', updatedTask);
    return true;
  }

  async deleteTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    this.tasks.delete(taskId);
    this.saveTasks();
    
    this.emit('taskDeleted', task);
    return true;
  }

  async enableTask(taskId: string): Promise<boolean> {
    return this.updateTask(taskId, { isEnabled: true });
  }

  async disableTask(taskId: string): Promise<boolean> {
    return this.updateTask(taskId, { isEnabled: false });
  }

  async executeTask(taskId: string): Promise<string> {
    const task = this.tasks.get(taskId);
    if (!task || task.isRunning) return '';

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const execution: AutomationExecution = {
      id: executionId,
      taskId,
      status: 'running',
      startTime: new Date(),
      results: [],
      logs: []
    };

    this.executions.set(executionId, execution);
    task.isRunning = true;
    task.runCount++;

    try {
      // Check conditions
      if (task.conditions && !(await this.checkConditions(task.conditions))) {
        execution.status = 'cancelled';
        execution.endTime = new Date();
        task.isRunning = false;
        this.emit('taskCancelled', { task, execution });
        return executionId;
      }

      // Execute actions
      for (const action of task.actions) {
        const result = await this.executeAction(action);
        execution.results.push(result);
        execution.logs.push(`Executed action: ${action.type}`);
      }

      execution.status = 'completed';
      execution.endTime = new Date();
      task.successCount++;
      task.lastRun = new Date();

      // Calculate next run time for scheduled tasks
      if (task.trigger.type === 'schedule') {
        task.nextRun = this.calculateNextRun(task.trigger) || new Date();
      }

      this.emit('taskCompleted', { task, execution });
    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.endTime = new Date();
      task.errorCount++;
      task.isRunning = false;

      this.emit('taskFailed', { task, execution, error });
    }

    task.isRunning = false;
    this.saveTasks();
    return executionId;
  }

  private async checkConditions(conditions: AutomationCondition[]): Promise<boolean> {
    for (const condition of conditions) {
      switch (condition.type) {
        case 'file_exists':
          if (condition.config.filePath) {
            // Check if file exists (would need file system integration)
            const exists = await this.checkFileExists();
            if (!exists) return false;
          }
          break;
        
        case 'time_range':
          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const currentDay = now.getDay();
          
          if (condition.config.startTime && condition.config.endTime) {
            const [startHour, startMin] = condition.config.startTime.split(':').map(Number);
            const [endHour, endMin] = condition.config.endTime.split(':').map(Number);
            const startTime = (startHour || 0) * 60 + (startMin || 0);
            const endTime = (endHour || 0) * 60 + (endMin || 0);
            
            if (currentTime < startTime || currentTime > endTime) return false;
          }
          
          if (condition.config.days && !condition.config.days.includes(currentDay)) {
            return false;
          }
          break;
        
        case 'app_running':
          if (condition.config.appId) {
            // Check if app is running (would need app system integration)
            const isRunning = await this.checkAppRunning();
            if (!isRunning) return false;
          }
          break;
        
        case 'system_load':
          const systemInfo = await this.getSystemInfo();
          if (condition.config.maxCpuUsage && systemInfo.cpuUsage > condition.config.maxCpuUsage) {
            return false;
          }
          if (condition.config.maxMemoryUsage && systemInfo.memoryUsage > condition.config.maxMemoryUsage) {
            return false;
          }
          break;
        
        case 'ai_evaluation':
          if (condition.config.prompt) {
            // Use AI to evaluate condition (would need AI service integration)
            const result = await this.evaluateWithAI();
            if (condition.config.expectedResult && result !== condition.config.expectedResult) {
              return false;
            }
          }
          break;
      }
    }
    
    return true;
  }

  private async executeAction(action: AutomationAction): Promise<{ success: boolean; result?: unknown; error?: string; [key: string]: unknown }> {
    switch (action.type) {
      case 'open_app':
        if (action.config.appId) {
          // Open app (would need app system integration)
          logger.info(`Opening app: ${action.config.appId}`);
          return { success: true, result: { appId: action.config.appId } };
        }
        break;
      
      case 'close_app':
        if (action.config.appId) {
          // Close app (would need app system integration)
          logger.info(`Closing app: ${action.config.appId}`);
          return { success: true, result: { appId: action.config.appId } };
        }
        break;
      
      case 'create_file':
        if (action.config.filePath && action.config.content) {
          // Create file (would need file system integration)
          logger.info(`Creating file: ${action.config.filePath}`);
          return { success: true, result: { filePath: action.config.filePath } };
        }
        break;
      
      case 'send_notification':
        // Send notification (would need notification system integration)
        logger.info(`Sending notification: ${action.config.title} - ${action.config.message}`);
        return { success: true, result: { notification: { title: action.config.title, message: action.config.message } } };
      
      case 'ai_generate':
        if (action.config.prompt) {
          // Generate content with AI (would need AI service integration)
          logger.info(`Generating AI content: ${action.config.prompt}`);
          return { success: true, result: { content: 'Generated content placeholder' } };
        }
        break;
      
      case 'file_operation':
        if (action.config.filePath && action.config.operation) {
          // Perform file operation (would need file system integration)
          logger.info(`Performing file operation: ${action.config.operation} on ${action.config.filePath}`);
          return { success: true, result: { operation: action.config.operation, filePath: action.config.filePath } };
        }
        break;
      
      case 'system_command':
        if (action.config.command) {
          // Execute system command (would need system integration)
          logger.info(`Executing system command: ${action.config.command}`);
          return { success: true, result: { command: action.config.command } };
        }
        break;
      
      case 'web_request':
        if (action.config.url) {
          // Make web request
          try {
            const response = await fetch(action.config.url, {
              method: action.config.method || 'GET',
              headers: action.config.headers || {},
              body: action.config.body ? JSON.stringify(action.config.body) : null
            });
            const data = await response.json();
            return { success: true, result: { data, status: response.status } };
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
          }
        }
        break;
    }
    
    return { success: false, error: 'Invalid action configuration' };
  }

  private calculateNextRun(trigger: AutomationTrigger): Date {
    if (trigger.type !== 'schedule') return new Date();
    
    const now = new Date();
    
    if (trigger.config.cron) {
      // Simple cron-like scheduling (would need a proper cron parser)
      return new Date(now.getTime() + 60000); // Next minute for now
    }
    
    if (trigger.config.interval) {
      return new Date(now.getTime() + trigger.config.interval);
    }
    
    return new Date();
  }

  // Helper methods (would need actual implementations)
  private async checkFileExists(): Promise<boolean> {
    // Implementation would depend on file system service
    return false;
  }

  private async checkAppRunning(): Promise<boolean> {
    // Implementation would depend on app system
    return false;
  }

  private async getSystemInfo(): Promise<{ cpuUsage: number; memoryUsage: number }> {
    // Implementation would depend on system monitoring
    return { cpuUsage: 0, memoryUsage: 0 };
  }

  private async evaluateWithAI(): Promise<string> {
    // Implementation would depend on AI service
    return 'AI evaluation placeholder';
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

  // Public API
  getTask(taskId: string): AutomationTask | undefined {
    return this.tasks.get(taskId);
  }

  getAllTasks(): AutomationTask[] {
    return Array.from(this.tasks.values());
  }

  getEnabledTasks(): AutomationTask[] {
    return Array.from(this.tasks.values()).filter(task => task.isEnabled);
  }

  getExecution(executionId: string): AutomationExecution | undefined {
    return this.executions.get(executionId);
  }

  getTaskExecutions(taskId: string): AutomationExecution[] {
    return Array.from(this.executions.values()).filter(exec => exec.taskId === taskId);
  }

  getRecentExecutions(limit = 10): AutomationExecution[] {
    return Array.from(this.executions.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  // AI-powered task suggestions
  async suggestTasks(context: string): Promise<AutomationTask[]> {
    // This would use AI to suggest automation tasks based on context
    logger.info(`Suggesting tasks for context: ${context}`);
    return [];
  }

  // Task templates
  getTaskTemplates(): Partial<AutomationTask>[] {
    return [
      {
        name: 'Daily File Backup',
        description: 'Automatically backup important files daily',
        trigger: {
          type: 'schedule',
          config: { cron: '0 2 * * *' } // 2 AM daily
        },
        actions: [{
          type: 'file_operation',
          config: {
            operation: 'copy',
            filePath: '/important-files',
            content: '/backup/important-files'
          }
        }]
      },
      {
        name: 'App Startup Sequence',
        description: 'Open essential apps when system starts',
        trigger: {
          type: 'event',
          config: { event: 'system_start' }
        },
        actions: [
          { type: 'open_app', config: { appId: 'explorer' } },
          { type: 'open_app', config: { appId: 'notepad' } },
          { type: 'open_app', config: { appId: 'settings' } }
        ]
      },
      {
        name: 'AI Content Generation',
        description: 'Generate daily content with AI',
        trigger: {
          type: 'schedule',
          config: { interval: 24 * 60 * 60 * 1000 } // 24 hours
        },
        actions: [{
          type: 'ai_generate',
          config: {
            prompt: 'Generate a daily productivity tip',
            outputType: 'text'
          }
        }]
      }
    ];
  }

  destroy() {
    this.stopScheduler();
    this.tasks.clear();
    this.executions.clear();
    this.eventListeners.clear();
  }
}

// Singleton instance
export const aiAutomationService = new AIAutomationService();
