import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Home, PhoneCall, Plus, User, Settings, LogOut, Search } from 'lucide-react';
import ProfileDropdown from '../profile/ProfileDropdown';

export default function Navbar({ toggleSidebar }) {
  const isAuthenticated = sessionStorage.getItem('authorization');

  return (
    <nav className="flex items-center justify-between bg-blue300 text-white py-4 px-8 shadow">
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6" />
          </button>
        )}
        <Link to="/">
          <img src="/images/kensiumlogo-blue.svg" alt="Logo" className="w-32 object-contain"
          />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-1 rounded bg-white text-black"
          />
          <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
        </div>

        {isAuthenticated && (
          <>
            <Link to="/" className="hover:text-gray-300 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link to="/get-advice" className="hover:text-gray-300 flex items-center gap-1">
              <PhoneCall className="w-4 h-4" />
              Get Advice
            </Link>
            <Link to="/add-user" className="hover:text-gray-300 flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Add User
            </Link>
            <ProfileDropdown />
          </>
        )}
      </div>
    </nav>
  );
}
