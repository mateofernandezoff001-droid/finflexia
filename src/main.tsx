import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n/config';

// Defensive handling for Vite/HMR websocket errors in the preview environment
if (typeof window !== 'undefined') {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args) => {
    const msg = args[0]?.toString() || '';
    if (msg.includes('[vite] failed to connect to websocket') || 
        msg.includes('WebSocket connection to') ||
        msg.includes('WebSocket closed without opened')) {
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = (...args) => {
    const msg = args[0]?.toString() || '';
    if (msg.includes('[vite]')) return;
    originalWarn.apply(console, args);
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || event.reason?.toString() || '';
    if (
      reason.includes('WebSocket') || 
      reason.includes('vite') || 
      reason.includes('closed without opened') ||
      reason.includes('failed to connect')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (
      msg.includes('WebSocket') || 
      msg.includes('vite') || 
      msg.includes('closed without opened')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('SW registered:', reg);
    }).catch(err => {
      console.log('SW registration failed:', err);
    });
  });
}
