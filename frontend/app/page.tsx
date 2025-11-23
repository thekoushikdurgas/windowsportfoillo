'use client';

import { useState } from 'react';
import BootScreen from '@/components/os/BootScreen';
import Desktop from '@/components/os/Desktop';

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <main className="h-screen w-screen overflow-hidden">
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}
      {booted && <Desktop />}
    </main>
  );
}

