'use client';

import { useEffect, useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SplashLoader } from '@/components/ui/SplashLoader';

export function Providers({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('splashShown') !== 'true') {
      setShowSplash(true);
    }
  }, []);

  return (
    <>
      {showSplash && (
        <SplashLoader
          onFinish={() => {
            sessionStorage.setItem('splashShown', 'true');
            setShowSplash(false);
          }}
        />
      )}
      <main id="main-content" style={{ minHeight: '100vh' }}>
        {children}
      </main>
      <SpeedInsights />
    </>
  );
}
