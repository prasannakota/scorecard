import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from '../lib/UserContext'; // Import UserContext
import FlashMessage from './common/FlashMessage';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
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
import Department from '../pages/Admin/DashBoard/Department';
import ProfileForm from '../components/profile/ProfileForm';
import SocialLoginRedirect from "../routes/SocialLoginRedirect";
import AdminDashBoard from "../pages/Admin/DashBoard/AdminDashBoard";
import AdminLogin from "../pages/Admin/Auth/adminlogin";
import AdminRoute from "../routes/AdminRoute";
import AdminNav from "./common/AdminNav";
import ResetUserPassword from "../pages/ResetUserPassword.jsx";
import UserDashBoard from "../pages/Admin/DashBoard/UserDashBoard";
import AdminIndustries from "../pages/Admin/DashBoard/AdminIndustries";

function AppContent() {
    const location = useLocation();
    const isAuthenticated = !!sessionStorage.getItem('authorization');
    const user = sessionStorage.getItem('user');
    const admin = sessionStorage.getItem('admin');
    const hideNavbarOn = ['/'];
    const shouldShowNavbar = !hideNavbarOn.includes(location.pathname);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const pageSlug = location.pathname
    .replace(/^\/|\/$/g, '')     // remove leading/trailing slashes
    .replace(/[^a-zA-Z0-9]/g, '-') // replace non-alphanum with dash
    .toLowerCase();

  const pageClass = pageSlug ? `page-${pageSlug}` : 'page-home';
    return (
        <div className={`min-h-screen flex flex-col ${pageClass}`}>
            {/* Flash Messages */}
            <FlashMessage />

            {/* Top navbar */}
            {shouldShowNavbar && (
                user ? <Navbar toggleSidebar={toggleSidebar} /> :
                    admin ? <AdminNav toggleSidebar={toggleSidebar} /> : null
            )}

            {/* Body layout with Sidebar and Main Content */}
            <div className="flex flex-1">
                {/* Sidebar always visible if authenticated */}

                {isAuthenticated && isSidebarOpen && user && <Sidebar />}

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
                        <Route path="/social-login" element={<PublicRoute><SocialLoginRedirect /></PublicRoute>} />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="/forget-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                        <Route path="/admin/manage-questions" element={<PublicRoute><ManageQuestions /></PublicRoute>}/>
                        <Route path="/admin/add-department" element={<PublicRoute><Department /></PublicRoute>} />
                        <Route path="/user-password/reset/:token" element={<PublicRoute><ResetUserPassword /></PublicRoute>} />

                        {/* Private routes */}
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/assessment-form" element={<PrivateRoute><AssessmentForm /></PrivateRoute>} />
                        <Route path="/department" element={<PrivateRoute><DepartmentList /></PrivateRoute>} />
                        <Route path="/assessment/start" element={<PrivateRoute><AssessmentScreen /></PrivateRoute>} />
                        <Route path="/get-advice" element={<PrivateRoute><GetAdvice /></PrivateRoute>} />
                        <Route path="/feedback" element={<PrivateRoute><FeedBack /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><ProfileForm /></PrivateRoute>} />
                        <Route path="/add-user" element={<PrivateRoute><AddUser /></PrivateRoute>}/>

                        {/* Admin Routes */}
                        <Route path="/admin-login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
                        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashBoard /></AdminRoute>} />
                        <Route path="/admin-departments" element={<AdminRoute><Department /></AdminRoute>} />
                        <Route path="/admin-users" element={<AdminRoute><UserDashBoard /></AdminRoute>} />
                        <Route path="/admin-settings" element={<AdminRoute><Department /></AdminRoute>} />
                        <Route path="/admin-assessments" element={<AdminRoute><Department /></AdminRoute>} />
                        <Route path="/admin-industries" element={<AdminRoute><AdminIndustries /></AdminRoute>} />
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
