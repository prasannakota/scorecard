import React from 'react';
import ReactDOM from 'react-dom/client';
import TestApp from './admin/TestApp';
import '../css/app.css';

console.log('Admin test script loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded in admin-test.jsx');
  const adminRoot = document.getElementById('admin-app');
  
  if (adminRoot) {
    console.log('Admin root element found, rendering test app');
    ReactDOM.createRoot(adminRoot).render(<TestApp />);
  } else {
    console.error('Admin root element not found');
  }
});