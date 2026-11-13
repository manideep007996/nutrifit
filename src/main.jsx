import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './styles/global.css';

// Embedded/sandboxed hosts (e.g. a Claude Artifact) can't use URL paths,
// so that build keeps routing in memory. Normal hosting uses real URLs.
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router basename={import.meta.env.VITE_ROUTER === 'memory' ? undefined : import.meta.env.BASE_URL}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);
