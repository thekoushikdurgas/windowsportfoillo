# Windows 11 Replica — Execution Plan (Next.js 14, TypeScript)

## 0) Summary
Create a faithful Windows 11-like experience from boot → login → desktop. The desktop shows app icons and a centered taskbar. Opening any app spawns a resizable, draggable window with Windows 11 chrome and controls: Minimize, Maximize/Restore, Close, Crop, and Learn. Core built‑in apps: About Me, File Explorer, Settings, Calculator, Notepad. Include Snap Layouts preview, Notification/Quick Settings, and Start menu. Visuals reflect the provided gallery mockups.

---

## 1) Scope and Deliverables
- Functional boot screen and login transition with authentic ring animation.
- Desktop with wallpaper, icons, taskbar, Start menu, system tray, clock.
- Window Manager: drag, resize, z‑order, focus, snap layouts, animations.
- Window chrome with buttons: Minimize, Maximize/Restore, Close, Crop, Learn.
- Learn system: context-aware overlays and per-app tutorials.
- Apps: About Me (portfolio), File Explorer (mock filesystem), Settings (theme, wallpaper, taskbar alignment, sounds), Calculator, Notepad.
- Notification Center + Quick Settings panel.
- Keyboard shortcuts, accessibility focus order, reduced-motion support.
- Persistence: theme/wallpaper/taskbar alignment, recently used apps.

Out of scope for v1: real authentication, real filesystem, network, web browser.

---

## 2) Tech Stack
- Next.js 14 App Router, TypeScript
- Tailwind CSS + CSS modules (for component-scoped details)
- Zustand for state (system, windows, apps, learn)
- Framer Motion for animations
- React-RND (or RND-like) for drag/resize
- Lucide React for icons; custom assets under `public/images` and `public/sounds`

---

## 3) Target Directory Structure
```
src/
  app/
    layout.tsx
    page.tsx          // Desktop entry after boot/login
    loading.tsx       // App Router suspense/loading
    globals.css
  components/
    system/
      BootScreen.tsx
      LoginScreen.tsx
      Desktop.tsx
      Taskbar.tsx
      StartMenu.tsx
      QuickSettings.tsx
      NotificationCenter.tsx
      WindowManager.tsx
    apps/
      AboutMe/
        AboutMeApp.tsx
        AboutMeWindow.tsx
      FileExplorer/
        FileExplorerApp.tsx
        FileExplorerWindow.tsx
      Settings/
        SettingsApp.tsx
        SettingsWindow.tsx
      Calculator/
        CalculatorApp.tsx
        CalculatorWindow.tsx
      Notepad/
        NotepadApp.tsx
        NotepadWindow.tsx
    ui/
      Window.tsx         // chrome + controls incl. Crop + Learn
      SnapLayouts.tsx
      ContextMenu.tsx
      Button.tsx
    common/
      AppIcon.tsx
      DesktopIcon.tsx
      Wallpaper.tsx
  contexts/
    ThemeContext.tsx
    LearnContext.tsx
  store/
    systemStore.ts
    windowStore.ts
    appStore.ts
  themes/
    index.ts            // light/dark + accent palette
  types/
    system.ts
    window.ts
    app.ts
    theme.ts
  utils/
    constants.ts
    helpers.ts
    mica.ts             // acrylic/mica helpers
public/
  images/wallpapers/
  images/icons/
  sounds/
```

---

## 4) Feature Mapping to Mockups
- Boot Loading: dark background, Windows logo, ring animation → `BootScreen.tsx`.
- Login Screen: acrylic blur card, avatar, password field, status icons → `LoginScreen.tsx`.
- Desktop: wallpaper with depth, centered taskbar → `Desktop.tsx`, `Taskbar.tsx`.
- Start Menu: pinned grid + recommended row, search field → `StartMenu.tsx`.
- Multi-window views: acrylic windows with controls + Learn → `Window.tsx` + `WindowManager.tsx`.
- Snap Layouts panel on maximize hover → `SnapLayouts.tsx`.
- Notification/Quick Settings → `NotificationCenter.tsx`, `QuickSettings.tsx`.
- File Explorer / Settings / About Me UI → respective app directories.

---

## 5) System Design
### 5.1 State Stores (Zustand)
- `systemStore`: theme, accent, wallpaper, bootPhase("boot|login|desktop"), time, sounds, quick settings.
- `appStore`: registry of apps, pinned apps, recent, start menu data.
- `windowStore`:
  - windows: `{ id, appId, title, z, bounds{x,y,w,h}, state: 'normal|min|max', crop?: {x,y,w,h} }[]`
  - APIs: open(appId), focus(id), close(id), minimize(id), toggleMax(id), crop(id, rect), snap(id, layoutSlot), bringToFront(id).
- `learnStore` or `LearnContext`: active tutorial `{appId, step}`, helpers `showTutorial(appId)`, `nextStep()`, `finish()`.

