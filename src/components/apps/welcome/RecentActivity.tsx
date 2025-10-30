'use client';

import { motion } from 'framer-motion';
import { Clock, FileText, Folder, ExternalLink } from 'lucide-react';
import { timelineItem, fadeInUp } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';

interface ActivityItem {
  id: string;
  type: 'app' | 'file' | 'project';
  name: string;
  timestamp: Date;
  icon: React.ComponentType<{ className?: string }>;
}

export interface RecentActivityProps {
  activities: ActivityItem[];
  maxItems?: number;
}

export function RecentActivity({ activities, maxItems = 5 }: RecentActivityProps) {
  const recentActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'app':
        return ExternalLink;
      case 'file':
        return FileText;
      case 'project':
        return Folder;
      default:
        return Clock;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (recentActivities.length === 0) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="mt-6"
      >
        <Card variant="glass" className="hover:scale-105 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mb-3 border border-white/20">
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No recent activity to show
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="mt-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {recentActivities.map((activity) => {
          const ActivityIcon = getActivityIcon(activity.type);
          return (
            <motion.div
              key={activity.id}
              variants={timelineItem}
            >
              <Card variant="glass" className="hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-white/10">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/20">
                      <ActivityIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {activity.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                    <Clock className="w-3 h-3 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
