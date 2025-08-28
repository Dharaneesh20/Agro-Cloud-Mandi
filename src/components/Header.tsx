import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-green-500">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">🌾 Agro Cloud Mandi</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">
              Home
            </Link>
            <Link to="/price-recommendations" className="text-gray-700 hover:text-green-600 font-medium">
              Price Recommendations
            </Link>
            <Link to="/mandi-locator" className="text-gray-700 hover:text-green-600 font-medium">
              Mandi Locator
            </Link>
            <Link to="/agro-mandi-locator" className="text-gray-700 hover:text-green-600 font-medium">
              Agro Mandi Locator
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-green-600 font-medium">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-green-600 font-medium">
                    {user.name}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                    <Link 
                      to={user.type === 'farmer' ? '/farmer-profile' : '/trader-profile'} 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
