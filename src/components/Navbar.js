import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; 
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Task Manager</h2>
        <button className="mobile-menu-icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      <ul className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/tasks" className="navbar-link" onClick={handleMenuClose}>Tasks</Link>
        </li>
        {localStorage.getItem('token') ? (
          <li>
            <button onClick={() => { logout(); handleMenuClose(); }} className="navbar-button">Logout</button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login" className="navbar-link" onClick={handleMenuClose}>Login</Link>
            </li>
            <li>
              <Link to="/" className="navbar-link" onClick={handleMenuClose}>Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
