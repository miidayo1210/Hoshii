"use client";
import Masonry from "react-masonry-css";
import { ReactNode } from "react";

export default function MasonryGrid({ children }: { children: ReactNode }) {
  const breakpoints = { default: 4, 1024: 3, 640: 2, 0: 1 };
  return (
    <Masonry breakpointCols={breakpoints} className="flex gap-4" columnClassName="masonry-column space-y-4">
      {children}
    </Masonry>
  );
}




