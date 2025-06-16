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
        <div className="relative hidden sm:flex">
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-4 py-2 rounded bg-transparent border border-dark100 hover:border-dark100 focus:border-dark100 focus-visible:border-dark100  text-white100 md:w-[500px]"
          />
          <Search className="absolute left-2 top-3 h-4 w-4 text-white100" />
        </div>
      <div className="flex items-center gap-1 md:gap-10">
        {isAuthenticated && (
          <>
            <Link to="/" className="text-white hover:text-gray-300  items-center gap-2 text-sm hidden sm:flex">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link to="/get-advice" className="text-white hover:text-gray-300 hidden sm:flex items-center gap-2 text-sm">
              <PhoneCall className="w-4 h-4" />
              Get Advice
            </Link>
            <Link to="/add-user" className="text-white hover:text-gray-300 p-3 border border-white hover:border-dark100 rounded-md flex items-center gap-2 text-sm">
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
