<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Create a Next.js codebase that effectively replicates the Windows 11 operating system, from the loading page to the home page. The home screen should display various apps, such as an 'About Me' section. Additionally, ensure that all apps open in a resizable box that includes options to minimize, crop, and close the window, along with a "Learn" button. Take the time to understand and analyze this concept deeply. Break the project down into smaller tasks

Now let me create a comprehensive project breakdown based on my research. I'll structure this as a detailed development plan.

# Windows 11 OS Replica in Next.js: Complete Development Guide

Based on my research into Windows 11 design patterns, modern UI frameworks, and the user's preferences for detailed Windows 11-style interfaces, I'll provide a comprehensive breakdown of creating a Windows 11 operating system replica using Next.js.

## Project Overview

This project will create a fully functional Windows 11 desktop experience in the browser, featuring authentic design elements including acrylic blur effects, mica materials, rounded corners, centered taskbar, resizable windows, and a complete app ecosystem. The system will utilize modern web technologies to replicate Windows 11's visual language and interaction patterns.[^1][^2][^3]

## Technology Stack

**Core Framework**: Next.js 14+ with TypeScript
**Styling**: Tailwind CSS with custom Windows 11 design system
**UI Components**: Custom components implementing Fluent Design System
**Window Management**: React-RND library for draggable/resizable windows[^4][^5][^6]
**State Management**: Zustand for global state management
**Animations**: Framer Motion for smooth transitions
**Effects**: CSS backdrop-filter for acrylic/mica effects[^7][^8][^9]

## Project Architecture Breakdown

### Phase 1: Foundation \& Core Systems (Week 1-2)

#### 1.1 Project Setup and Structure

```
windows11-os/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── os/
│   │   │   ├── desktop/
│   │   │   ├── taskbar/
│   │   │   ├── start-menu/
│   │   │   ├── window-manager/
│   │   │   └── loading/
│   │   ├── ui/
│   │   │   ├── windows/
│   │   │   ├── buttons/
│   │   │   └── effects/
│   │   └── apps/
│   ├── hooks/
│   ├── stores/
│   ├── types/
│   ├── utils/
│   └── styles/
├── public/
│   ├── wallpapers/
│   ├── icons/
│   └── sounds/
```


#### 1.2 Windows 11 Design System Implementation

Create a comprehensive design system matching Windows 11's visual specifications:

- **Color System**: Implement Windows 11 accent colors, light/dark themes[^2]
- **Typography**: Segoe UI font family with proper weights and sizes
- **Spacing**: 4px grid system for consistent spacing
- **Border Radius**: Implement Windows 11's signature rounded corners (4px, 8px)
- **Shadows**: Elevation system with proper drop shadows
- **Effects**: Acrylic blur (backdrop-filter: blur(30px)) and Mica material effects[^10][^11][^12]


#### 1.3 Global State Management

Set up Zustand stores for:

- Desktop state (wallpaper, theme, layout)
- Window management (open windows, z-index, positions)
- App registry (installed apps, running apps)
- User preferences (personalization settings)


### Phase 2: Loading Screen \& Boot Animation (Week 2)

#### 2.1 Windows 11 Boot Sequence

Implement authentic Windows 11 loading experience:[^13][^14]

**Boot Animation Component**:

- Dark background with subtle gradient
- Progressive ring animation (configurable via registry-style settings)
- Windows logo with fade-in effect
- Smooth transition to login screen

**Loading States**:

- BIOS-style initial black screen (0.5s)
- Windows logo appearance with ring animation (2-3s)
- Fade to login screen (0.5s)

**Code Structure**:

```typescript
// components/os/loading/BootScreen.tsx
interface BootScreenProps {
  onComplete: () => void;
  animationType: 'dots' | 'ring';
}

// Implement progressive ring animation
// Match Windows 11 timing and easing curves
// Include authentic Windows logo and branding
```


#### 2.2 Login Screen Implementation

Replicate Windows 11 login screen with:[^15][^16]

- Acrylic blur background effect
- User profile selection
- Windows Spotlight wallpapers
- Time/date display
- Network/power indicators
- Smooth transition animations


### Phase 3: Desktop Environment (Week 3-4)

#### 3.1 Desktop Canvas

**Core Desktop Features**:

