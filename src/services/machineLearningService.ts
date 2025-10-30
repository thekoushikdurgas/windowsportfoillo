import { logger, errorToLogContext } from '../lib/logger';

// ML Data types
type FeatureValue = number | string | boolean;
type FeatureVector = FeatureValue[];
type LabelValue = number | string;
type LabelVector = LabelValue[];

// Training data interface - moved to exported interface below

// Prediction request interface - moved to exported interface below

// Prediction result interface
interface PredictionResult {
  prediction: LabelValue;
  confidence?: number;
  probabilities?: Record<string, number>;
  explanation?: string;
  metadata: {
    modelVersion: string;
    processingTime: number;
    timestamp: Date;
  };
}

export interface ModelConfig {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'clustering' | 'nlp' | 'computer_vision' | 'recommendation';
  architecture: string;
  parameters: Record<string, unknown>;
  hyperparameters: {
    learningRate: number;
    batchSize: number;
    epochs: number;
    optimizer: string;
    lossFunction: string;
    metrics: string[];
  };
  inputShape: number[];
  outputShape: number[];
  preprocessing: {
    normalization: boolean;
    scaling: 'minmax' | 'standard' | 'robust' | 'none';
    encoding: 'onehot' | 'label' | 'embedding' | 'none';
  };
  validation: {
    split: number;
    crossValidation: boolean;
    kFolds?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingData {
  id: string;
  modelId: string;
  features: FeatureVector[];
  labels: LabelVector[];
  metadata: {
    size: number;
    features: number;
    classes?: number | undefined;
    distribution?: Record<string, number> | undefined;
  };
  preprocessing: {
    normalized: boolean;
    scaled: boolean;
    encoded: boolean;
  };
  createdAt: Date;
  [key: string]: unknown;
}

export interface TrainingSession {
  id: string;
  modelId: string;
  dataId: string;
  config: ModelConfig;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: {
    epoch: number;
    totalEpochs: number;
    batch: number;
    totalBatches: number;
    loss: number;
    accuracy: number;
    validationLoss: number;
    validationAccuracy: number;
  };
  metrics: {
    training: {
      loss: number[];
      accuracy: number[];
      precision: number[];
      recall: number[];
      f1Score: number[];
    };
    validation: {
      loss: number[];
      accuracy: number[];
      precision: number[];
      recall: number[];
      f1Score: number[];
    };
  };
  startTime: Date;
  endTime?: Date;
  duration?: number;
  error?: string;
  [key: string]: unknown;
}

export interface ModelVersion {
  id: string;
  modelId: string;
  version: string;
  path: string;
  size: number;
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    auc?: number;
  };
  metadata: {
    trainingData: string;
    trainingSession: string;
    parameters: Record<string, unknown>;
    hyperparameters: Record<string, unknown>;
  };
  isActive: boolean;
  createdAt: Date;
  [key: string]: unknown;
}

export interface PredictionRequest {
  id: string;
  modelId: string;
  versionId: string;
  input: FeatureVector;
  options: {
    returnProbabilities?: boolean;
    returnConfidence?: boolean;
    threshold?: number;
  };
  result?: PredictionResult;
  confidence?: number;
  probabilities?: number[];
  createdAt: Date;
  processingTime?: number;
  [key: string]: unknown;
}

export interface ABTestConfig {
  id: string;
  name: string;
  description: string;
  modelA: string;
  modelB: string;
  trafficSplit: number; // 0-1, percentage for model A
  metrics: string[];
  duration: number; // in days
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  results?: {
    modelA: Record<string, number>;
    modelB: Record<string, number>;
    winner?: string;
    confidence?: number;
  };
  createdAt: Date;
  endDate?: Date;
}

export class MachineLearningService {
  private models: Map<string, ModelConfig> = new Map();
  private trainingData: Map<string, TrainingData> = new Map();
  private trainingSessions: Map<string, TrainingSession> = new Map();
  private modelVersions: Map<string, ModelVersion> = new Map();
  private predictions: Map<string, PredictionRequest> = new Map();
  private abTests: Map<string, ABTestConfig> = new Map();
  private isTraining = false;
  private trainingQueue: string[] = [];
  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor() {
    this.loadModels();
    this.startTrainingScheduler();
  }

  private loadModels() {
    if (typeof window === 'undefined') return;
    const savedModels = localStorage.getItem('durgasos-ml-models');
    if (savedModels) {
      try {
        const models = JSON.parse(savedModels);
        models.forEach((model: ModelConfig) => {
          this.models.set(model.id, {
            ...model,
            createdAt: new Date(model.createdAt),
            updatedAt: new Date(model.updatedAt)
          });
        });
      } catch (error) {
        logger.error('Failed to load ML models:', errorToLogContext(error));
      }
    }
  }

