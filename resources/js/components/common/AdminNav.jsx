import { Link } from 'react-router-dom';
import ProfileDropdown from '../profile/ProfileDropdown';

export default function AdminNav( ) {
    const isAuthenticated = sessionStorage.getItem('admin');

    return (
        <nav className="w-full bg-blue300 text-white py-4 px-4  md:px-8 shadow">
            <div className='container m-auto flex items-center justify-between'>
                <div className="flex items-center gap-4">
                    <Link to="/">
                        <img src="/images/kensiumlogo-blue.svg" alt="Logo" className="w-32 object-contain"
                        />
                    </Link>
                </div>
                <div className="flex items-center gap-1 md:gap-10">
                    {isAuthenticated && (
                        <div>
                            <ProfileDropdown />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
