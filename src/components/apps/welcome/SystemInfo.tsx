'use client';

import { motion } from 'framer-motion';
import { Monitor, Palette, Cpu, HardDrive } from 'lucide-react';
import { fadeInUp } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';

export interface SystemInfoProps {
  theme: string;
  appCount: number;
  performance: {
    memory: number;
    cpu: number;
  };
}

export function SystemInfo({ theme, appCount, performance }: SystemInfoProps) {
  const systemInfo = [
    {
      icon: Monitor,
      label: 'OS Version',
      value: 'DurgasOS 1.0.0',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Palette,
      label: 'Theme',
      value: theme === 'dark' ? 'Dark Mode' : 'Light Mode',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Cpu,
      label: 'Apps Available',
      value: `${appCount} applications`,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: HardDrive,
      label: 'Performance',
      value: `${performance.memory}% Memory, ${performance.cpu}% CPU`,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
    >
      {systemInfo.map((info) => (
        <motion.div
          key={info.label}
          whileHover={{
            y: -4,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: { duration: 0.2, ease: "easeInOut" as const }
          }}
        >
          <Card variant="glass" className="hover:scale-105 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/20">
                  <info.icon className={`w-5 h-5 ${info.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {info.label}
                  </p>
                  <p className={`text-sm font-semibold ${info.color}`}>
                    {info.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
