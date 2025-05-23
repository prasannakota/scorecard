import { useState } from 'react';
import { Settings, LogOut, User } from 'lucide-react';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/react';
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1">
        <User className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow z-10">
          <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
