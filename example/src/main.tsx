import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';

import { Area2Provider } from '@area2-ai/a2-react-keystroke-package';
import { config } from './area2-config.ts';

createRoot(document.getElementById('root')!).render(
  <Area2Provider config={config}>
    <StrictMode>
      <App />
    </StrictMode>
  </Area2Provider>,
)