### 5.2 Window Chrome
- Title bar with icon + title.
- Controls: Minimize, Maximize/Restore, Close, Crop, Learn.
- Acrylic/mica background, shadow, rounded 8px.
- Resizable via edges/corners; draggable by title bar; snap to edges and via layouts.

### 5.3 Snap Layouts
- Hover maximize shows layouts (2/3/4 splits, 70/30, grid 2x2).
- Selecting a slot sets bounds; ghost preview during hover.

### 5.4 Crop
- Toggle crop mode: dim content, show resizable crop rectangle; confirm applies `window.crop` mask; clear to reset. Crop is visual-only (CSS clip-path) and persisted in `windowStore`.

### 5.5 Learn System
- Per-app steps: overlay highlights UI with callouts; keyboard `Esc` to exit; progress persisted in `localStorage`.

---

## 6) Applications
### 6.1 About Me
- Sections: Profile, Skills with rings, Portfolio cards, Experience timeline, Contacts.
- Learn: step through each section.

### 6.2 File Explorer (mock)
- Sidebar (Quick access, Desktop, Documents).
- Toolbar (New, Copy, Paste, Rename, Delete, Share).
- Breadcrumbs, grid/list toggle; mock data JSON.

### 6.3 Settings
- Left nav; pages: Personalization, System, Accounts, Accessibility.
- Controls for theme, accent, wallpaper, taskbar alignment, sounds.

### 6.4 Calculator
- Standard + simple scientific; keyboard input; history list.

### 6.5 Notepad
- Text area, word wrap toggle, find, open/save to `localStorage`.

---

## 7) Accessibility & UX
- Focus outlines, tab order for window controls.
- ARIA labels for buttons and panels.
- Reduced motion preference respected via animation variants.

---

## 8) Performance & Quality
- Code-splitting apps; lazy load windows on open.
- Optimize backdrop-filter usage; fallbacks for low-power.
- Memoize heavy components; unmount closed windows.

---

## 9) Milestones and Tasks
### M0 — Project Setup (Day 0–1)
- Next.js + TS + Tailwind; base theme; assets folders; fonts; ESLint/Prettier.

### M1 — Boot → Login (Day 2–3)
- `BootScreen` with ring animation and timed phases.
- `LoginScreen` with acrylic card and transition to desktop.

### M2 — Desktop Shell (Day 4–6)
- `Desktop`, `Wallpaper`, `Taskbar`, clock; `StartMenu` skeleton.
- Zustand stores; initial theme/wallpaper persistence.

### M3 — Window Manager (Day 7–10)
- `WindowManager` + `Window` chrome; drag/resize/z-index; animations.
- Controls: Minimize, Maximize/Restore, Close; focus handling; persistence.

### M4 — Snap Layouts + Crop + Learn Hooks (Day 11–14)
- `SnapLayouts` preview + apply; keyboard shortcuts.
- Crop mode with clip-path; API in `windowStore`.
- `LearnContext` with overlay component and basic step engine.

### M5 — Core Apps (Day 15–22)
- About Me (full content, charts/skills, portfolio tiles).
- File Explorer (mock FS, toolbar, breadcrumbs, views).
- Settings (theme, wallpaper, taskbar alignment, sounds toggles).
- Calculator + Notepad minimal viable features.

### M6 — Start Menu, Notifications, Quick Settings (Day 23–26)
- Start menu pinned/recommended; search input UX.
- Notification Center with toasts; Quick Settings toggles + sliders.

### M7 — Polish, A11y, QA (Day 27–28)
- Visual parity with mockups, shadows, hover, blur tuning.
- Keyboard navigation, ARIA, reduced motion; performance passes.

---

## 10) Acceptance Criteria
- Boot → Login → Desktop flow matches gallery timing and visuals.
- Opening any app shows acrylic window with 5 controls incl. Crop + Learn.
- Windows can be dragged, resized, snapped; z-order behaves correctly.
- Learn overlays display per-app tutorials; progress persists.
- Start menu, Quick Settings, Notification Center function as shown.
- Settings change theme/accent/wallpaper and persist across reloads.

---

## 11) Implementation Checklist
- [ ] Create stores: `systemStore`, `windowStore`, `appStore`; contexts.
- [ ] Build `BootScreen`, `LoginScreen`, transitions.
- [ ] Implement `Desktop`, `Taskbar`, `StartMenu` base.
- [ ] Implement `WindowManager` + `Window` chrome and controls.
- [ ] Add `SnapLayouts` and keyboard snapping.
- [ ] Add `Crop` mode with clip-path persistence.
- [ ] Implement `LearnContext` and `TutorialOverlay`.
- [ ] Ship About Me, File Explorer, Settings, Calculator, Notepad.
- [ ] Add Notification Center and Quick Settings.
- [ ] Final polish, a11y, performance, sounds.

---

## 12) Notes on Visual Fidelity
- Use 8px radius, subtle 12–24px blur, layered shadow (umbra + ambient).
- Use centered taskbar with mica background; icons sized 20–24px.
- Respect Windows 11 spacing (4px grid) and typography hierarchy.
