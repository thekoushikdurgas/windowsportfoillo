# Welcome App

## Overview

The Welcome app serves as the introductory screen for DurgasOS, providing users with a friendly greeting and quick access to key applications.

## Features

- **Welcome Message**: Displays a warm welcome message with the DurgasOS branding
- **Hero Image**: Shows a placeholder hero image to enhance the visual appeal
- **Quick Actions**: Provides buttons to quickly access Portfolio and About Me apps
- **User Guidance**: Includes helpful text to guide users on how to explore the desktop environment

## Technical Details

- **Component**: `src/components/apps/Welcome.tsx`
- **Default Size**: 600x450 pixels
- **Pinned**: No
- **Desktop**: No
- **File Association**: None

## UI Components

- Gradient background (blue to indigo in light mode, gray in dark mode)
- Centered layout with maximum width constraint
- Responsive design with proper spacing
- Fallback image component for hero image
- Primary and outline button variants

## User Experience

- Clean, modern design that matches Windows 11 aesthetics
- Clear call-to-action buttons for navigation
- Informative text explaining how to use the desktop environment
- Smooth transitions and hover effects

## Integration

- Integrates with DesktopContext for app opening functionality
- Uses placeholder images system for consistent imagery
- Follows the app configuration pattern defined in `apps.config.ts`

## Future Enhancements

- Could include system information or recent activity
- Might feature animated elements or interactive tutorials
- Potential integration with user onboarding flow
