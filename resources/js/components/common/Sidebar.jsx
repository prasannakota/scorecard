import { Link } from 'react-router-dom';
import { LayoutDashboard, Trophy, Book, FileText, PhoneCall, MessageCircle, LogOut } from 'lucide-react';

export default function Sidebar() {
  const isAuthenticated = sessionStorage.getItem('authorization');
  const isAdmin = sessionStorage.getItem('role') === 'admin';
  if (!isAuthenticated) return null;

  return (
    <aside className="w-64 bg-neutral90 text-neutral50 dvh-full pt-6 flex flex-col justify-between shadow-md pb-6">
      <nav className="flex flex-col">
        <Link to="/dashboard" className="flex items-center gap-2 text-neutral50 hover:bg-black hover:text-white px-8 py-4">
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/my-scoreboard" className="flex items-center gap-2  text-neutral50 hover:bg-black hover:text-white px-8 py-4">
          <Trophy size={18} /> My Scoreboard
        </Link>
        <Link to="/methodology" className="flex items-center gap-2  text-neutral50 hover:bg-black hover:text-white px-8 py-4">
          <Book size={18} /> Methodology
        </Link>
        <Link to="/resources" className="flex items-center gap-2  text-neutral50 hover:bg-black hover:text-white px-8 py-4">
          <FileText size={18} /> Resources
        </Link>
        <Link to="/get-advice" className="flex items-center gap-2  text-neutral50 hover:bg-black hover:text-white px-8 py-4">
          <PhoneCall size={18} /> Get Advice
        </Link>
        <Link to="/feedback" className="flex items-center gap-2  text-neutral50 hover:bg-black hover:text-white px-8 py-4">
          <MessageCircle size={18} /> Feedback
        </Link>
      </nav>

      <div className="mt-auto p-4 border-t border-gray-700  text-neutral50 hover:bg-black hover:text-white px-8 py-4">
        <button
          onClick={() => {
            sessionStorage.clear();
            window.location.href = '/';
          }}
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
