import { test, expect } from '@playwright/test'

test.describe('Desktop Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for the desktop to load
    await page.waitForSelector('[data-testid="desktop"]', { timeout: 10000 })
  })

  test('should display desktop with wallpaper', async ({ page }) => {
    // Check if desktop is visible
    const desktop = page.locator('[data-testid="desktop"]')
    await expect(desktop).toBeVisible()

    // Check if wallpaper is loaded
    const wallpaper = page.locator('[data-testid="desktop-wallpaper"]')
    await expect(wallpaper).toBeVisible()
  })

  test('should display desktop icons', async ({ page }) => {
    // Check if desktop icons are visible
    const desktopIcons = page.locator('[data-testid="desktop-icon"]')
    await expect(desktopIcons).toHaveCount(4) // About Me, File Explorer, Calculator, Notepad

    // Check if icons have correct names
    await expect(page.locator('text=About Me')).toBeVisible()
    await expect(page.locator('text=File Explorer')).toBeVisible()
    await expect(page.locator('text=Calculator')).toBeVisible()
    await expect(page.locator('text=Notepad')).toBeVisible()
  })

  test('should open window when double-clicking desktop icon', async ({ page }) => {
    // Double-click on Calculator icon
    const calculatorIcon = page.locator('[data-testid="desktop-icon"]').filter({ hasText: 'Calculator' })
    await calculatorIcon.dblclick()

    // Check if window opened
    const window = page.locator('[data-testid="window"]').filter({ hasText: 'Calculator' })
    await expect(window).toBeVisible()
  })

  test('should show context menu on right-click', async ({ page }) => {
    // Right-click on desktop
    await page.locator('[data-testid="desktop"]').click({ button: 'right' })

    // Check if context menu appears
    const contextMenu = page.locator('[data-testid="context-menu"]')
    await expect(contextMenu).toBeVisible()
  })

  test('should select desktop icon on click', async ({ page }) => {
    // Click on Calculator icon
    const calculatorIcon = page.locator('[data-testid="desktop-icon"]').filter({ hasText: 'Calculator' })
    await calculatorIcon.click()

    // Check if icon is selected
    await expect(calculatorIcon).toHaveClass(/selected/)
  })

  test('should deselect icons when clicking on desktop', async ({ page }) => {
    // Select an icon first
    const calculatorIcon = page.locator('[data-testid="desktop-icon"]').filter({ hasText: 'Calculator' })
    await calculatorIcon.click()
    await expect(calculatorIcon).toHaveClass(/selected/)

    // Click on desktop
    await page.locator('[data-testid="desktop"]').click()

    // Check if icon is deselected
    await expect(calculatorIcon).not.toHaveClass(/selected/)
  })
})

test.describe('Window Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="desktop"]', { timeout: 10000 })
    
    // Open a window
    const calculatorIcon = page.locator('[data-testid="desktop-icon"]').filter({ hasText: 'Calculator' })
    await calculatorIcon.dblclick()
    await page.waitForSelector('[data-testid="window"]')
  })

  test('should open window with correct title', async ({ page }) => {
    const window = page.locator('[data-testid="window"]').filter({ hasText: 'Calculator' })
    await expect(window).toBeVisible()
    
    const title = window.locator('[data-testid="window-title"]')
    await expect(title).toHaveText('Calculator')
  })

  test('should minimize window when minimize button is clicked', async ({ page }) => {
    const window = page.locator('[data-testid="window"]').filter({ hasText: 'Calculator' })
    const minimizeButton = window.locator('[data-testid="minimize-button"]')
    
    await minimizeButton.click()
    
    // Window should be minimized (not visible)
    await expect(window).not.toBeVisible()
  })

  test('should maximize window when maximize button is clicked', async ({ page }) => {
    const window = page.locator('[data-testid="window"]').filter({ hasText: 'Calculator' })
    const maximizeButton = window.locator('[data-testid="maximize-button"]')
    
    await maximizeButton.click()
    
    // Window should be maximized
    await expect(window).toHaveClass(/maximized/)
  })

  test('should close window when close button is clicked', async ({ page }) => {
    const window = page.locator('[data-testid="window"]').filter({ hasText: 'Calculator' })
    const closeButton = window.locator('[data-testid="close-button"]')
    
    await closeButton.click()
    
    // Window should be closed
    await expect(window).not.toBeVisible()
  })

  test('should focus window when clicked', async ({ page }) => {
    const window = page.locator('[data-testid="window"]').filter({ hasText: 'Calculator' })
    
    await window.click()
    
    // Window should be focused
    await expect(window).toHaveClass(/focused/)
  })

  test('should drag window', async ({ page }) => {
    const window = page.locator('[data-testid="window"]').filter({ hasText: 'Calculator' })
    const titleBar = window.locator('[data-testid="window-title-bar"]')
    
    // Get initial position
    const initialBox = await window.boundingBox()
    
    // Drag the window
    await titleBar.hover()
    await page.mouse.down()
    await page.mouse.move(100, 100)
    await page.mouse.up()
    
    // Check if window moved
    const newBox = await window.boundingBox()
    expect(newBox?.x).not.toBe(initialBox?.x)
    expect(newBox?.y).not.toBe(initialBox?.y)
  })

  test('should resize window', async ({ page }) => {
    const window = page.locator('[data-testid="window"]').filter({ hasText: 'Calculator' })
    const resizeHandle = window.locator('[data-testid="resize-handle"]')
    
    // Get initial size
    const initialBox = await window.boundingBox()
    
    // Resize the window
    await resizeHandle.hover()
    await page.mouse.down()
    await page.mouse.move(200, 200)
    await page.mouse.up()
    
    // Check if window resized
    const newBox = await window.boundingBox()
    expect(newBox?.width).not.toBe(initialBox?.width)
    expect(newBox?.height).not.toBe(initialBox?.height)
  })
})

