'use client';

import Masonry from 'react-masonry-css';
import { ReactNode } from 'react';

interface MasonryGridProps {
  children: ReactNode[];
  className?: string;
  breakpointColumnsObj?: {
    default: number;
    [key: number]: number;
  };
}

export function MasonryGrid({ 
  children, 
  className = '',
  breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  }
}: MasonryGridProps) {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={`masonry-grid ${className}`}
      columnClassName="masonry-grid-column"
    >
      {children}
    </Masonry>
  );
}

// CSS for Masonry layout (add to globals.css)
export const masonryStyles = `
.masonry-grid {
  display: flex;
  margin-left: -16px;
  width: auto;
}

.masonry-grid-column {
  padding-left: 16px;
  background-clip: padding-box;
}

.masonry-grid-column > div {
  margin-bottom: 16px;
}

@media (max-width: 640px) {
  .masonry-grid {
    margin-left: -8px;
  }
  
  .masonry-grid-column {
    padding-left: 8px;
  }
  
  .masonry-grid-column > div {
    margin-bottom: 8px;
  }
}
`;
