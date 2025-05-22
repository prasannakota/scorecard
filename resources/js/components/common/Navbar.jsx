import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white shadow">
      <Link to="/react" className="font-bold text-xl text-white">
        <img
              src="https://cdn.prod.website-files.com/664c3c71d7e537047464d70b/664eb3db1955b085f0f26768_Kensium%20Solutions%20Horizontal%20%20logo-blue%201.avif"
              alt="Logo"
              className="w-32 h-32 object-contain"
            />
      </Link>
      <div className="flex gap-4">
        <Link to="/login" className="hover:text-gray-300">User Login</Link>
        <Link to="/admin-login" className="hover:text-gray-300">Admin Login</Link>
        <Link to="/register" className="hover:text-gray-300">Register</Link>
      </div>
    </nav>
  );
}
