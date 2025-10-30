import { CommandRegistry, CommandExecutor, TerminalState, CommandResult, ParsedCommand } from '@/types/terminal';
import { fileSystemManager } from './filesystem';

const getCurrentPathString = (path: string[]): string => {
  if (path.length === 0) return '/';
  return `/${path.join('/')}`;
};

// File System Commands
const executeCd: CommandExecutor = async (args, state) => {
  let newPath = [...state.currentDirectory];
  
  if (args.length === 0) {
    newPath = ['Users', 'Durgas'];
  } else if (args[0] === '..') {
    newPath.pop();
  } else if (args[0] === '.') {
    // Stay in current directory
  } else if (args[0]) {
    if (args[0].startsWith('/')) {
      // Absolute path
      newPath = args[0].split('/').filter(Boolean);
    } else {
      // Relative path
      newPath.push(args[0]);
    }
  }
  
  // Validate path exists
  const item = fileSystemManager.getItemByPath(newPath);
  if (!item || item.type !== 'folder') {
    return {
      output: `cd: ${args[0] ?? '~'}: No such file or directory`,
      exitCode: 1,
      duration: 0
    };
  }
  
  return {
    output: '',
    exitCode: 0,
    duration: 0
  };
};

const executeLs: CommandExecutor = async (args, state) => {
  const showLong = args.includes('-l') || args.includes('--long');
  
  const nonOptionArg = args.find(arg => !arg.startsWith('-'));
  const targetPath = nonOptionArg ? 
    [...state.currentDirectory, nonOptionArg] : 
    state.currentDirectory;
  
  const item = fileSystemManager.getItemByPath(targetPath);
  if (!item) {
    return {
      output: `ls: cannot access '${args.find(arg => !arg.startsWith('-')) || '.'}': No such file or directory`,
      exitCode: 1,
      duration: 0
    };
  }
  
  if (item.type === 'file') {
    return {
      output: item.name,
      exitCode: 0,
      duration: 0
    };
  }
  
  const children = item.children || [];
  let output = '';
  
  if (showLong) {
    children.forEach(child => {
      const type = child.type === 'folder' ? 'd' : '-';
      const permissions = child.permissions ? 
        `${child.permissions.read ? 'r' : '-'}${child.permissions.write ? 'w' : '-'}${child.permissions.execute ? 'x' : '-'}` : 
        'rw-';
      const size = child.size || 0;
      const modified = child.modified ? child.modified.toLocaleDateString() : 'Unknown';
      output += `${type}${permissions} ${size.toString().padStart(8)} ${modified} ${child.name}\n`;
    });
  } else {
    const names = children.map(child => child.name);
    output = names.join('  ');
  }
  
  return {
    output: output.trim(),
    exitCode: 0,
    duration: 0
  };
};

const executePwd: CommandExecutor = async (_, state) => {
  return {
    output: getCurrentPathString(state.currentDirectory),
    exitCode: 0,
    duration: 0
  };
};

const executeMkdir: CommandExecutor = async (args, state) => {
  if (args.length === 0) {
    return {
      output: 'mkdir: missing operand',
      exitCode: 1,
      duration: 0
    };
  }
  
  if (!args[0]) {
    return {
      output: 'mkdir: missing operand',
      exitCode: 1,
      duration: 0
    };
  }
  const result = fileSystemManager.createItem('folder', args[0], state.currentDirectory);
  
  if (result.success) {
    return {
      output: '',
      exitCode: 0,
      duration: 0
    };
  } else {
    return {
      output: `mkdir: cannot create directory '${args[0] ?? ''}': ${result.error}`,
      exitCode: 1,
      duration: 0
    };
  }
};

const executeRmdir: CommandExecutor = async (args, state) => {
  if (args.length === 0) {
    return {
      output: 'rmdir: missing operand',
      exitCode: 1,
      duration: 0
    };
  }
  
  if (!args[0]) {
    return {
      output: 'rmdir: missing operand',
      exitCode: 1,
      duration: 0
    };
  }
  const targetPath = [...state.currentDirectory, args[0]];
  const item = fileSystemManager.getItemByPath(targetPath);
  
  if (!item) {
    return {
      output: `rmdir: failed to remove '${args[0]}': No such file or directory`,
      exitCode: 1,
      duration: 0
    };
  }
  
  if (item.type !== 'folder') {
    return {
      output: `rmdir: failed to remove '${args[0]}': Not a directory`,
      exitCode: 1,
      duration: 0
    };
  }
  
  if (item.children && item.children.length > 0) {
    return {
      output: `rmdir: failed to remove '${args[0]}': Directory not empty`,
      exitCode: 1,
      duration: 0
    };
  }
  
  const result = fileSystemManager.deleteItem(targetPath);
  
  if (result.success) {
    return {
      output: '',
      exitCode: 0,
      duration: 0
    };
  } else {
    return {
      output: `rmdir: failed to remove '${args[0]}': ${result.error}`,
      exitCode: 1,
      duration: 0
    };
  }
};

