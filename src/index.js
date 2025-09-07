import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Grab the root div from public/index.html
const container = document.getElementById('root');
const root = createRoot(container);

// Render your main App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
