# Notepad App

## Overview

The Notepad app provides a simple, clean text editing interface for creating and editing text files within DurgasOS.

## Features

- **Text Editing**: Simple textarea for text input and editing
- **File Association**: Automatically opens .txt files from File Explorer
- **Content Persistence**: Maintains text content during editing session
- **Clean Interface**: Minimal, distraction-free design
- **Theme Support**: Follows system light/dark theme
- **Monospace Font**: Uses monospace font for better text editing experience

## Technical Details

- **Component**: `src/components/apps/Notepad.tsx`
- **Default Size**: 500x400 pixels
- **Pinned**: No
- **Desktop**: No
- **File Association**: .txt files

## Functionality

- **Text Input**: Full-featured textarea for text editing
- **Content Loading**: Can load existing text content from files
- **Real-time Editing**: Text changes are reflected immediately
- **Placeholder Text**: Shows "Start typing..." when empty

## UI Components

- **Textarea**: Full-width, full-height text input area
- **Minimal Interface**: No toolbar or menu bar for simplicity
- **Responsive Design**: Adapts to window size changes

## Styling Features

- **Monospace Font**: Uses system monospace font for text editing
- **Theme Support**: White background in light mode, dark gray in dark mode
- **Borderless Design**: Clean, borderless textarea
- **Resize Prevention**: Textarea doesn't resize with window

## Integration

- **File Explorer**: Opens .txt files from File Explorer
- **Desktop Context**: Integrates with app opening system
- **Theme System**: Follows DurgasOS theme preferences

## User Experience

- **Simple Interface**: Clean, minimal design focused on text editing
- **Familiar Feel**: Standard notepad-like experience
- **Keyboard Support**: Full keyboard navigation and editing
- **No Distractions**: Minimal UI elements for focused writing

## Future Features (Planned)

- **File Operations**: Save, open, and create new files
- **Text Formatting**: Basic formatting options (bold, italic, underline)
- **Find & Replace**: Search and replace functionality
- **Word Count**: Character and word count display
- **Undo/Redo**: Text editing history
- **Print Support**: Print text content
- **Font Settings**: Font family and size options
- **Line Numbers**: Optional line number display

## Technical Considerations

- **File System Integration**: Connect to virtual file system
- **Content Persistence**: Save changes to files
- **Performance**: Handle large text files efficiently
- **Memory Management**: Optimize for long editing sessions

## Future Enhancements

- **Syntax Highlighting**: Support for different programming languages
- **Auto-save**: Automatic saving of changes
- **Multiple Tabs**: Support for multiple open files
- **Export Options**: Export to different formats (PDF, HTML, etc.)
- **Collaboration**: Real-time collaborative editing
- **Plugins**: Extensible plugin system for additional features
- **Templates**: Pre-defined text templates
- **Spell Check**: Built-in spell checking functionality
