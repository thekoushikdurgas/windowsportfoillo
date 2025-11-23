'use client';

import { useState } from 'react';
import BootScreen from '@/components/os/BootScreen';
import Desktop from '@/components/os/Desktop';

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <main className="viewport-container">
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}
      {booted && <Desktop />}
    </main>
  );
}

