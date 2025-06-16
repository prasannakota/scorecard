import { useState, useEffect } from 'react';
import { Settings, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileDropdown() {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('user')); // or use getUserFromSession()
        setUser(userData);
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/';
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setOpen(false);
    };

    return (
        <div className="relative p-2 rounded-full hidden sm:flex bg-white">
            <button onClick={() => setOpen(!open)} className="flex items-center gap-2">
                {/* 🔥 Show profile picture if available */}
                {user?.profile_picture ? (
                    <img
                        //src={`${import.meta.env.VITE_BACKEND_URL}/storage/${user.profile_picture}`}
                        src="/images/profile_placeholder.png" 
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    
                ) : (
                    <span className='rounded-full border border-dark100'><img src="/images/profile_placeholder.png"   alt={user?.name} /></span>
                )}
                <span className="text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                    <mask id="mask0_2735_7276" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="17" height="18">
                        <rect y="0.5" width="17" height="17" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_2735_7276)">
                        <path d="M8.50016 11.1249L4.9585 7.58325H12.0418L8.50016 11.1249Z" fill="#444748" />
                    </g>
                    </svg>
                </span>
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow z-10">
                    <button
                        onClick={handleProfileClick}
                        className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                    >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                    </button>
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