- Dynamic wallpaper system (Windows Spotlight integration)
- Right-click context menu with Windows 11 styling[^17]
- Icon arrangement and snap-to-grid
- Multiple desktop support (Virtual Desktops)
- File/folder drag and drop functionality[^18]

**Desktop Context Menu**:

- View options (Small, Medium, Large icons)
- Sort options (Name, Date, Type, Size)
- Refresh option
- Personalize (opens Settings app)
- Display settings shortcut


#### 3.2 Taskbar Implementation

Create the signature Windows 11 centered taskbar:[^1][^17]

**Taskbar Components**:

- Start button (centered, rounded)
- Task view button
- Widget panel button
- Pinned apps section
- Running apps with badges[^17]
- System tray (notifications, quick settings)
- Clock and calendar

**Taskbar Features**:

- Auto-hide functionality
- Alignment options (Center/Left)[^19]
- Jump lists on right-click
- Progress indicators for running apps
- Notification badges for active apps


#### 3.3 Start Menu Redesign

Implement Windows 11's refreshed Start menu:[^20][^21]

**Layout Structure**:

- Pinned apps grid (customizable columns)
- Recommended section with recent files/apps
- All apps view with category grouping[^21]
- Search integration at top
- User profile and power options
- Scrollable layout for better app discovery[^20]

**Modern Features**:

- Smart recommendations based on usage
- Category view for productivity apps
- Grid view with improved spacing
- Mobile app integration section
- Quick access to frequently used apps


### Phase 4: Window Management System (Week 4-5)

#### 4.1 Advanced Window Manager

Implement sophisticated window management using React-RND:[^5][^4]

**Window Features**:

- Draggable windows with title bar interaction
- Resizable with corner/edge handles
- Minimize, maximize, close controls
- Snap layouts and snap groups[^22]
- Multi-monitor support simulation
- Window animations and transitions

**Window Controls**:

- Custom "Learn" button in title bar
- Windows 11-style control buttons (minimize, maximize, close)
- Title bar with acrylic effect[^10]
- Window chrome with proper styling
- Context menu with window options


#### 4.2 Snap Layouts System

Replicate Windows 11's enhanced window snapping:[^22]

- Hover over maximize button shows snap layout options
- Predefined layouts for 2, 3, and 4 windows
- Snap groups that restore together
- Visual feedback during snap operations
- Keyboard shortcuts for snapping


### Phase 5: Application Ecosystem (Week 5-6)

#### 5.1 Core System Apps

**File Explorer**:

- Modern UI with updated toolbar[^3]
- Folder navigation with breadcrumbs
- File operations (copy, paste, delete, rename)
- Search functionality
- Multiple tabs support
- Context menus with icon-based actions[^17]

**Settings App**:

- Windows 11-style settings interface
- Personalization options (themes, colors, wallpapers)
- System settings simulation
- Search within settings
- Modern toggle switches and sliders

**About Me App**:

- Custom application showcasing personal information
- Portfolio/resume display
- Skills and experience sections
- Contact information
- Responsive layout within window constraints


#### 5.2 Additional Applications

**Calculator**:

- Windows 11 calculator replica
- Standard and scientific modes
- History functionality
- Responsive design

**Notepad**:

- Simple text editor with Windows 11 styling
- File operations (new, open, save)
- Find and replace functionality
- Word wrap options

**Microsoft Edge Simulation**:

- Browser-like interface
- Tab management
- Address bar with suggestions
- Basic navigation controls


### Phase 6: Advanced Features \& Polish (Week 6-7)

#### 6.1 Visual Effects System

Implement Windows 11's signature visual effects:[^23][^12][^10]

**Acrylic Effects**:

- Translucent backgrounds with blur
- Noise texture overlay
- Color tinting based on theme
- Performance optimization for different devices

**Mica Material**:

- Semi-transparent background effect
- Desktop wallpaper influence
- Dynamic theme adaptation
- Optimized for primary surfaces

**Fluent Animations**:

- Smooth transitions between states
- Parallax effects for depth
- Reveal effects on hover
- Contextual animations


#### 6.2 Personalization System

**Themes \& Customization**:

- Light and dark mode support
- Accent color selection
- Custom wallpaper upload
- Taskbar personalization options
- Start menu layout customization

**Windows Spotlight**:

