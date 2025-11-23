import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { WebSocketProvider } from "@/context/WebSocketContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DurgasOS - AI-Powered Cloud Desktop",
  description: "A modern desktop operating system experience in your browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <NotificationProvider>
            <WebSocketProvider>
              {children}
            </WebSocketProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