const executeTouch: CommandExecutor = async (args, state) => {
  if (args.length === 0 || !args[0]) {
    return {
      output: 'touch: missing file operand',
      exitCode: 1,
      duration: 0
    };
  }
  
  const result = fileSystemManager.createItem('file', args[0], state.currentDirectory);
  
  if (result.success) {
    return {
      output: '',
      exitCode: 0,
      duration: 0
    };
  } else {
    return {
      output: `touch: cannot touch '${args[0]}': ${result.error}`,
      exitCode: 1,
      duration: 0
    };
  }
};

const executeRm: CommandExecutor = async (args, state) => {
  if (args.length === 0) {
    return {
      output: 'rm: missing operand',
      exitCode: 1,
      duration: 0
    };
  }
  
  const targetPath = [...state.currentDirectory, args[0]].filter((s): s is string => s !== undefined);
  const result = fileSystemManager.deleteItem(targetPath);
  
  if (result.success) {
    return {
      output: '',
      exitCode: 0,
      duration: 0
    };
  } else {
    return {
      output: `rm: cannot remove '${args[0]}': ${result.error}`,
      exitCode: 1,
      duration: 0
    };
  }
};

const executeCp: CommandExecutor = async (args, state) => {
  if (args.length < 2) {
    return {
      output: 'cp: missing file operand',
      exitCode: 1,
      duration: 0
    };
  }
  
  const sourcePath = [...state.currentDirectory, args[0]].filter((s): s is string => s !== undefined);
  const destPath = [...state.currentDirectory, args[1]].filter((s): s is string => s !== undefined);
  
  const result = fileSystemManager.copyItem(sourcePath, destPath);
  
  if (result.success) {
    return {
      output: '',
      exitCode: 0,
      duration: 0
    };
  } else {
    return {
      output: `cp: cannot copy '${args[0]}': ${result.error}`,
      exitCode: 1,
      duration: 0
    };
  }
};

const executeMv: CommandExecutor = async (args, state) => {
  if (args.length < 2) {
    return {
      output: 'mv: missing file operand',
      exitCode: 1,
      duration: 0
    };
  }
  
  const sourcePath = [...state.currentDirectory, args[0]].filter((s): s is string => s !== undefined);
  const destPath = [...state.currentDirectory, args[1]].filter((s): s is string => s !== undefined);
  
  const result = fileSystemManager.moveItem(sourcePath, destPath);
  
  if (result.success) {
    return {
      output: '',
      exitCode: 0,
      duration: 0
    };
  } else {
    return {
      output: `mv: cannot move '${args[0]}': ${result.error}`,
      exitCode: 1,
      duration: 0
    };
  }
};

// Text Processing Commands
const executeCat: CommandExecutor = async (args, state) => {
  if (args.length === 0) {
    return {
      output: 'cat: missing file operand',
      exitCode: 1,
      duration: 0
    };
  }
  
  if (!args[0]) {
    return {
      output: 'cat: missing file operand',
      exitCode: 1,
      duration: 0
    };
  }
  const targetPath = [...state.currentDirectory, args[0]];
  const item = fileSystemManager.getItemByPath(targetPath);
  
  if (!item) {
    return {
      output: `cat: ${args[0]}: No such file or directory`,
      exitCode: 1,
      duration: 0
    };
  }
  
  if (item.type !== 'file') {
    return {
      output: `cat: ${args[0]}: Is a directory`,
      exitCode: 1,
      duration: 0
    };
  }
  
  return {
    output: item.content || '',
    exitCode: 0,
    duration: 0
  };
};

const executeEcho: CommandExecutor = async (args) => {
  return {
    output: args.join(' '),
    exitCode: 0,
    duration: 0
  };
};

const executeGrep: CommandExecutor = async (args, state) => {
  if (args.length < 1) {
    return {
      output: 'grep: missing pattern',
      exitCode: 1,
      duration: 0
    };
  }
  
  const pattern = args[0];
  const files = args.slice(1);
  
  if (files.length === 0) {
    return {
      output: 'grep: missing file operand',
      exitCode: 1,
      duration: 0
    };
  }
  
  // Ensure pattern is a string
  if (!pattern || typeof pattern !== 'string') {
    return {
      output: 'grep: invalid pattern',
      exitCode: 1,
      duration: 0
    };
  }
  
  let output = '';
  
  for (const file of files) {
    if (typeof file !== 'string') continue;
    const targetPath = [...state.currentDirectory, file];
    const item = fileSystemManager.getItemByPath(targetPath);
    
    if (!item || item.type !== 'file') {
      output += `grep: ${file}: No such file or directory\n`;
      continue;
    }
    
    const content = item.content || '';
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes(pattern)) {
        output += `${file}:${index + 1}:${line}\n`;
      }
    });
  }
  
  return {
    output: output.trim(),
    exitCode: 0,
    duration: 0
  };
};

