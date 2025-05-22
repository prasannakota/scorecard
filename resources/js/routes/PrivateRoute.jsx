import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('authorization');
  return isAuthenticated ? children : <Navigate to="/react" />;
}
