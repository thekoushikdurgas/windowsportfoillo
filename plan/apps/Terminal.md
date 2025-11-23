# Terminal App

## Overview

The Terminal app provides a comprehensive command-line interface for power users to interact with the DurgasOS system using familiar shell commands. This enhanced version includes extensive file system operations, text processing, system monitoring, and environment management capabilities.

## Features

- **Command Execution**: Execute 20+ shell commands with full argument support
- **Command History**: Maintains detailed history with timestamps, exit codes, and duration
- **Interactive Interface**: Real-time command input and output with syntax highlighting
- **Help System**: Comprehensive help command with categorized command listings
- **Terminal Styling**: Classic terminal appearance with green text on black background
- **Auto-scroll**: Automatically scrolls to show latest output
- **Command Navigation**: Arrow key navigation through command history
- **Tab Completion**: Basic tab completion for commands
- **Status Bar**: Real-time status information and system details
- **Export Functionality**: Export command history to text files
- **Error Handling**: Comprehensive error handling with detailed error messages

## Technical Details

- **Component**: `src/components/apps/Terminal.tsx`
- **Hook**: `src/hooks/use-terminal.tsx`
- **Commands**: `src/lib/terminal-commands.ts`
- **Types**: `src/types/terminal.ts`
- **Default Size**: 640x384 pixels
- **Pinned**: Yes
- **Desktop**: Yes
- **File Association**: None

## Supported Commands

### File System Commands

- **cd [directory]**: Change directory (supports relative and absolute paths)
- **ls [options] [directory]**: List directory contents (supports -a, -l, -h flags)
- **pwd**: Print current working directory
- **mkdir [directory]**: Create new directory
- **rmdir [directory]**: Remove empty directory
- **touch [file]**: Create new file
- **rm [file]**: Remove file
- **cp [source] [destination]**: Copy file
- **mv [source] [destination]**: Move/rename file

### Text Processing Commands

- **cat [file]**: Display file contents
- **echo [text]**: Print text to terminal
- **grep [pattern] [file]**: Search text in files
- **wc [file]**: Count words, lines, and characters

### System Commands

- **ps**: List running processes
- **uptime**: Show system uptime
- **whoami**: Display current user

### Environment Commands

- **env**: Show environment variables
- **export [variable=value]**: Set environment variable
- **alias [name=value]**: Show or set command aliases

### Utility Commands

- **clear**: Clear terminal screen
- **help**: Show comprehensive help information

## UI Components

- **Terminal Output**: Scrollable area displaying command history and output
- **Command Input**: Input field with terminal prompt ($)
- **Auto-focus**: Input field automatically receives focus
- **Scroll Management**: Automatically scrolls to show latest content

## Styling Features

- **Classic Terminal Look**: Black background with green text
- **Monospace Font**: Uses monospace font for terminal appearance
- **Green Accent**: Green text color for authentic terminal feel
- **Minimal Interface**: Clean, distraction-free terminal interface

## Functionality

- **Command Processing**: Parses and executes user commands
- **Output Display**: Shows command results in the terminal
- **Error Handling**: Displays appropriate error messages
- **History Management**: Maintains command history throughout session

## User Experience

- **Familiar Interface**: Standard terminal-like experience
- **Keyboard Navigation**: Full keyboard support for command input
- **Visual Feedback**: Clear command prompt and output formatting
- **Responsive Design**: Adapts to window size changes

## Future Features (Planned)

- **File System Commands**: cd, mkdir, rmdir, touch, rm commands
- **Text Processing**: cat, grep, sed, awk commands
- **System Information**: ps, top, df, free commands
- **Network Commands**: ping, curl, wget commands
- **Process Management**: kill, jobs, bg, fg commands
- **Environment Variables**: export, env, set commands
- **Command Aliases**: alias and unalias commands
- **Scripting Support**: Basic shell scripting capabilities

## Technical Considerations

- **Command Parsing**: Robust command parsing and argument handling
- **File System Integration**: Connect to virtual file system
- **Security**: Secure command execution and input validation
- **Performance**: Efficient command execution and output handling

## Future Enhancements

- **Tab Completion**: Auto-complete file and command names
- **Command History**: Persistent command history across sessions
- **Multiple Tabs**: Support for multiple terminal sessions
- **Custom Themes**: Different terminal color schemes
- **Copy/Paste**: Text selection and clipboard integration
- **Search**: Search through command history
- **Profiles**: Different terminal profiles for different use cases
- **Plugins**: Extensible command system with custom commands