const executeWc: CommandExecutor = async (args, state) => {
  if (args.length === 0) {
    return {
      output: 'wc: missing file operand',
      exitCode: 1,
      duration: 0
    };
  }
  
  if (!args[0]) {
    return {
      output: 'wc: missing file operand',
      exitCode: 1,
      duration: 0
    };
  }
  const targetPath = [...state.currentDirectory, args[0]];
  const item = fileSystemManager.getItemByPath(targetPath);
  
  if (!item || item.type !== 'file') {
    return {
      output: `wc: ${args[0]}: No such file or directory`,
      exitCode: 1,
      duration: 0
    };
  }
  
  const content = item.content || '';
  const lines = content.split('\n').length;
  const words = content.split(/\s+/).filter(Boolean).length;
  const chars = content.length;
  
  return {
    output: `${lines} ${words} ${chars} ${args[0]}`,
    exitCode: 0,
    duration: 0
  };
};

// System Commands
const executePs: CommandExecutor = async (args, state) => {
  const processes = state.jobs.map(job => ({
    pid: job.pid || 0,
    command: job.command,
    status: job.status,
    startTime: job.startTime
  }));
  
  let output = 'PID\tCOMMAND\t\tSTATUS\t\tSTARTED\n';
  processes.forEach(proc => {
    output += `${proc.pid}\t${proc.command}\t\t${proc.status}\t\t${proc.startTime.toLocaleTimeString()}\n`;
  });
  
  return {
    output: output.trim(),
    exitCode: 0,
    duration: 0
  };
};

const executeUptime: CommandExecutor = async () => {
  const uptime = Date.now() - (Date.now() - 1000 * 60 * 60); // Mock uptime
  const hours = Math.floor(uptime / (1000 * 60 * 60));
  const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    output: `up ${hours}h ${minutes}m`,
    exitCode: 0,
    duration: 0
  };
};

const executeWhoami: CommandExecutor = async () => {
  return {
    output: 'durgas',
    exitCode: 0,
    duration: 0
  };
};

// Environment Commands
const executeEnv: CommandExecutor = async (args, state) => {
  let output = '';
  Object.entries(state.environment).forEach(([key, value]) => {
    output += `${key}=${value}\n`;
  });
  
  return {
    output: output.trim(),
    exitCode: 0,
    duration: 0
  };
};

const executeExport: CommandExecutor = async (args) => {
  if (args.length === 0) {
    return {
      output: 'export: missing variable name',
      exitCode: 1,
      duration: 0
    };
  }
  
  if (!args[0]) {
    return {
      output: 'export: invalid variable format',
      exitCode: 1,
      duration: 0
    };
  }
  const [key, value] = args[0].split('=');
  if (!key || !value) {
    return {
      output: 'export: invalid variable format',
      exitCode: 1,
      duration: 0
    };
  }
  
  // In a real implementation, this would update the environment
  return {
    output: '',
    exitCode: 0,
    duration: 0
  };
};

const executeAlias: CommandExecutor = async (args, state) => {
  if (args.length === 0) {
    let output = '';
    Object.entries(state.aliases).forEach(([key, value]) => {
      output += `alias ${key}='${value}'\n`;
    });
    return {
      output: output.trim(),
      exitCode: 0,
      duration: 0
    };
  }
  
  if (!args[0]) {
    return {
      output: 'alias: invalid format',
      exitCode: 1,
      duration: 0
    };
  }
  const [key, value] = args[0].split('=');
  if (!key || !value) {
    return {
      output: 'alias: invalid format',
      exitCode: 1,
      duration: 0
    };
  }
  
  // In a real implementation, this would update the aliases
  return {
    output: '',
    exitCode: 0,
    duration: 0
  };
};

// Utility Commands
const executeClear: CommandExecutor = async () => {
  return {
    output: '\x1b[2J\x1b[H', // ANSI escape sequence to clear screen
    exitCode: 0,
    duration: 0
  };
};

