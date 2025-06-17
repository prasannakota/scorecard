import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from '../lib/UserContext'; // Import UserContext
import FlashMessage from './common/FlashMessage';
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
import Footer from '../components/common/Footer';

import AssessmentForm from '../components/assessment/AssessmentForm';
import DepartmentList from '../components/assessment/DepartmentList';
import AssessmentScreen from '../components/assessment/AssessmentScreen';
import GetAdvice from "../pages/GetAdvice";
import AddUser from "../pages/AddUser";
import FeedBack from "../pages/FeedBack";
import ManageQuestions from '../pages/ManageQuestions';
import Department from '../pages/Department';
import ProfileForm from '../components/profile/ProfileForm';

function AppContent() {
    const location = useLocation();
    const isAuthenticated = !!sessionStorage.getItem('authorization');
    const hideNavbarOn = ['/'];
    const shouldShowNavbar = !hideNavbarOn.includes(location.pathname);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Flash Messages */}
            <FlashMessage />

            {/* Top navbar */}
            {shouldShowNavbar && <Navbar toggleSidebar={toggleSidebar} />}

            {/* Body layout with Sidebar and Main Content */}
            <div className="flex flex-1">
                {/* Sidebar always visible if authenticated */}
                {isAuthenticated && isSidebarOpen && <Sidebar />}

                {/* Main content area */}
                <main className="flex-1 main-wrapper">
                    {/* Public routes */}
                    <Routes>
                        <Route path="/" element={
                            <PublicRoute>
                              <>
                                  <FlashMessage />
                                  <Home />
                              </>
                            </PublicRoute>
                        } />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/admin-login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="/forget-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                        <Route path="/admin/manage-questions" element={<PublicRoute><ManageQuestions /></PublicRoute>}/>
                        <Route path="/admin/add-department" element={<PublicRoute><Department /></PublicRoute>} />

                        {/* Private routes */}
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/assessment-form" element={<PrivateRoute><AssessmentForm /></PrivateRoute>} />
                        <Route path="/department" element={<PrivateRoute><DepartmentList /></PrivateRoute>} />
                        <Route path="/assessment/start" element={<PrivateRoute><AssessmentScreen /></PrivateRoute>} />
                        <Route path="/get-advice" element={<PrivateRoute><GetAdvice /></PrivateRoute>} />
                        <Route path="/feedback" element={<PrivateRoute><FeedBack /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><ProfileForm /></PrivateRoute>} />
                        <Route path="/add-user" element={<PrivateRoute><AddUser /></PrivateRoute>}/>
                    </Routes>
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <UserProvider>
                <AppContent />
            </UserProvider>
        </Router>
    );
}
