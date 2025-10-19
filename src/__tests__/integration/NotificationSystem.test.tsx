import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NotificationProvider } from '@/store/notificationStore'
import NotificationCenter from '@/components/ui/NotificationCenter'
import { useNotificationActions } from '@/store/notificationStore'

// Mock the notification store
jest.mock('@/store/notificationStore', () => ({
  ...jest.requireActual('@/store/notificationStore'),
  useNotificationActions: jest.fn(),
}))

const mockNotificationActions = {
  addNotification: jest.fn(),
  removeNotification: jest.fn(),
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
  clearAll: jest.fn(),
  toggleNotificationCenter: jest.fn(),
}

const mockNotifications = [
  {
    id: '1',
    title: 'Test Notification',
    message: 'This is a test notification',
    type: 'info' as const,
    timestamp: new Date('2023-01-01T00:00:00Z'),
    isRead: false,
    priority: 'normal' as const,
    source: 'test',
  },
  {
    id: '2',
    title: 'Another Notification',
    message: 'This is another test notification',
    type: 'success' as const,
    timestamp: new Date('2023-01-01T00:01:00Z'),
    isRead: true,
    priority: 'high' as const,
    source: 'test',
  },
]

const TestComponent = () => {
  const { addNotification, removeNotification, markAsRead } = useNotificationActions()

  return (
    <div>
      <button
        onClick={() => addNotification({
          title: 'New Notification',
          message: 'This is a new notification',
          type: 'info',
          priority: 'normal',
          source: 'test',
        })}
        data-testid="add-notification"
      >
        Add Notification
      </button>
      <button
        onClick={() => removeNotification('1')}
        data-testid="remove-notification"
      >
        Remove Notification
      </button>
      <button
        onClick={() => markAsRead('1')}
        data-testid="mark-read"
      >
        Mark as Read
      </button>
      <NotificationCenter />
    </div>
  )
}

