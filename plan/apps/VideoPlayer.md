# Video Player App

## Overview

The Video Player app provides a lightweight media player for video files within DurgasOS, supporting MP4 format and basic playback controls.

## Features

- **Video Playback**: Plays MP4 video files with multiple quality options
- **File Association**: Automatically opens .mp4 files from File Explorer
- **Default Content**: Includes sample videos (Big Buck Bunny, Sintel, Tears of Steel) for demonstration
- **HTML5 Video**: Uses native HTML5 video element for playback
- **Responsive Design**: Adapts to different window sizes
- **Full Controls**: Comprehensive video player controls (play, pause, seek, volume, speed, quality)
- **Playlist Support**: Play multiple videos in sequence with navigation
- **Fullscreen Mode**: Dedicated fullscreen playback with controls
- **Keyboard Shortcuts**: Complete keyboard control (space, arrows, F, M, N, P)
- **Video Effects**: Brightness, contrast, and saturation controls
- **Repeat Modes**: None, one, or all video repeat options
- **Shuffle Mode**: Random video playback
- **Loading States**: Visual feedback during video loading
- **Error Handling**: Graceful error recovery with retry options
- **Auto-hide Controls**: Controls automatically hide during playback
- **Settings Panel**: Comprehensive settings for playback customization

## Technical Details

- **Component**: `src/components/apps/VideoPlayer.tsx`
- **Default Size**: 640x480 pixels
- **Pinned**: No
- **Desktop**: No
- **File Association**: .mp4 files

## Functionality

- **Video Loading**: Loads video files from URLs or file system
- **Playback Controls**: Standard HTML5 video controls
- **Responsive Playback**: Video scales to fit window size
- **Error Handling**: Graceful handling of unsupported formats

## UI Components

- **Video Element**: HTML5 video element with full controls
- **Black Background**: Clean black background for video display
- **Centered Layout**: Video centered within the player window
- **Responsive Container**: Adapts to window size changes

## Styling Features

- **Black Background**: Professional black background
- **Centered Video**: Video content centered in the player
- **Responsive Sizing**: Video scales to fit available space
- **Clean Interface**: Minimal, distraction-free design

## Integration

- **File Explorer**: Opens .mp4 files from File Explorer
- **Desktop Context**: Integrates with app opening system
- **URL Support**: Can load videos from URLs

## User Experience

- **Familiar Interface**: Standard video player experience
- **Smooth Playback**: Native HTML5 video performance
- **Intuitive Controls**: Standard video player controls
- **Responsive Design**: Adapts to different window sizes

## Future Features (Planned)

- **Multiple Formats**: Support for additional video formats (AVI, MOV, WebM)
- **Subtitle Support**: Display subtitles and captions (SRT, VTT)
- **Audio Controls**: Separate audio track management
- **Screenshot**: Capture screenshots from video
- **Video Analytics**: Playback statistics and watch time tracking
- **Advanced Effects**: More video filters and effects
- **Thumbnail Generation**: Generate video thumbnails
- **Cloud Integration**: Support for cloud video storage

## Technical Considerations

- **Format Support**: Expand support for more video formats
- **Performance**: Optimize for large video files
- **Memory Management**: Efficient video loading and playback
- **Cross-browser Compatibility**: Ensure consistent playback across browsers

## Future Enhancements

- **Streaming Support**: Support for streaming video URLs
- **Video Editing**: Basic video editing capabilities
- **Thumbnail Generation**: Generate video thumbnails
- **Metadata Display**: Show video metadata and information
- **Keyboard Shortcuts**: Keyboard shortcuts for playback control
- **Picture-in-Picture**: Support for picture-in-picture mode
- **VR Support**: Virtual reality video playback
- **Live Streaming**: Support for live video streams
