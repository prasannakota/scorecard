import { Link } from 'react-router-dom';

export default function GuestNavbar({ toggleSidebar }) {
    return (
        <nav className="w-full bg-blue300 text-white py-4 px-4  md:px-8 shadow">
            <div className='container m-auto flex items-center justify-between'>
                <div className="flex items-center gap-4">
                    <Link to="/">
                        <img src="/images/kensiumlogo-blue.svg" alt="Logo" className="w-32 object-contain"
                        />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
