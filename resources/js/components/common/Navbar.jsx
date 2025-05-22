import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white shadow">
      <Link to="/react" className="font-bold text-xl text-white">
        E-commerce Scorecard
      </Link>
      <div className="flex gap-4">
        <Link to="/login" className="hover:text-gray-300">User Login</Link>
        <Link to="/admin-login" className="hover:text-gray-300">Admin Login</Link>
        <Link to="/register" className="hover:text-gray-300">Register</Link>
      </div>
    </nav>
  );
}
