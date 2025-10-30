'use client';

// import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { useSettingsStore } from '@/store/settingsStore';
import { useEffect } from 'react';
import { DurgasAssistant } from '@/components/system/DurgasAssistant';
import { DurgasAssistantProvider } from '@/hooks/use-durgas-assistant';
import { DesktopProvider } from '@/context/DesktopContext';
import { GlobalErrorBoundary } from '@/components/shared/GlobalErrorBoundary';
import { ContextAwareErrorBoundary } from '@/components/shared/ContextAwareErrorBoundary';
import { PerformanceMonitor } from '@/components/shared/PerformanceMonitor';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

// This is a client component because it uses hooks to update the theme
// const metadata: Metadata = {
//   title: 'DurgasOS',
//   description: 'A Windows 11 desktop simulator built with Next.js',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme, accent } = useSettingsStore();

  useEffect(() => {
    document.documentElement.className = theme;
    document.documentElement.setAttribute('data-accent', accent);
  }, [theme, accent]);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <GlobalErrorBoundary>
          <ThemeProvider>
            <DesktopProvider>
              <ContextAwareErrorBoundary>
                <DurgasAssistantProvider>
                  {children}
                  <DurgasAssistant />
                  <Toaster />
                  <PerformanceMonitor />
                </DurgasAssistantProvider>
              </ContextAwareErrorBoundary>
            </DesktopProvider>
          </ThemeProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