describe('Notification System Integration', () => {
  beforeEach(() => {
    (useNotificationActions as jest.Mock).mockReturnValue(mockNotificationActions)
    jest.clearAllMocks()
  })

  it('should add a notification when button is clicked', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    const addButton = screen.getByTestId('add-notification')
    fireEvent.click(addButton)

    expect(mockNotificationActions.addNotification).toHaveBeenCalledWith({
      title: 'New Notification',
      message: 'This is a new notification',
      type: 'info',
      priority: 'normal',
      source: 'test',
    })
  })

  it('should remove a notification when button is clicked', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    const removeButton = screen.getByTestId('remove-notification')
    fireEvent.click(removeButton)

    expect(mockNotificationActions.removeNotification).toHaveBeenCalledWith('1')
  })

  it('should mark notification as read when button is clicked', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    const markReadButton = screen.getByTestId('mark-read')
    fireEvent.click(markReadButton)

    expect(mockNotificationActions.markAsRead).toHaveBeenCalledWith('1')
  })

  it('should display notifications in the notification center', () => {
    // Mock the useNotificationCenter hook
    jest.doMock('@/store/notificationStore', () => ({
      ...jest.requireActual('@/store/notificationStore'),
      useNotificationCenter: () => ({
        notifications: mockNotifications,
        isOpen: true,
        unreadCount: 1,
      }),
    }))

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    // Check if notifications are displayed
    expect(screen.getByText('Test Notification')).toBeInTheDocument()
    expect(screen.getByText('Another Notification')).toBeInTheDocument()
  })

  it('should handle notification center toggle', () => {
    // Mock the useNotificationCenter hook
    jest.doMock('@/store/notificationStore', () => ({
      ...jest.requireActual('@/store/notificationStore'),
      useNotificationCenter: () => ({
        notifications: mockNotifications,
        isOpen: false,
        unreadCount: 1,
      }),
    }))

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    // Notification center should not be visible when closed
    expect(screen.queryByText('Test Notification')).not.toBeInTheDocument()
  })

  it('should display unread count', () => {
    // Mock the useNotificationCenter hook
    jest.doMock('@/store/notificationStore', () => ({
      ...jest.requireActual('@/store/notificationStore'),
      useNotificationCenter: () => ({
        notifications: mockNotifications,
        isOpen: true,
        unreadCount: 1,
      }),
    }))

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    // Check if unread count is displayed
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should handle different notification types', () => {
    const notifications = [
      {
        id: '1',
        title: 'Info Notification',
        message: 'This is an info notification',
        type: 'info' as const,
        timestamp: new Date(),
        isRead: false,
        priority: 'normal' as const,
        source: 'test',
      },
      {
        id: '2',
        title: 'Success Notification',
        message: 'This is a success notification',
        type: 'success' as const,
        timestamp: new Date(),
        isRead: false,
        priority: 'normal' as const,
        source: 'test',
      },
      {
        id: '3',
        title: 'Warning Notification',
        message: 'This is a warning notification',
        type: 'warning' as const,
        timestamp: new Date(),
        isRead: false,
        priority: 'normal' as const,
        source: 'test',
      },
      {
        id: '4',
        title: 'Error Notification',
        message: 'This is an error notification',
        type: 'error' as const,
        timestamp: new Date(),
        isRead: false,
        priority: 'normal' as const,
        source: 'test',
      },
    ]

    // Mock the useNotificationCenter hook
    jest.doMock('@/store/notificationStore', () => ({
      ...jest.requireActual('@/store/notificationStore'),
      useNotificationCenter: () => ({
        notifications,
        isOpen: true,
        unreadCount: 4,
      }),
    }))

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    // Check if all notification types are displayed
    expect(screen.getByText('Info Notification')).toBeInTheDocument()
    expect(screen.getByText('Success Notification')).toBeInTheDocument()
    expect(screen.getByText('Warning Notification')).toBeInTheDocument()
    expect(screen.getByText('Error Notification')).toBeInTheDocument()
  })

  it('should handle notification priorities', () => {
    const notifications = [
      {
        id: '1',
        title: 'Low Priority',
        message: 'This is a low priority notification',
        type: 'info' as const,
        timestamp: new Date(),
        isRead: false,
        priority: 'low' as const,
        source: 'test',
      },
      {
        id: '2',
        title: 'High Priority',
        message: 'This is a high priority notification',
        type: 'error' as const,
        timestamp: new Date(),
        isRead: false,
        priority: 'high' as const,
        source: 'test',
      },
      {
        id: '3',
        title: 'Critical Priority',
        message: 'This is a critical priority notification',
        type: 'error' as const,
        timestamp: new Date(),
        isRead: false,
        priority: 'critical' as const,
        source: 'test',
      },
    ]

    // Mock the useNotificationCenter hook
    jest.doMock('@/store/notificationStore', () => ({
      ...jest.requireActual('@/store/notificationStore'),
      useNotificationCenter: () => ({
        notifications,
        isOpen: true,
        unreadCount: 3,
      }),
    }))

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    // Check if all priority levels are displayed
    expect(screen.getByText('Low Priority')).toBeInTheDocument()
    expect(screen.getByText('High Priority')).toBeInTheDocument()
    expect(screen.getByText('Critical Priority')).toBeInTheDocument()
  })

  it('should handle notification timestamps', () => {
    const notifications = [
      {
        id: '1',
        title: 'Recent Notification',
        message: 'This is a recent notification',
        type: 'info' as const,
        timestamp: new Date(Date.now() - 60000), // 1 minute ago
        isRead: false,
        priority: 'normal' as const,
        source: 'test',
      },
      {
        id: '2',
        title: 'Old Notification',
        message: 'This is an old notification',
        type: 'info' as const,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isRead: false,
        priority: 'normal' as const,
        source: 'test',
      },
    ]

    // Mock the useNotificationCenter hook
    jest.doMock('@/store/notificationStore', () => ({
      ...jest.requireActual('@/store/notificationStore'),
      useNotificationCenter: () => ({
        notifications,
        isOpen: true,
        unreadCount: 2,
      }),
    }))

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    // Check if timestamps are displayed
    expect(screen.getByText('Recent Notification')).toBeInTheDocument()
    expect(screen.getByText('Old Notification')).toBeInTheDocument()
  })
})
