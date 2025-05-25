import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminLogin from '../pages/AdminLogin';
import Dashboard from '../pages/Dashboard';
import ForgotPassword from "../pages/ForgotPassword";

import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import PrivateRoute from '../routes/PrivateRoute';
import PublicRoute from '../routes/PublicRoute';

import AssessmentForm from '../components/assessment/AssessmentForm';
import DepartmentList from '../components/assessment/DepartmentList';

function AppContent() {
  const location = useLocation();

  const isAuthenticated = !!sessionStorage.getItem('authorization');
  const hideNavbarOn = ['/react'];
  const shouldShowNavbar = !hideNavbarOn.includes(location.pathname);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true); // Default to open
   const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar */}
       {shouldShowNavbar && <Navbar toggleSidebar={toggleSidebar} />}

      {/* Body layout with Sidebar and Main Content */}
      <div className="flex flex-1">
        {/* Sidebar always visible if authenticated */}
         {isAuthenticated && isSidebarOpen && <Sidebar />}

        {/* Main content area */}
        <main className="flex-1 p-6 mt-0"> 
          <Routes>
            {/* Public routes */}
            <Route path="/react" element={<PublicRoute><Home /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/admin-login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forget-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

            {/* Private routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/assessment-form" element={<PrivateRoute><AssessmentForm /></PrivateRoute>} />
            <Route path="/department" element={<PrivateRoute><DepartmentList /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