- Dynamic wallpaper rotation
- Beautiful background images
- Lock screen integration
- Automatic updates


#### 6.3 Notification \& Quick Settings

**Notification Center**:

- Toast notifications with Windows 11 styling
- Notification grouping and management
- Do Not Disturb mode
- Notification history

**Quick Settings Panel**:

- Wi-Fi, Bluetooth toggles
- Volume and brightness controls
- Focus Assist settings
- Power options


### Phase 7: Responsive Design \& Optimization (Week 7-8)

#### 7.1 Multi-Device Support

**Responsive Breakpoints**:

- Desktop (1920x1080 and above)
- Laptop (1366x768 to 1920x1080)
- Tablet mode simulation
- Touch-friendly interactions

**Performance Optimization**:

- Lazy loading for apps and components
- Virtual scrolling for large lists
- Optimized animations with reduced motion support
- Memory management for multiple windows


#### 7.2 Accessibility Features

**WCAG Compliance**:

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Focus management
- ARIA labels and roles


### Phase 8: Testing \& Deployment (Week 8)

#### 8.1 Testing Strategy

**Unit Testing**:

- Component testing with Jest and React Testing Library
- Window management functionality
- State management logic

**Integration Testing**:

- Full user workflows
- App interactions
- Window snapping and management
- Theme switching

**Performance Testing**:

- Bundle size optimization
- Runtime performance monitoring
- Memory leak detection
- Animation performance


#### 8.2 Deployment Setup

**Build Optimization**:

- Next.js production build configuration
- Asset optimization and compression
- Service worker for offline functionality
- Progressive Web App features


## Technical Implementation Details

### Window Management with React-RND

```typescript
interface WindowProps {
  id: string;
  title: string;
  content: React.ReactNode;
  initialSize: { width: number; height: number };
  initialPosition: { x: number; y: number };
  resizable?: boolean;
  draggable?: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onLearn?: () => void; // Custom "Learn" button
}

// Implement with react-rnd for dragging/resizing
// Add Windows 11 styling with acrylic effects
// Include proper z-index management
// Handle window state persistence
```


### Acrylic Effect Implementation

```css
.acrylic-window {
  backdrop-filter: blur(30px) saturate(125%);
  -webkit-backdrop-filter: blur(30px) saturate(125%);
  background: rgba(243, 243, 243, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.mica-surface {
  backdrop-filter: blur(20px);
  background: color-mix(in srgb, canvas 70%, transparent);
  border-radius: 8px;
}
```


### Performance Considerations

**Optimization Strategies**:

- Use React.memo for expensive components
- Implement virtual scrolling for app lists
- Optimize backdrop-filter usage
- Use transform3d for smooth animations
- Implement proper cleanup for window components

**Memory Management**:

- Clean up event listeners on component unmount
- Optimize image loading and caching
- Implement proper state cleanup for closed apps
- Use weak references where appropriate


## Development Timeline

**Total Duration**: 8 weeks
**Team Size**: 1-2 developers
**Complexity Level**: Advanced

**Weekly Milestones**:

- Week 1-2: Foundation and architecture setup
- Week 3: Boot sequence and desktop environment
- Week 4: Taskbar and Start menu implementation
- Week 5: Window management system
- Week 6: Core applications development
- Week 7: Visual effects and personalization
- Week 8: Testing, optimization, and deployment

This comprehensive Windows 11 OS replica will showcase advanced web development skills while providing an authentic Windows experience in the browser. The project incorporates modern design patterns, sophisticated state management, and cutting-edge web technologies to create a truly impressive desktop simulation.[^24][^2][^3]
<span style="display:none">[^100][^101][^102][^103][^104][^105][^106][^107][^108][^109][^110][^111][^112][^113][^114][^115][^116][^117][^118][^119][^120][^121][^122][^123][^124][^125][^126][^127][^128][^129][^130][^131][^132][^133][^134][^135][^136][^137][^138][^139][^140][^141][^142][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^40][^41][^42][^43][^44][^45][^46][^47][^48][^49][^50][^51][^52][^53][^54][^55][^56][^57][^58][^59][^60][^61][^62][^63][^64][^65][^66][^67][^68][^69][^70][^71][^72][^73][^74][^75][^76][^77][^78][^79][^80][^81][^82][^83][^84][^85][^86][^87][^88][^89][^90][^91][^92][^93][^94][^95][^96][^97][^98][^99]</span>

