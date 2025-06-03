// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Your Tailwind CSS import
import { AuthProvider } from './AuthContext.jsx'; // Import AuthProvider
import { BrowserRouter } from 'react-router-dom'; 

// Disable React.StrictMode in development to prevent double rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </AuthProvider>
);
