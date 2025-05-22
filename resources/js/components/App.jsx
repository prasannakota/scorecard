import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminLogin from '../pages/AdminLogin';
import Dashboard from '../pages/Dashboard';
import Navbar from '../components/common/Navbar';
import PrivateRoute from '../routes/PrivateRoute';
import ForgotPassword from "../pages/ForgotPassword";

function AppContent() {
  const location = useLocation();
  const hideNavbarOn = ['/react'];
  const shouldShowNavbar = !hideNavbarOn.includes(location.pathname);
  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/react" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