<div align="center">⁂</div>

[^1]: https://support.microsoft.com/en-us/meetwindows11

[^2]: https://learn.microsoft.com/en-us/windows/apps/design/

[^3]: https://en.wikipedia.org/wiki/Windows_11

[^4]: https://dev.to/nathraktim/react-flexi-window-draggable-resizable-windows-for-react-2nna

[^5]: https://www.dhiwise.com/post/guide-for-creating-responsive-elements-with-react-rnd

[^6]: https://github.com/bokuweb/react-rnd

[^7]: https://namastedev.com/blog/using-css-backdrop-filter-for-ui-effects/

[^8]: https://stackoverflow.com/questions/44522299/css-only-acrylic-material-from-fluent-design-system

[^9]: https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter

[^10]: https://www.aomeitech.com/windows-tips/aero-like-acrylic-effect-windows-11.html

[^11]: https://www.anoopcnair.com/how-to-enable-mica-effect-in-microsoft-edge/

[^12]: https://learn.microsoft.com/en-us/windows/apps/design/style/mica

[^13]: https://www.youtube.com/watch?v=NWhnTJ3-fFc

[^14]: https://www.youtube.com/watch?v=i02LKerdiBc

[^15]: https://www.kapilarya.com/disable-acrylic-blur-effect-on-windows-11-login-screen

[^16]: https://www.youtube.com/watch?v=VmZJSDVqXz0

[^17]: https://www.utsa.edu/techsolutions/Win11/Win11Features.html

[^18]: https://www.youtube.com/watch?v=w8N6N2A5ud0

[^19]: https://www.pcmag.com/how-to/customize-windows-11-start-menu

[^20]: https://windowsreport.com/windows-11-build-27965-brings-smarter-start-menu-with-scrollable-layout/

[^21]: https://microsoft.design/articles/start-fresh-redesigning-windows-start-menu/

[^22]: https://www.hp.com/us-en/shop/tech-takes/windows-11-overview

[^23]: https://en.wikipedia.org/wiki/Fluent_Design_System

[^24]: https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nextjs-on-wsl

[^25]: https://arxiv.org/abs/2412.20071

[^26]: https://www.spiedigitallibrary.org/conference-proceedings-of-spie/12782/3000795/Research-on-UI-design-and-optimization-of-digital-media-with/10.1117/12.3000795.full

[^27]: https://dl.acm.org/doi/10.1145/3592573.3593096

[^28]: https://ieeexplore.ieee.org/document/9800788/

[^29]: https://www.mdpi.com/2076-3417/14/8/3520

[^30]: https://www.mdpi.com/2079-9292/13/16/3127

[^31]: https://ejurnal.seminar-id.com/index.php/josh/article/view/3534

[^32]: https://ieeexplore.ieee.org/document/9402543/

[^33]: https://arxiv.org/abs/2509.07334

[^34]: https://ieeexplore.ieee.org/document/9498506/

[^35]: https://arxiv.org/pdf/2308.16024.pdf

[^36]: https://arxiv.org/pdf/1409.6924.pdf

[^37]: https://arxiv.org/pdf/2402.07939.pdf

[^38]: https://arxiv.org/ftp/arxiv/papers/2311/2311.16601.pdf

[^39]: https://www.mdpi.com/1424-8220/16/7/1049/pdf

[^40]: https://arxiv.org/pdf/1903.06656.pdf

[^41]: https://www.matec-conferences.org/articles/matecconf/pdf/2018/23/matecconf_icesti2018_01006.pdf

[^42]: https://arxiv.org/pdf/2204.06700.pdf

[^43]: http://arxiv.org/pdf/0709.3553.pdf

[^44]: https://www.scienceopen.com/document_file/22b3958b-01c0-43ef-92c9-950a28bf14b3/ScienceOpen/359_Hutchinson.pdf

[^45]: https://humanfactors.jmir.org/2022/3/e37894/PDF

[^46]: https://www.scienceopen.com/document_file/95a1904e-b95c-47ad-af3d-c2874b51f381/ScienceOpen/001_Clement.pdf

[^47]: http://arxiv.org/pdf/2303.05049.pdf