test.describe('Taskbar Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="desktop"]', { timeout: 10000 })
  })

  test('should display taskbar', async ({ page }) => {
    const taskbar = page.locator('[data-testid="taskbar"]')
    await expect(taskbar).toBeVisible()
  })

  test('should display start button', async ({ page }) => {
    const startButton = page.locator('[data-testid="start-button"]')
    await expect(startButton).toBeVisible()
  })

  test('should open start menu when start button is clicked', async ({ page }) => {
    const startButton = page.locator('[data-testid="start-button"]')
    await startButton.click()
    
    const startMenu = page.locator('[data-testid="start-menu"]')
    await expect(startMenu).toBeVisible()
  })

  test('should display app icons in taskbar when windows are open', async ({ page }) => {
    // Open a window
    const calculatorIcon = page.locator('[data-testid="desktop-icon"]').filter({ hasText: 'Calculator' })
    await calculatorIcon.dblclick()
    
    // Check if app icon appears in taskbar
    const taskbarIcon = page.locator('[data-testid="taskbar-icon"]').filter({ hasText: 'Calculator' })
    await expect(taskbarIcon).toBeVisible()
  })

  test('should restore window when taskbar icon is clicked', async ({ page }) => {
    // Open a window
    const calculatorIcon = page.locator('[data-testid="desktop-icon"]').filter({ hasText: 'Calculator' })
    await calculatorIcon.dblclick()
    
    // Minimize the window
    const window = page.locator('[data-testid="window"]').filter({ hasText: 'Calculator' })
    const minimizeButton = window.locator('[data-testid="minimize-button"]')
    await minimizeButton.click()
    
    // Click taskbar icon to restore
    const taskbarIcon = page.locator('[data-testid="taskbar-icon"]').filter({ hasText: 'Calculator' })
    await taskbarIcon.click()
    
    // Window should be visible again
    await expect(window).toBeVisible()
  })
})

test.describe('Mobile Responsiveness', () => {
  test('should display mobile taskbar on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForSelector('[data-testid="desktop"]', { timeout: 10000 })
    
    const mobileTaskbar = page.locator('[data-testid="mobile-taskbar"]')
    await expect(mobileTaskbar).toBeVisible()
  })

  test('should handle touch gestures on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForSelector('[data-testid="desktop"]', { timeout: 10000 })
    
    // Test swipe up gesture
    const desktop = page.locator('[data-testid="desktop"]')
    await desktop.hover()
    await page.mouse.down()
    await page.mouse.move(0, -100)
    await page.mouse.up()
    
    // Check if mobile taskbar expanded
    const mobileTaskbar = page.locator('[data-testid="mobile-taskbar"]')
    await expect(mobileTaskbar).toHaveClass(/expanded/)
  })
})

test.describe('Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="desktop"]', { timeout: 10000 })
    
    // Check for ARIA labels on interactive elements
    const startButton = page.locator('[data-testid="start-button"]')
    await expect(startButton).toHaveAttribute('aria-label')
    
    const desktopIcons = page.locator('[data-testid="desktop-icon"]')
    const firstIcon = desktopIcons.first()
    await expect(firstIcon).toHaveAttribute('aria-label')
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="desktop"]', { timeout: 10000 })
    
    // Test Tab navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Check if focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should announce screen reader messages', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="desktop"]', { timeout: 10000 })
    
    // Check for screen reader announcements
    const announcements = page.locator('[aria-live]')
    await expect(announcements).toHaveCount(1)
  })
})
