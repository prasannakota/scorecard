import React from 'react';

const TestApp = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">React Admin Test</h1>
      <p className="text-gray-700 mb-4">
        If you can see this message, React is working correctly!
      </p>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        Success! The React application is loading properly.
      </div>
    </div>
  );
};

export default TestApp;