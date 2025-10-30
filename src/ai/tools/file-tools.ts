import ai from '@/ai/genkit';
import { z } from 'zod';
import { logger } from '@/lib/logger';

// File System Tools for DurgasOS

export const readFileTool = ai.defineTool(
  {
    name: 'readFile',
    inputSchema: z.object({
      path: z.string().describe('The path to the file to read'),
      encoding: z.enum(['utf8', 'base64', 'binary']).default('utf8').describe('File encoding'),
    }),
    description: 'Read the contents of a file',
  },
  async (input) => {
    logger.debug('Reading file', { component: 'file-tools', action: 'readFile', path: input.path, encoding: input.encoding });
    
    // Mock file reading
    const mockFiles = {
      '/home/user/readme.txt': 'Welcome to DurgasOS!\nThis is a sample file.',
      '/home/user/config.json': '{"theme": "dark", "language": "en"}',
      '/home/user/data.csv': 'Name,Age,City\nJohn,25,New York\nJane,30,London'
    };

    const content = mockFiles[input.path as keyof typeof mockFiles] || 'File not found or empty';
    
    return {
      success: true,
      path: input.path,
      content,
      encoding: input.encoding,
      size: content.length,
      message: `File ${input.path} read successfully`
    };
  }
);

export const writeFileTool = ai.defineTool(
  {
    name: 'writeFile',
    inputSchema: z.object({
      path: z.string().describe('The path where to write the file'),
      content: z.string().describe('The content to write to the file'),
      encoding: z.enum(['utf8', 'base64', 'binary']).default('utf8').describe('File encoding'),
    }),
    description: 'Write content to a file',
  },
  async (input) => {
    logger.debug('Writing file', { component: 'file-tools', action: 'writeFile', path: input.path, encoding: input.encoding, contentLength: input.content.length });
    
    return {
      success: true,
      path: input.path,
      content: input.content,
      encoding: input.encoding,
      size: input.content.length,
      message: `File ${input.path} written successfully`
    };
  }
);

export const listDirectoryTool = ai.defineTool(
  {
    name: 'listDirectory',
    inputSchema: z.object({
      path: z.string().default('.').describe('The directory path to list'),
      showHidden: z.boolean().default(false).describe('Whether to show hidden files'),
    }),
    description: 'List the contents of a directory',
  },
  async (input) => {
    logger.debug('Listing directory', { component: 'file-tools', action: 'listDirectory', path: input.path, showHidden: input.showHidden });
    
    // Mock directory listing
    const mockDirectories = {
      '.': [
        { name: 'Documents', type: 'directory', size: 0 },
        { name: 'Pictures', type: 'directory', size: 0 },
        { name: 'Downloads', type: 'directory', size: 0 },
        { name: 'readme.txt', type: 'file', size: 1024 },
        { name: 'config.json', type: 'file', size: 256 }
      ],
      '/home/user': [
        { name: 'Desktop', type: 'directory', size: 0 },
        { name: 'Documents', type: 'directory', size: 0 },
        { name: 'Pictures', type: 'directory', size: 0 },
        { name: 'profile.txt', type: 'file', size: 512 }
      ]
    };

    const items = mockDirectories[input.path as keyof typeof mockDirectories] || [];
    const filteredItems = input.showHidden 
      ? items 
      : items.filter(item => !item.name.startsWith('.'));

    return {
      success: true,
      path: input.path,
      items: filteredItems,
      count: filteredItems.length,
      message: `Directory ${input.path} listed successfully`
    };
  }
);

export const deleteFileTool = ai.defineTool(
  {
    name: 'deleteFile',
    inputSchema: z.object({
      path: z.string().describe('The path to the file or directory to delete'),
      recursive: z.boolean().default(false).describe('Whether to delete directories recursively'),
    }),
    description: 'Delete a file or directory',
  },
  async (input) => {
    logger.debug('Deleting file/directory', { component: 'file-tools', action: 'deleteFile', path: input.path, recursive: input.recursive });
    
    return {
      success: true,
      path: input.path,
      recursive: input.recursive,
      message: `${input.recursive ? 'Directory' : 'File'} ${input.path} deleted successfully`
    };
  }
);

export const moveFileTool = ai.defineTool(
  {
    name: 'moveFile',
    inputSchema: z.object({
      source: z.string().describe('The source path'),
      destination: z.string().describe('The destination path'),
    }),
    description: 'Move or rename a file or directory',
  },
  async (input) => {
    logger.debug('Moving file/directory', { component: 'file-tools', action: 'moveFile', source: input.source, destination: input.destination });
    
    return {
      success: true,
      source: input.source,
      destination: input.destination,
      message: `File moved from ${input.source} to ${input.destination} successfully`
    };
  }
);
