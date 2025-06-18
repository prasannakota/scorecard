import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
    const isAuthenticated = sessionStorage.getItem('admin');
    return isAuthenticated ? children : <Navigate to="/admin-dashboard" />;
}
