import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHandHoldingHeart, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardLink = () => {
    if (!user) return '/login';
    return `/${user.role}`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-light/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaHandHoldingHeart className="text-primary text-2xl" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                FoodBridge
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="hover:text-primary px-3 py-2 transition-colors">Home</Link>
              {user ? (
                <>
                  <Link to={dashboardLink()} className="hover:text-primary px-3 py-2 transition-colors">Dashboard</Link>
                  <div className="flex items-center space-x-4 ml-4">
                    <span className="text-sm text-gray-400">Welcome, {user.name}</span>
                    <button 
                      onClick={handleLogout}
                      className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-primary px-3 py-2 transition-colors">Login</Link>
                  <Link 
                    to="/register" 
                    className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-light border-b border-white/10 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block px-3 py-2 hover:bg-dark rounded-md">Home</Link>
          {user ? (
            <>
              <Link to={dashboardLink()} className="block px-3 py-2 hover:bg-dark rounded-md">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 hover:bg-dark rounded-md text-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 hover:bg-dark rounded-md">Login</Link>
              <Link to="/register" className="block px-3 py-2 hover:bg-dark rounded-md text-primary">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
