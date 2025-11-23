import React, { useState } from 'react';
import BootScreen from './components/os/BootScreen';
import Desktop from './components/os/Desktop';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  const [booted, setBooted] = useState(false);

  return (
    <ThemeProvider>
      <NotificationProvider>
        {!booted && <BootScreen onComplete={() => setBooted(true)} />}
        {booted && <Desktop />}
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;