const executeHelp: CommandExecutor = async () => {
  const commands = Object.entries(commandRegistry);
  let output = 'Available commands:\n\n';
  
  const categories = {
    filesystem: 'File System Commands',
    text: 'Text Processing Commands',
    system: 'System Commands',
    environment: 'Environment Commands',
    utility: 'Utility Commands'
  };
  
  Object.entries(categories).forEach(([category, title]) => {
    const categoryCommands = commands.filter(([, cmd]) => cmd.category === category);
    if (categoryCommands.length > 0) {
      output += `${title}:\n`;
      categoryCommands.forEach(([name, cmd]) => {
        output += `  ${name.padEnd(12)} - ${cmd.description}\n`;
      });
      output += '\n';
    }
  });
  
  return {
    output: output.trim(),
    exitCode: 0,
    duration: 0
  };
};

// Command Registry
export const commandRegistry: CommandRegistry = {
  // File System Commands
  cd: {
    executor: executeCd,
    description: 'Change directory',
    usage: 'cd [directory]',
    category: 'filesystem'
  },
  ls: {
    executor: executeLs,
    description: 'List directory contents',
    usage: 'ls [options] [directory]',
    category: 'filesystem'
  },
  pwd: {
    executor: executePwd,
    description: 'Print working directory',
    usage: 'pwd',
    category: 'filesystem'
  },
  mkdir: {
    executor: executeMkdir,
    description: 'Create directory',
    usage: 'mkdir [directory]',
    category: 'filesystem'
  },
  rmdir: {
    executor: executeRmdir,
    description: 'Remove directory',
    usage: 'rmdir [directory]',
    category: 'filesystem'
  },
  touch: {
    executor: executeTouch,
    description: 'Create file',
    usage: 'touch [file]',
    category: 'filesystem'
  },
  rm: {
    executor: executeRm,
    description: 'Remove file',
    usage: 'rm [file]',
    category: 'filesystem'
  },
  cp: {
    executor: executeCp,
    description: 'Copy file',
    usage: 'cp [source] [destination]',
    category: 'filesystem'
  },
  mv: {
    executor: executeMv,
    description: 'Move/rename file',
    usage: 'mv [source] [destination]',
    category: 'filesystem'
  },
  
  // Text Processing Commands
  cat: {
    executor: executeCat,
    description: 'Display file contents',
    usage: 'cat [file]',
    category: 'text'
  },
  echo: {
    executor: executeEcho,
    description: 'Print text',
    usage: 'echo [text]',
    category: 'text'
  },
  grep: {
    executor: executeGrep,
    description: 'Search text in files',
    usage: 'grep [pattern] [file]',
    category: 'text'
  },
  wc: {
    executor: executeWc,
    description: 'Count words, lines, characters',
    usage: 'wc [file]',
    category: 'text'
  },
  
  // System Commands
  ps: {
    executor: executePs,
    description: 'List processes',
    usage: 'ps',
    category: 'system'
  },
  uptime: {
    executor: executeUptime,
    description: 'Show system uptime',
    usage: 'uptime',
    category: 'system'
  },
  whoami: {
    executor: executeWhoami,
    description: 'Show current user',
    usage: 'whoami',
    category: 'system'
  },
  
  // Environment Commands
  env: {
    executor: executeEnv,
    description: 'Show environment variables',
    usage: 'env',
    category: 'environment'
  },
  export: {
    executor: executeExport,
    description: 'Set environment variable',
    usage: 'export [variable=value]',
    category: 'environment'
  },
  alias: {
    executor: executeAlias,
    description: 'Show or set command aliases',
    usage: 'alias [name=value]',
    category: 'environment'
  },
  
  // Utility Commands
  clear: {
    executor: executeClear,
    description: 'Clear terminal screen',
    usage: 'clear',
    category: 'utility'
  },
  help: {
    executor: executeHelp,
    description: 'Show help information',
    usage: 'help',
    category: 'utility'
  }
};

// Command Parser
export const parseCommand = (input: string): ParsedCommand => {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);
  const command = parts[0] || '';
  const args = parts.slice(1);
  
  return {
    command,
    args,
    original: trimmed
  };
};

// Command Executor
export const executeCommand = async (
  parsedCommand: ParsedCommand, 
  state: TerminalState
): Promise<CommandResult> => {
  const { command, args } = parsedCommand;
  const startTime = Date.now();
  
  try {
    // Check for aliases first
    const actualCommand = state.aliases[command] || command;
    const commandInfo = commandRegistry[actualCommand];
    
    if (!commandInfo) {
      return {
        output: `Command not found: ${command}`,
        exitCode: 1,
        duration: Date.now() - startTime
      };
    }
    
    const result = await commandInfo.executor(args, state);
    return {
      ...result,
      duration: Date.now() - startTime
    };
  } catch (error) {
    return {
      output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      exitCode: 1,
      duration: Date.now() - startTime
    };
  }
};
