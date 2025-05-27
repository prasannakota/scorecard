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
        navigate('/assessment-form');
        setOpen(false);
    };

    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1">
                {/* 🔥 Show profile picture if available */}
                {user?.profile_picture ? (
                    <img
                        src={`${import.meta.env.APP_URL}/storage/${user.profile_picture}`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <User className="w-5 h-5" />
                )}
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