[^48]: https://dl.acm.org/doi/pdf/10.1145/3613904.3642822

[^49]: https://arxiv.org/html/2502.03330

[^50]: https://arxiv.org/ftp/arxiv/papers/1005/1005.0169.pdf

[^51]: https://www.youtube.com/watch?v=YnZQUub3O7I

[^52]: https://replicate.com/docs/guides/run/nextjs

[^53]: https://nextjs.org/learn/pages-router

[^54]: https://www.youtube.com/watch?v=IqHpqlPUsgU

[^55]: https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-nextjs-hybrid

[^56]: https://www.youtube.com/watch?v=8cq68EiFaKQ

[^57]: https://www.youtube.com/watch?v=a-vry15TtEI

[^58]: https://dev.to/alexeagleson/how-to-build-scalable-architecture-for-your-nextjs-project-2pb7

[^59]: https://learn.microsoft.com/en-us/windows/apps/design/downloads/

[^60]: https://learn.microsoft.com/en-us/windows/win32/winauto/user-interface-element-reference

[^61]: https://support.microsoft.com/en-us/windows/customize-the-windows-start-menu-fde6f576-0fc0-0813-6b0d-d3ec1d244c50

[^62]: https://link.springer.com/10.1007/s42496-025-00250-y

[^63]: https://www.mdpi.com/1996-1944/17/22/5534

[^64]: https://onlinelibrary.wiley.com/doi/10.1002/mren.202400032

[^65]: http://jurnal.unissula.ac.id/index.php/odj/article/view/20762

[^66]: https://so04.tci-thaijo.org/index.php/MTR/article/view/266792

[^67]: https://www.tandfonline.com/doi/full/10.1080/23311916.2024.2338160

[^68]: https://link.springer.com/10.1007/s12200-022-00033-4

[^69]: https://bezmialemscience.org/articles/doi/bas.galenos.2023.26818

[^70]: https://link.springer.com/10.1007/s10266-025-01225-y

[^71]: http://www.scielo.br/scielo.php?script=sci_arttext\&pid=S1806-83242023000100242\&tlng=en

[^72]: https://proceedings.challengingglass.com/index.php/cgc/article/download/409/355

[^73]: https://dl.acm.org/doi/pdf/10.1145/3613904.3642010

[^74]: https://ucl.scienceopen.com/document_file/7d100e26-2e40-4030-9614-ebe20dff61b3/ScienceOpen/ucloe-02-021.pdf

[^75]: https://advanced.onlinelibrary.wiley.com/doi/10.1002/adom.202403264

[^76]: https://www.youtube.com/watch?v=o3wNf_dnJIw

[^77]: https://github.com/Maplespe/ExplorerBlurMica

[^78]: https://www.youtube.com/watch?v=RP0DRzOcA2c

[^79]: https://pureinfotech.com/enable-new-windows-11-mica-material-chrome/

[^80]: https://stackoverflow.com/questions/44171246/microsoft-fluent-design-for-web-css-framework

[^81]: https://www.windowslatest.com/2025/06/12/enable-windows-11s-aero-glass-macos-liquid-glass-like-effects/

[^82]: https://fluent2.microsoft.design

[^83]: https://dx.plos.org/10.1371/journal.pone.0318806

[^84]: https://www.semanticscholar.org/paper/2e903daf0ac365af414a6d3b2320614b44796810

[^85]: https://matjournals.co.in/index.php/JIDSBDM/article/view/2555

[^86]: https://www.semanticscholar.org/paper/a0ec20f5bc268da9fd2b6346553ceb469181e8e3

[^87]: https://www.semanticscholar.org/paper/23183c47e7b70ca6f1fbe8cc1237bebb8aaba067

[^88]: https://www.semanticscholar.org/paper/4fb54ad468055026c768688475a42a8d459fd37f

[^89]: http://proceedings.spiedigitallibrary.org/proceeding.aspx?doi=10.1117/12.976447

[^90]: https://www.semanticscholar.org/paper/5cd7c07311686f1428e2c897ff79763406d176d9

[^91]: http://oa.upm.es/88446/

[^92]: https://www.semanticscholar.org/paper/84da0fbee44a9c7ac9e191bb5bbcf4e4a68ada31

[^93]: https://arxiv.org/pdf/0912.2706.pdf

