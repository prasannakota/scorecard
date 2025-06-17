import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Debug information
console.log('AdminApp.jsx - Importing components');

// Import components with error handling
let AdminLayout, Dashboard, UserManagement, UserForm, 
    DepartmentList, DepartmentForm, QuestionList, QuestionForm,
    EmailTemplates, EmailTemplateForm, MailSettings, EmailLogs, NotFound;

try {
    AdminLayout = require('./layouts/AdminLayout').default;
    console.log('AdminLayout imported successfully');
} catch (error) {
    console.error('Error importing AdminLayout:', error);
    AdminLayout = () => <div>Error loading AdminLayout</div>;
}

try {
    Dashboard = require('./pages/Dashboard').default;
    console.log('Dashboard imported successfully');
} catch (error) {
    console.error('Error importing Dashboard:', error);
    Dashboard = () => <div>Error loading Dashboard</div>;
}

try {
    UserManagement = require('./pages/UserManagement').default;
    console.log('UserManagement imported successfully');
} catch (error) {
    console.error('Error importing UserManagement:', error);
    UserManagement = () => <div>Error loading UserManagement</div>;
}

try {
    UserForm = require('./pages/UserForm').default;
    console.log('UserForm imported successfully');
} catch (error) {
    console.error('Error importing UserForm:', error);
    UserForm = () => <div>Error loading UserForm</div>;
}

try {
    DepartmentList = require('./pages/DepartmentList').default;
    console.log('DepartmentList imported successfully');
} catch (error) {
    console.error('Error importing DepartmentList:', error);
    DepartmentList = () => <div>Error loading DepartmentList</div>;
}

try {
    DepartmentForm = require('./pages/DepartmentForm').default;
    console.log('DepartmentForm imported successfully');
} catch (error) {
    console.error('Error importing DepartmentForm:', error);
    DepartmentForm = () => <div>Error loading DepartmentForm</div>;
}

try {
    QuestionList = require('./pages/QuestionList').default;
    console.log('QuestionList imported successfully');
} catch (error) {
    console.error('Error importing QuestionList:', error);
    QuestionList = () => <div>Error loading QuestionList</div>;
}

try {
    QuestionForm = require('./pages/QuestionForm').default;
    console.log('QuestionForm imported successfully');
} catch (error) {
    console.error('Error importing QuestionForm:', error);
    QuestionForm = () => <div>Error loading QuestionForm</div>;
}

try {
    EmailTemplates = require('./pages/EmailTemplates').default;
    console.log('EmailTemplates imported successfully');
} catch (error) {
    console.error('Error importing EmailTemplates:', error);
    EmailTemplates = () => <div>Error loading EmailTemplates</div>;
}

try {
    EmailTemplateForm = require('./pages/EmailTemplateForm').default;
    console.log('EmailTemplateForm imported successfully');
} catch (error) {
    console.error('Error importing EmailTemplateForm:', error);
    EmailTemplateForm = () => <div>Error loading EmailTemplateForm</div>;
}

try {
    MailSettings = require('./pages/MailSettings').default;
    console.log('MailSettings imported successfully');
} catch (error) {
    console.error('Error importing MailSettings:', error);
    MailSettings = () => <div>Error loading MailSettings</div>;
}

try {
    EmailLogs = require('./pages/EmailLogs').default;
    console.log('EmailLogs imported successfully');
} catch (error) {
    console.error('Error importing EmailLogs:', error);
    EmailLogs = () => <div>Error loading EmailLogs</div>;
}

try {
    NotFound = require('./pages/NotFound').default;
    console.log('NotFound imported successfully');
} catch (error) {
    console.error('Error importing NotFound:', error);
    NotFound = () => <div>Error loading NotFound</div>;
}

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        // We'll use the existing Laravel session for authentication
        // This assumes you're already logged in through Laravel's auth system
        const response = await fetch('/api/admin/check-auth', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          credentials: 'include', // Important for cookies/session
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <Router basename="/admin">
      <Routes>
        {isAuthenticated ? (
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* User Management Routes */}
            <Route path="/users" element={<UserManagement />} />
            <Route path="/users/create" element={<UserForm />} />
            <Route path="/users/:id/edit" element={<UserForm />} />
            
            {/* Department Routes */}
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/departments/create" element={<DepartmentForm />} />
            <Route path="/departments/:id/edit" element={<DepartmentForm />} />
            
            {/* Question Routes */}
            <Route path="/departments/:departmentId/questions" element={<QuestionList />} />
            <Route path="/departments/:departmentId/questions/create" element={<QuestionForm />} />
            <Route path="/departments/:departmentId/questions/:id/edit" element={<QuestionForm />} />
            
            {/* Email Management Routes */}
            <Route path="/email-templates" element={<EmailTemplates />} />
            <Route path="/email-templates/create" element={<EmailTemplateForm />} />
            <Route path="/email-templates/:id/edit" element={<EmailTemplateForm />} />
            <Route path="/mail-settings" element={<MailSettings />} />
            <Route path="/email-logs" element={<EmailLogs />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        ) : (
          // If not authenticated, we don't render anything as the Laravel login page will be shown
          <Route path="*" element={null} />
        )}
      </Routes>
    </Router>
  );
};

export default AdminApp;