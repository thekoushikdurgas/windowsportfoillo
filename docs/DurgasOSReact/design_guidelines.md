# DurgasOS Design Guidelines

## Design Approach

**Reference-Based: Windows 11 Fluent Design System**

This project requires pixel-perfect recreation of the Windows 11 desktop environment. All design decisions reference authentic Windows 11 patterns, maintaining visual fidelity to Microsoft's Fluent Design System while ensuring full functionality.

## Typography System

**Font Stack**: Segoe UI Variable, system-ui, -apple-system, sans-serif

**Hierarchy**:
- Application Titles: 12px, weight 600, tracking -0.01em
- Menu Items: 11px, weight 400
- System UI Text: 11px, weight 400
- Button Text: 12px, weight 500
- Start Menu App Names: 11px, weight 500
- Window Content Headings: 20px, weight 600
- Window Content Body: 14px, weight 400
- Clock/System Tray: 11px, weight 500

## Layout & Spacing System

**Tailwind Spacing Units**: 1, 2, 3, 4, 6, 8, 12, 16

**Desktop Environment Structure**:
- Taskbar Height: 48px (fixed bottom)
- Taskbar Padding: px-2
- Start Menu Width: 600px, Height: 660px
- Start Menu Padding: p-6 for outer, p-4 for sections
- Window Title Bar: h-8
- Window Minimum Size: 400×300px
- Desktop Icon Grid: gap-8, p-4
- System Tray Items: gap-2

**Window Management**:
- Window Border Radius: rounded-lg (8px)
- Window Shadow: Large elevation shadow with blur
- Window Padding: p-0 (apps handle their own padding)
- Window Control Buttons: 46×32px each
- Resize Handle Hit Area: 8px on all edges

## Core Components

### 1. Boot Sequence
- Full-screen black background (#000000)
- Centered Windows logo (120px)
- Spinning loading indicator below logo (gap-8)
- Smooth fade transition to desktop (800ms)
- "DurgasOS" text below spinner: 16px, weight 300

### 2. Desktop Environment
- Full viewport background (#1F1F1F)
- Custom wallpaper layer (if used)
- Desktop icons grid: 4 columns on desktop, single column positioning
- Icons: 48×48px with 64×80px clickable area
- Icon labels: centered, 11px, 2-line max with ellipsis
- Double-click to open (300ms threshold)

### 3. Taskbar
- Fixed bottom position, full width
- Height: 48px
- Background: rgba(32, 32, 32, 0.85) with backdrop-blur-xl
- Centered content container with max-width
- Three sections: Start + Pinned Apps (left-aligned center), System Tray (right)
- Start button: 48×48px, rounded-lg hover state
- App icons: 40×40px, p-1.5, active indicator (3px bottom border #0078D4)
- Divider between sections: 1px line with opacity-20

### 4. Start Menu
- Positioned above taskbar, centered or left-aligned to Start button
- Rounded-xl (12px), backdrop-blur-2xl
- Background: rgba(32, 32, 32, 0.95)
- Search bar at top: full width minus p-6, h-10, rounded-lg
- "Pinned Apps" section: 6-column grid, gap-3
- App tiles: 80×80px, rounded-lg, flex-col, icon 32px, label 11px
- "Recommended" section below: 1-column list with recent items
- User profile section at bottom: p-4, avatar + name + power button

### 5. Window System
**Title Bar**:
- Height: 32px
- Background: rgba(32, 32, 32, 0.9) with blur
- App icon: 16×16px, ml-3
- Title text: ml-2, truncate
- Window controls: absolute right, flex gap-0
- Control buttons: hover bg-white/10, close hover bg-red-600

**Window Body**:
- Background: #202020 or app-specific
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Shadow: xl with subtle glow
- Drag: Title bar only
- Resize: All edges and corners with 8px hit area
- Z-index management: Active window receives highest z-index

**Window States**:
- Normal: User-defined size and position
- Maximized: Full viewport minus taskbar, no rounded corners
- Minimized: Removed from view, icon remains in taskbar

### 6. Built-in Applications

**About Me**:
- Hero section: Profile image (120px circle), name (24px), title (14px)
- Content cards: 2-column grid on desktop, gap-4
- Card style: p-6, rounded-lg, bg-white/5

**Portfolio**:
- Project grid: 2-3 columns, gap-6
- Project cards: Image thumbnail, title, description, tech stack badges
- Filter tabs at top: p-2, rounded-lg active states

**Browser**:
- Address bar: Top section, h-12, rounded-lg, search functionality
- Navigation buttons: Back/Forward/Refresh, 32×32px
- Content area: iframe or rendered content
- Tabs: Horizontal scroll, 200px max width each

**App Store**:
- Featured apps carousel at top
- Category grid: 3-4 columns
- App tiles: Icon 64px, name, description, install button
- Search bar: Top right corner

**File Explorer**:
- Left sidebar: 200px, folder tree navigation
- Main area: Grid or list view toggle
- Top bar: Breadcrumb navigation, view controls
- File/folder items: 40px height in list, 120px in grid

**Settings**:
- Left sidebar navigation: 220px fixed
- Main content area: p-8
- Setting groups: mb-8, heading + controls
- Toggle switches, dropdowns, and sliders

### 7. System Tray
- Clock: 11px, format "h:mm A"
- Network icon: 16×16px
- Volume icon: 16×16px with level indicator
- User avatar: 24×24px circle
- Notification badge: Absolute positioned red dot

### 8. Context Menus
- Background: rgba(42, 42, 42, 0.98), backdrop-blur-xl
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Rounded-lg, shadow-xl
- Menu items: h-8, px-3, text-11px
- Hover: bg-white/10
- Dividers: border-t border-white/10
- Icons: 16×16px, mr-2

## Interaction Patterns

**Animations**:
- Window open/close: Scale from 0.95 to 1, opacity 0 to 1, 200ms
- Window minimize: Scale to taskbar icon position, 300ms
- Start menu: Slide up + fade in, 150ms
- Hover states: bg transition 100ms
- Drag: Real-time position updates, no lag
- Resize: Live preview, cursor changes

**Click Behaviors**:
- Single click: Select/focus
- Double-click: Open (desktop icons)
- Right-click: Context menu
- Taskbar click: Toggle minimize/restore
- Window focus: Brings to front, updates z-index

**Keyboard Shortcuts** (if implemented):
- Windows key: Toggle Start menu
- Alt+F4: Close active window
- Windows+D: Show desktop

## Glass Morphism Effects

Apply to: Taskbar, Start Menu, Window Title Bars, Context Menus
- Background: rgba with 0.85-0.95 opacity
- backdrop-filter: blur(40px) saturate(150%)
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Subtle inner glow using box-shadow

## Accessibility

- All interactive elements: Minimum 32×32px touch target
- Keyboard navigation: Tab order, Enter/Space activation
- Focus indicators: 2px outline with offset
- ARIA labels on all icon buttons
- Window titles announced for screen readers
- High contrast mode considerations (optional enhancement)

## Performance Considerations

- Window dragging: Use transform instead of position for 60fps
- Limit concurrent open windows (suggest max 10)
- Lazy load application content
- Debounce resize calculations
- Use CSS transforms for animations
- Minimize re-renders during drag/resize operations