  private saveModels() {
    if (typeof window === 'undefined') return;
    const models = Array.from(this.models.values());
    localStorage.setItem('durgasos-ml-models', JSON.stringify(models));
  }

  private startTrainingScheduler() {
    if (this.isTraining) return;
    
    this.isTraining = true;
    this.processTrainingQueue();
  }

  private async processTrainingQueue() {
    while (this.trainingQueue.length > 0 && this.isTraining) {
      const sessionId = this.trainingQueue.shift();
      if (sessionId) {
        await this.trainModel(sessionId);
      }
    }
    
    if (this.isTraining) {
      setTimeout(() => this.processTrainingQueue(), 1000);
    }
  }

  private async trainModel(sessionId: string) {
    const session = this.trainingSessions.get(sessionId);
    if (!session) return;

    try {
      session.status = 'running';
      this.emit('trainingStarted', session);

      const data = this.trainingData.get(session.dataId);
      if (!data) {
        throw new Error('Training data not found');
      }

      // Simulate training process
      for (let epoch = 0; epoch < session.config.hyperparameters.epochs; epoch++) {
        if (session.status === 'cancelled' as 'running' | 'cancelled') break;

        session.progress.epoch = epoch + 1;
        session.progress.totalEpochs = session.config.hyperparameters.epochs;
        
        // Simulate batch processing
        const batches = Math.ceil(data.features.length / session.config.hyperparameters.batchSize);
        for (let batch = 0; batch < batches; batch++) {
          if (session.status === 'cancelled' as 'running' | 'cancelled') break;

          session.progress.batch = batch + 1;
          session.progress.totalBatches = batches;
          
          // Simulate training metrics
          const progress = (epoch * batches + batch) / (session.config.hyperparameters.epochs * batches);
          session.progress.loss = Math.max(0.1, 1.0 - progress * 0.8);
          session.progress.accuracy = Math.min(0.95, progress * 0.9);
          session.progress.validationLoss = session.progress.loss * 1.1;
          session.progress.validationAccuracy = session.progress.accuracy * 0.95;

          // Update metrics
          session.metrics.training.loss.push(session.progress.loss);
          session.metrics.training.accuracy.push(session.progress.accuracy);
          session.metrics.validation.loss.push(session.progress.validationLoss);
          session.metrics.validation.accuracy.push(session.progress.validationAccuracy);

          this.emit('trainingProgress', session);
          
          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      if (session.status !== ('cancelled' as 'running' | 'cancelled')) {
        session.status = 'completed';
        session.endTime = new Date();
        session.duration = session.endTime.getTime() - session.startTime.getTime();

        // Create model version
        const versionId = await this.createModelVersion(session);
        this.emit('trainingCompleted', { session, versionId });
      }
    } catch (error) {
      session.status = 'failed';
      session.error = error instanceof Error ? error.message : 'Unknown error';
      session.endTime = new Date();
      session.duration = session.endTime.getTime() - session.startTime.getTime();
      this.emit('trainingFailed', { session, error });
    }
  }

  private async createModelVersion(session: TrainingSession): Promise<string> {
    const versionId = `v${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const version: ModelVersion = {
      id: versionId,
      modelId: session.modelId,
      version: `1.0.${Date.now()}`,
      path: `/models/${session.modelId}/${versionId}`,
      size: Math.floor(Math.random() * 1000000) + 100000, // Simulate model size
      performance: {
        accuracy: session.progress.accuracy,
        precision: session.progress.accuracy * 0.95,
        recall: session.progress.accuracy * 0.92,
        f1Score: session.progress.accuracy * 0.93
      },
      metadata: {
        trainingData: session.dataId,
        trainingSession: session.id,
        parameters: session.config.parameters,
        hyperparameters: session.config.hyperparameters
      },
      isActive: true,
      createdAt: new Date()
    };

    this.modelVersions.set(versionId, version);
    return versionId;
  }

  // Model management
  createModel(config: Omit<ModelConfig, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = `model_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date();
    
    const newModel: ModelConfig = {
      ...config,
      id,
      createdAt: now,
      updatedAt: now
    };

    this.models.set(id, newModel);
    this.saveModels();
    
    this.emit('modelCreated', newModel);
    return id;
  }

  updateModel(modelId: string, updates: Partial<ModelConfig>): boolean {
    const model = this.models.get(modelId);
    if (!model) return false;

    const updatedModel = {
      ...model,
      ...updates,
      updatedAt: new Date()
    };

    this.models.set(modelId, updatedModel);
    this.saveModels();
    
    this.emit('modelUpdated', updatedModel);
    return true;
  }

  deleteModel(modelId: string): boolean {
    const model = this.models.get(modelId);
    if (!model) return false;

    this.models.delete(modelId);
    this.saveModels();
    
    this.emit('modelDeleted', model);
    return true;
  }

  getModel(modelId: string): ModelConfig | undefined {
    return this.models.get(modelId);
  }

  getAllModels(): ModelConfig[] {
    return Array.from(this.models.values());
  }

  // Training data management
  createTrainingData(modelId: string, features: FeatureVector[], labels: LabelVector[]): string {
    const id = `data_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    const data: TrainingData = {
      id,
      modelId,
      features,
      labels,
      metadata: {
        size: features.length,
        features: features[0]?.length || 0,
        classes: labels.length > 0 ? new Set(labels).size : undefined
      },
      preprocessing: {
        normalized: false,
        scaled: false,
        encoded: false
      },
      createdAt: new Date()
    };

    this.trainingData.set(id, data);
    this.emit('trainingDataCreated', data);
    return id;
  }

  getTrainingData(dataId: string): TrainingData | undefined {
    return this.trainingData.get(dataId);
  }

  getAllTrainingData(): TrainingData[] {
    return Array.from(this.trainingData.values());
  }

  // Training sessions
  async startTraining(modelId: string, dataId: string): Promise<string> {
    const model = this.models.get(modelId);
    const data = this.trainingData.get(dataId);
    
    if (!model) throw new Error('Model not found');
    if (!data) throw new Error('Training data not found');

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const session: TrainingSession = {
      id: sessionId,
      modelId,
      dataId,
      config: model,
      status: 'pending',
      progress: {
        epoch: 0,
        totalEpochs: model.hyperparameters.epochs,
        batch: 0,
        totalBatches: 0,
        loss: 0,
        accuracy: 0,
        validationLoss: 0,
        validationAccuracy: 0
      },
      metrics: {
        training: {
          loss: [],
          accuracy: [],
          precision: [],
          recall: [],
          f1Score: []
        },
        validation: {
          loss: [],
          accuracy: [],
          precision: [],
          recall: [],
          f1Score: []
        }
      },
      startTime: new Date()
    };

    this.trainingSessions.set(sessionId, session);
    this.trainingQueue.push(sessionId);
    
    this.emit('trainingQueued', session);
    return sessionId;
  }

  cancelTraining(sessionId: string): boolean {
    const session = this.trainingSessions.get(sessionId);
    if (!session || session.status !== 'running') return false;

    session.status = 'cancelled';
    this.emit('trainingCancelled', session);
    return true;
  }

  getTrainingSession(sessionId: string): TrainingSession | undefined {
    return this.trainingSessions.get(sessionId);
  }

  getAllTrainingSessions(): TrainingSession[] {
    return Array.from(this.trainingSessions.values());
  }

  // Model versions
  getModelVersions(modelId: string): ModelVersion[] {
    return Array.from(this.modelVersions.values()).filter(v => v.modelId === modelId);
  }

  getActiveVersion(modelId: string): ModelVersion | undefined {
    return Array.from(this.modelVersions.values())
      .find(v => v.modelId === modelId && v.isActive);
  }

  setActiveVersion(versionId: string): boolean {
    const version = this.modelVersions.get(versionId);
    if (!version) return false;

    // Deactivate other versions of the same model
    this.modelVersions.forEach(v => {
      if (v.modelId === version.modelId) {
        v.isActive = false;
      }
    });

    version.isActive = true;
    this.emit('versionActivated', version);
    return true;
  }

  // Predictions
  async predict(modelId: string, input: FeatureVector, options: PredictionRequest['options'] = {}): Promise<string> {
    const activeVersion = this.getActiveVersion(modelId);
    if (!activeVersion) throw new Error('No active model version found');

    const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const startTime = Date.now();

    const prediction: PredictionRequest = {
      id: predictionId,
      modelId,
      versionId: activeVersion.id,
      input,
      options,
      createdAt: new Date()
    };

    try {
      // Simulate prediction
      const result = await this.simulatePrediction(input, activeVersion);
      if (result.confidence !== undefined) {
        prediction.confidence = result.confidence;
      }
      prediction.processingTime = Date.now() - startTime;

      this.predictions.set(predictionId, prediction);
      this.emit('predictionCompleted', prediction);
    } catch (error) {
      const failedPrediction = { ...prediction, result: undefined as PredictionResult | undefined };
      failedPrediction.processingTime = Date.now() - startTime;
      this.emit('predictionFailed', { prediction: failedPrediction, error });
    }

    return predictionId;
  }

  private async simulatePrediction(input: FeatureVector, version: ModelVersion): Promise<PredictionResult> {
    // Simulate prediction based on model type
    const model = this.models.get(version.modelId);
    if (!model) throw new Error('Model not found');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    const probabilitiesObj: Record<string, number> = {};
    Array.from({ length: 10 }).forEach((_, i) => {
      probabilitiesObj[`class${i}`] = Math.random();
    });

    switch (model.type) {
      case 'classification':
        return {
          prediction: Math.floor(Math.random() * 10) as LabelValue,
          confidence: 0.85 + Math.random() * 0.15,
          probabilities: probabilitiesObj,
          metadata: {
            modelVersion: version.version,
            processingTime: 100,
            timestamp: new Date()
          }
        };
      case 'regression':
        return {
          prediction: Math.random() * 100 as LabelValue,
          confidence: 0.9 + Math.random() * 0.1,
          metadata: {
            modelVersion: version.version,
            processingTime: 100,
            timestamp: new Date()
          }
        };
      case 'nlp':
        return {
          prediction: 'Generated text response' as LabelValue,
          confidence: 0.8 + Math.random() * 0.2,
          metadata: {
            modelVersion: version.version,
            processingTime: 100,
            timestamp: new Date()
          }
        };
      default:
        return {
          prediction: 'Prediction result',
          confidence: 0.75 + Math.random() * 0.25,
          metadata: {
            modelVersion: version.version,
            processingTime: 100,
            timestamp: new Date()
          }
        };
    }
  }

  getPrediction(predictionId: string): PredictionRequest | undefined {
    return this.predictions.get(predictionId);
  }

  getPredictionsByModel(modelId: string): PredictionRequest[] {
    return Array.from(this.predictions.values()).filter(p => p.modelId === modelId);
  }

  // A/B Testing
  createABTest(config: Omit<ABTestConfig, 'id' | 'createdAt' | 'status' | 'endDate' | 'results'> & { results?: ABTestConfig['results'] }): string {
    const id = `ab_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date();
    
    const abTest: ABTestConfig = {
      name: config.name,
      description: config.description,
      modelA: config.modelA,
      modelB: config.modelB,
      trafficSplit: config.trafficSplit,
      metrics: config.metrics,
      duration: config.duration,
      id,
      createdAt: now,
      status: 'active',
      endDate: new Date(now.getTime() + config.duration * 24 * 60 * 60 * 1000)
    };

    if (config.results) {
      abTest.results = config.results;
    }

    this.abTests.set(id, abTest);
    this.emit('abTestCreated', abTest);
    return id;
  }

  getABTest(testId: string): ABTestConfig | undefined {
    return this.abTests.get(testId);
  }

  getAllABTests(): ABTestConfig[] {
    return Array.from(this.abTests.values());
  }

  // Analytics
  getModelAnalytics(modelId: string): Record<string, unknown> {
    const versions = this.getModelVersions(modelId);
    const predictions = this.getPredictionsByModel(modelId);
    const sessions = this.getAllTrainingSessions().filter(s => s.modelId === modelId);

    return {
      modelId,
      versions: versions.length,
      activeVersion: versions.find(v => v.isActive)?.version,
      totalPredictions: predictions.length,
      averageConfidence: predictions.reduce((acc, p) => acc + (p.confidence || 0), 0) / predictions.length,
      trainingSessions: sessions.length,
      averageAccuracy: sessions.reduce((acc, s) => acc + s.progress.accuracy, 0) / sessions.length,
      lastTraining: sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())[0]?.startTime
    };
  }

  getSystemAnalytics(): Record<string, unknown> {
    return {
      totalModels: this.models.size,
      totalTrainingData: this.trainingData.size,
      totalTrainingSessions: this.trainingSessions.size,
      totalPredictions: this.predictions.size,
      activeABTests: Array.from(this.abTests.values()).filter(t => t.status === 'active').length,
      averageModelAccuracy: Array.from(this.modelVersions.values())
        .reduce((acc, v) => acc + v.performance.accuracy, 0) / this.modelVersions.size
    };
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

  destroy() {
    this.isTraining = false;
    this.trainingQueue = [];
    this.models.clear();
    this.trainingData.clear();
    this.trainingSessions.clear();
    this.modelVersions.clear();
    this.predictions.clear();
    this.abTests.clear();
    this.eventListeners.clear();
  }
}

// Singleton instance
export const machineLearningService = new MachineLearningService();
