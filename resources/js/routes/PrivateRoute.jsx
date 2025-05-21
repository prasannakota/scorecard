import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('auth'); // simplistic auth check
  return isAuthenticated ? children : <Navigate to="/login" />;
}
