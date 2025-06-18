import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  if (location.pathname === '/') {
    return null;
  }

  return (
    <footer className="bg-blue300 text-white px-4 p-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between gap-6">
        <div className="text-sm flex items-start flex-col gap-2">
          <div>
            <Link to="/">
              <img
                src="/images/kensiumlogo-blue.svg"
                alt="Logo"
                className="w-32 object-contain"
              />
            </Link>
          </div>
          
        </div>
        <div>
          <ul className="text-sm md:text-base flex flex-wrap gap-4">
            <li>
              <a
                className="hover:underline hover:text-gray-300"
                href="/policies"
              >
                Policies
              </a>
            </li>
            <li>
              <a
                className="hover:underline hover:text-gray-300"
                href="/privacy-policy"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                className="hover:underline hover:text-gray-300"
                href="/terms-of-use"
              >
                Terms of Use
              </a>
            </li>
            <li>
              <a
                className="hover:underline hover:text-gray-300"
                href="/contact-us"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        </div>
         <div className="container m-auto flex mt-4  border-t border-white100  sm:border-0 pt-4 md:pt-0">
            <div className="text-sm md:text-base">2025 Kensium, All rights reserved.</div>
         </div>
      
    </footer>
  );
};

export default Footer;
