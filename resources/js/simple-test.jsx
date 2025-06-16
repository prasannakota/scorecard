import React from 'react';
import { createRoot } from 'react-dom/client';

// Super simple component with no dependencies
const App = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: 'blue' }}>React Test Page</h1>
      <p>If you can see this, React is working correctly!</p>
      <button 
        onClick={() => alert('Simple test button clicked!')}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: 'green', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Test Button
      </button>
    </div>
  );
};

// Simple initialization with console logs
console.log('Simple test script loaded with React 19 compatibility');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded in simple-test.jsx');
  const rootElement = document.getElementById('app');
  console.log('Root element found:', !!rootElement);

  if (rootElement) {
    try {
      console.log('Creating React root');
      // Clear any existing content
      rootElement.innerHTML = '';
      // Use createRoot API for React 19
      const root = createRoot(rootElement);
      console.log('Rendering App component');
      root.render(<App />);
      console.log('App rendered successfully');
    } catch (error) {
      console.error('Error rendering App:', error);
      rootElement.innerHTML = `
        <div style="color: red; padding: 20px; border: 1px solid red;">
          <h3>Error Rendering React</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  } else {
    console.error('Root element not found');
  }
});