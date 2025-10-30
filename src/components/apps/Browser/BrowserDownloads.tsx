'use client';

import { useState } from 'react';
import { Download, Pause, Play, X, Trash2, FolderOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useBrowserStore } from '@/store/browserStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger, ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu';
import { logger } from '@/lib/logger';
import type { Download as DownloadType } from '@/types/browser';

interface BrowserDownloadsProps {
  className?: string;
}

export function BrowserDownloads({ className = '' }: BrowserDownloadsProps) {
  const {
    downloads,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    clearDownload,
  } = useBrowserStore();

  const [filter, setFilter] = useState<'all' | 'downloading' | 'completed' | 'failed' | 'paused'>('all');

  const filteredDownloads = downloads.filter(download => {
    if (filter === 'all') return true;
    return download.status === filter;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatSpeed = (bytesPerSecond: number): string => {
    return `${formatFileSize(bytesPerSecond)}/s`;
  };

  const formatDuration = (startTime: Date, endTime?: Date): string => {
    const duration = endTime ? 
      endTime.getTime() - startTime.getTime() : 
      Date.now() - startTime.getTime();
    
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'downloading':
        return <Download className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getProgressPercentage = (download: DownloadType): number => {
    if (download.totalBytes === 0) return 0;
    return Math.round((download.downloadedBytes / download.totalBytes) * 100);
  };

  const handlePauseResume = (downloadId: string, status: string) => {
    if (status === 'paused') {
      resumeDownload(downloadId);
    } else {
      pauseDownload(downloadId);
    }
  };

  const handleCancel = (downloadId: string) => {
    cancelDownload(downloadId);
  };

  const handleClear = (downloadId: string) => {
    clearDownload(downloadId);
  };

  const handleOpenFile = (download: DownloadType) => {
    // In a real implementation, this would open the downloaded file
    logger.debug('Opening file', { filename: download.filename });
  };

  const handleOpenFolder = () => {
    // In a real implementation, this would open the downloads folder
    logger.debug('Opening downloads folder');
  };

  const renderDownload = (download: DownloadType) => {
    const progressPercentage = getProgressPercentage(download);
    const isCompleted = download.status === 'completed';
    const isFailed = download.status === 'failed';
    const isPaused = download.status === 'paused';
    const isDownloading = download.status === 'downloading';

    return (
      <ContextMenu key={download.id}>
        <ContextMenuTrigger asChild>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-start gap-3">
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(download.status)}
              </div>

              {/* Download Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium truncate">{download.filename}</h4>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(download.downloadedBytes)} / {formatFileSize(download.totalBytes)}
                  </span>
                </div>

                {/* Progress Bar */}
                {!isCompleted && !isFailed && (
                  <div className="mb-2">
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}

                {/* Status Info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>{download.status}</span>
                    {isDownloading && (
                      <span>{formatSpeed(download.speed)}</span>
                    )}
                    <span>{formatDuration(download.startTime, download.endTime)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenFile(download)}
                        className="h-6 px-2 text-xs"
                      >
                        <FolderOpen className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                    )}
                    
                    {!isCompleted && !isFailed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePauseResume(download.id, download.status)}
                        className="h-6 px-2 text-xs"
                      >
                        {isPaused ? (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </>
                        )}
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(download.id)}
                      className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          {isCompleted && (
            <ContextMenuItem onClick={() => handleOpenFile(download)}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Open file
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={handleOpenFolder}>
            <FolderOpen className="h-4 w-4 mr-2" />
            Open downloads folder
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            onClick={() => handleClear(download.id)}
            className="text-red-600 dark:text-red-400"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove from list
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  const getFilterCount = (status: string) => {
    return downloads.filter(d => d.status === status).length;
  };

  return (
    <TooltipProvider>
      <div className={`p-4 space-y-4 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Downloads</h3>
          <div className="text-sm text-gray-500">
            {downloads.length} total
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {[
            { key: 'all', label: 'All', count: downloads.length },
            { key: 'downloading', label: 'Downloading', count: getFilterCount('downloading') },
            { key: 'completed', label: 'Completed', count: getFilterCount('completed') },
            { key: 'failed', label: 'Failed', count: getFilterCount('failed') },
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(key as 'all' | 'completed' | 'downloading' | 'failed' | 'paused')}
              className="flex-1 h-8 text-xs"
            >
              {label} ({count})
            </Button>
          ))}
        </div>

        {/* Downloads List */}
        <div className="space-y-2">
          {filteredDownloads.length > 0 ? (
            filteredDownloads.map(renderDownload)
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No downloads</p>
              <p className="text-sm">Downloads will appear here when you download files</p>
            </div>
          )}
        </div>

        {/* Clear All Button */}
        {downloads.length > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                downloads.forEach(download => clearDownload(download.id));
              }}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all downloads
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
