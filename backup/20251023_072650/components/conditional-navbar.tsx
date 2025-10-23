'use client';

import { usePathname } from 'next/navigation';
import { NavBar } from '@/components/navbar';
import { useEffect } from 'react';

export function ConditionalNavBar() {
  const pathname = usePathname();
  
  useEffect(() => {
    const main = document.querySelector('main');
    if (main) {
      if (pathname.startsWith('/community') || pathname.startsWith('/leapday')) {
        main.classList.remove('pb-20');
      } else {
        main.classList.add('pb-20');
      }
    }
  }, [pathname]);
  
  // Don't show the business navigation on community and leapday pages
  if (pathname.startsWith('/community') || pathname.startsWith('/leapday')) {
    return null;
  }
  
  return <NavBar />;
}
