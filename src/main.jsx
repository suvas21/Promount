import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

// If a deploy invalidates chunk filenames while a CDN/browser caches old HTML,
// the app can white-screen due to failed chunk fetches.
// This guard triggers a one-time hard reload when that happens.
if (typeof window !== 'undefined') {
  const shouldReloadForChunkError = (message = '') => {
    const text = String(message);
    return (
      text.includes('Failed to fetch dynamically imported module') ||
      text.includes('Importing a module script failed') ||
      text.includes('Loading chunk') ||
      text.includes('ChunkLoadError') ||
      text.includes('fetch') && text.includes('chunk')
    );
  };

  const markAndReloadOnce = () => {
    const key = '__pm_chunk_reload_once__';
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  window.addEventListener('error', (event) => {
    const message = event?.message || event?.error?.message || '';
    if (shouldReloadForChunkError(message)) {
      markAndReloadOnce();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const message = event?.reason?.message || String(event?.reason || '');
    if (shouldReloadForChunkError(message)) {
      markAndReloadOnce();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);