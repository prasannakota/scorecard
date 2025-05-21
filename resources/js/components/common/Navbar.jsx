import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-200 shadow">
      <Link to="/" className="font-bold text-xl">Home</Link>
      <div className="flex gap-4">
        <Link to="/login" className="text-blue-500">User Login</Link>
        <Link to="/admin-login" className="text-blue-500">Admin Login</Link>
        <Link to="/register" className="text-blue-500">Register</Link>
      </div>
    </nav>
  );
}
