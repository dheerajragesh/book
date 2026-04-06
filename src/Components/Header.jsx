// components/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/"><img src=""/>BookStore</Link>
      </div>
      <button
        type="button"
        className="menu-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav>
        <ul id="primary-navigation" className={`nav-links ${menuOpen ? "open" : ""}`}>
          {/* This matches the 'path' you set in Main.jsx */}
           <li><Link to="/" onClick={closeMenu}>Home</Link></li>
           <li><Link to="/add" onClick={closeMenu}>Add Book</Link></li>
          <li><Link to="/display" onClick={closeMenu}>View books</Link></li>        
        </ul>
      </nav>
    </header>
  );
}

export default Header;
