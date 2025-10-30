export interface CommandHistory {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
  exitCode: number;
  duration: number;
  workingDirectory: string;
}

export interface ParsedCommand {
  command: string;
  args: string[];
  original: string;
  pipes?: ParsedCommand[];
  redirect?: {
    type: '>' | '>>' | '<';
    target: string;
  };
}

export interface CommandResult {
  output: string;
  exitCode: number;
  duration: number;
}

export interface TerminalState {
  history: CommandHistory[];
  currentDirectory: string[];
  environment: Record<string, string>;
  aliases: Record<string, string>;
  jobs: Job[];
  prompt: string;
  isExecuting: boolean;
  commandHistory: string[];
  historyIndex: number;
}

export interface Job {
  id: number;
  command: string;
  status: 'running' | 'stopped' | 'completed';
  pid?: number;
  startTime: Date;
  endTime?: Date;
}

export interface TerminalProps {
  onCommandExecute?: (command: string, output: string) => void;
  onTerminalClear?: () => void;
  onHistoryExport?: (history: CommandHistory[]) => void;
  initialDirectory?: string[];
  maxHistorySize?: number;
}

export interface CommandExecutor {
  (args: string[], state: TerminalState): Promise<CommandResult>;
}

export interface CommandRegistry {
  [commandName: string]: {
    executor: CommandExecutor;
    description: string;
    usage: string;
    category: 'filesystem' | 'text' | 'system' | 'environment' | 'utility';
  };
}

export interface TerminalTheme {
  background: string;
  textPrimary: string;
  textSecondary: string;
  textError: string;
  textWarning: string;
  textInfo: string;
  cursor: string;
  selection: string;
  prompt: string;
}

export interface TerminalSettings {
  theme: TerminalTheme;
  fontSize: number;
  fontFamily: string;
  maxHistorySize: number;
  autoComplete: boolean;
  showTimestamps: boolean;
  showExitCodes: boolean;
}

export interface FileSystemCommand {
  name: string;
  description: string;
  usage: string;
  examples: string[];
}

export interface SystemInfo {
  os: string;
  version: string;
  architecture: string;
  uptime: number;
  memory: {
    total: number;
    used: number;
    free: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
  };
  processes: ProcessInfo[];
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: string;
  startTime: Date;
}

export interface NetworkInfo {
  interfaces: NetworkInterface[];
  connections: NetworkConnection[];
}

export interface NetworkInterface {
  name: string;
  address: string;
  netmask: string;
  broadcast: string;
  status: 'up' | 'down';
}

export interface NetworkConnection {
  protocol: string;
  localAddress: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
  state: string;
  pid?: number;
}
