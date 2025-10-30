'use client';

import { memo, ReactNode } from 'react';
import { usePerformance } from '@/hooks/use-performance';

interface MemoizedComponentProps {
  children: ReactNode;
  name: string;
  dependencies?: unknown[];
}

export const MemoizedComponent = memo<MemoizedComponentProps>(
  ({ children, name }) => {
    usePerformance(name);
    return <>{children}</>;
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    if (prevProps.name !== nextProps.name) {
      return false;
    }
    
    if (prevProps.dependencies?.length !== nextProps.dependencies?.length) {
      return false;
    }
    
    return prevProps.dependencies?.every((dep, index) => 
      dep === nextProps.dependencies?.[index]
    ) ?? true;
  }
);

MemoizedComponent.displayName = 'MemoizedComponent';
