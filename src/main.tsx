import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '@/App';
import '@/index.css';

void React;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