[^94]: http://arxiv.org/pdf/0906.3224.pdf

[^95]: https://arxiv.org/html/2402.06795v1

[^96]: https://arxiv.org/pdf/0904.0719.pdf

[^97]: https://joss.theoj.org/papers/10.21105/joss.00814.pdf

[^98]: https://nottingham-repository.worktribe.com/preview/758132/paper.pdf

[^99]: https://arxiv.org/abs/2412.13552

[^100]: https://arxiv.org/html/2504.03884v1

[^101]: http://arxiv.org/pdf/1404.6782.pdf

[^102]: https://computingonline.net/computing/article/download/706/668

[^103]: https://arxiv.org/html/2410.15504v1

[^104]: https://zenodo.org/record/895933/files/article.pdf

[^105]: https://eprints.soton.ac.uk/406516/1/demo34_ATS.pdf

[^106]: https://dl.acm.org/doi/pdf/10.1145/3623504.3623569

[^107]: https://nextjs.org/docs/app/getting-started/installation

[^108]: https://stackoverflow.com/questions/78310137/i-need-react-draggable-resizable-library-with-drag-only-on-certain-part-of-eleme

[^109]: https://nextjs.org

[^110]: https://www.reddit.com/r/nextjs/comments/1jul0nm/built_a_nextjs_windowslike_ui_now_my_entire/

[^111]: https://tailwindcss.com/docs/backdrop-filter-blur

[^112]: https://www.semanticscholar.org/paper/d9d2d6eaf986af3e3aabb9453359e6869215a669

[^113]: https://www.semanticscholar.org/paper/b1f9a768a908364b558467a3ff6ffdbc71fc0e70

[^114]: https://www.semanticscholar.org/paper/3086904664465fd8245dfcd94cf36e3f108d73a3

[^115]: https://iubmb.onlinelibrary.wiley.com/doi/10.1002/bmb.21238

[^116]: https://www.semanticscholar.org/paper/3b7cc32d6ac7ccff2f0bfe45cccf96bf7b7122f2

[^117]: https://www.semanticscholar.org/paper/41002cd047d5c3dcb11b1e7ea7e5f5285b54dfef

[^118]: https://www.semanticscholar.org/paper/3d35c6cfabb9f03ff2bf88157619f45d8ec5f964

[^119]: https://www.semanticscholar.org/paper/f7cb81edd0792181298e90b587b38eb3f0cb5c18

[^120]: https://www.semanticscholar.org/paper/ce93bad0cbfac8f521fd1f022e44fb76468064d4

[^121]: https://linkinghub.elsevier.com/retrieve/pii/S0378720621000525

[^122]: https://arxiv.org/pdf/2208.15001.pdf

[^123]: https://arxiv.org/html/2501.16550v1

[^124]: https://arxiv.org/html/2411.10836v1

[^125]: http://arxiv.org/pdf/2405.07065.pdf

[^126]: https://arxiv.org/pdf/2311.12886.pdf

[^127]: https://arxiv.org/html/2404.09172v2

[^128]: https://arxiv.org/html/2503.00276

[^129]: https://thescipub.com/pdf/jcssp.2019.190.196.pdf

[^130]: https://arxiv.org/html/2502.20307v1

[^131]: https://zenodo.org/record/2571437/files/MotionCycles.pdf

[^132]: https://arxiv.org/pdf/2308.00224.pdf

[^133]: http://arxiv.org/pdf/2405.18156.pdf

[^134]: http://arxiv.org/pdf/2310.12678.pdf

[^135]: https://arxiv.org/html/2501.10021v1

[^136]: https://publication.avanca.org/index.php/avancacinema/article/view/491

[^137]: https://www.reddit.com/r/Windows11/comments/tw3iu4/i_think_windows_11_boot_screen_would_look_cool/

[^138]: https://stackoverflow.com/questions/74447508/where-is-loading-circle-on-windows-stored-at

[^139]: https://learn.microsoft.com/en-us/windows/configuration/start/layout

[^140]: https://www.reddit.com/r/techsupport/comments/125qacg/setting_a_default_lock_screen_login_screen/

[^141]: https://www.youtube.com/watch?v=TnRcQvME6so

[^142]: https://www.youtube.com/watch?v=J7XfbmDDM50

