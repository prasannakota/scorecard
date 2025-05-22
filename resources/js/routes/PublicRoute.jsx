import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('authorization');
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
}
