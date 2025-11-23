# File Explorer App

## Overview

The File Explorer app provides a comprehensive file management system for navigating and manipulating a virtual file system within DurgasOS.

## Features

- **File System Navigation**: Browse through hierarchical folder structure
- **File Operations**: Create, rename, delete files and folders
- **Context Menu**: Right-click context menu for file and folder operations
- **File Associations**: Open files with associated applications (.txt → Notepad, .mp4 → Video Player)
- **Clipboard Operations**: Copy, cut, and paste files and folders
- **File Download**: Download files to local system
- **Breadcrumb Navigation**: Navigate up and down the directory tree
- **Loading States**: Visual feedback during file operations

## Technical Details

- **Component**: `src/components/apps/FileExplorer.tsx`
- **Default Size**: 800x600 pixels
- **Pinned**: Yes
- **Desktop**: Yes
- **File Association**: None

## Sub-Components

- **FileExplorerToolbar**: Navigation controls and breadcrumb display
- **FileExplorerList**: Main file/folder listing with tree view
- **FileExplorerLoading**: Loading overlay for file operations
- **FileExplorerItem**: Individual file/folder item component

## File Operations

- **Create**: New files and folders
- **Rename**: Change names of existing items
- **Delete**: Remove files and folders (with confirmation)
- **Copy/Cut/Paste**: Clipboard operations for moving/copying items
- **Download**: Save files to local system
- **Open**: Open files with associated applications

## Supported File Types

- **Text Files (.txt)**: Opens in Notepad app
- **Video Files (.mp4)**: Opens in Video Player app
- **Folders**: Navigate into directory

## UI Components

- **Toolbar**: Back button and current path display
- **File List**: Tree view with expandable folders
- **Context Menu**: Right-click menu with relevant actions
- **File Operation Dialog**: Modal for create/rename operations
- **Loading Overlay**: Visual feedback during operations

## State Management

- **Current Path**: Tracks current directory location
- **Expanded Folders**: Manages which folders are expanded
- **Dialog State**: Controls modal dialogs for file operations
- **Context Menu**: Manages right-click menu state

## Error Handling

- **Async Error Handling**: Proper error handling for file operations
- **User Feedback**: Error messages and confirmations
- **Graceful Degradation**: Fallback behavior for failed operations

## Integration

- **DesktopContext**: Integrates with app opening system
- **File System Hook**: Uses custom hook for file operations
- **Context Menu Hook**: Manages right-click functionality
- **Error Handler Hook**: Centralized error handling

## User Experience

- **Intuitive Navigation**: Familiar file explorer interface
- **Visual Feedback**: Loading states and hover effects
- **Keyboard Support**: Standard keyboard shortcuts
- **Responsive Design**: Adapts to different window sizes

## Future Enhancements

- **File Search**: Search functionality within the file system
- **File Preview**: Preview files without opening them
- **Drag & Drop**: Drag and drop file operations
- **File Properties**: Detailed file information display
- **Multiple Selection**: Select and operate on multiple files
- **File Compression**: Create and extract archives
