import React, { useEffect, useState } from 'react';

const FlashMessage = () => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    // Check for Laravel flash messages
    const success = sessionStorage.getItem('flash_success');
    const error = sessionStorage.getItem('flash_error');

    if (success) {
      setMessage(success);
      setType('success');
      sessionStorage.removeItem('flash_success');
    } else if (error) {
      setMessage(error);
      setType('error');
      sessionStorage.removeItem('flash_error');
    }

    // Auto-hide after 5 seconds
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setType(null);
      }, 5000);

      return () => clearTimeout(timer);
    }

    // Also check for messages in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlMessage = urlParams.get('message');
    const urlType = urlParams.get('type');

    if (urlMessage && urlType) {
      setMessage(urlMessage);
      setType(urlType);
      // Remove message from URL
      const newUrl = window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }

    // Check for messages in localStorage as a fallback
    const localStorageSuccess = localStorage.getItem('flash_success');
    const localStorageError = localStorage.getItem('flash_error');

    if (localStorageSuccess) {
      setMessage(localStorageSuccess);
      setType('success');
      localStorage.removeItem('flash_success');
    } else if (localStorageError) {
      setMessage(localStorageError);
      setType('error');
      localStorage.removeItem('flash_error');
    }
  }, []); // Empty dependency array means this runs once on mount

  if (!message) return null;

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {message}
      <button 
        onClick={() => setMessage(null)}
        className="ml-2 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </div>
  );
};

export default FlashMessage;
