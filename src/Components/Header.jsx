// components/Header.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../logo32.jpeg";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Book Store logo" className="logo-image" />
          <span>BookStore</span>
        </Link>
      </div>

      <button
        type="button"
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          
          {/* ✅ Conditional method */}
          {location.pathname !== "/" ? (
            <li>
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>
          ) : null}

          <li>
            <Link to="/add" onClick={closeMenu}>Add Book</Link>
          </li>

          <li>
            <Link to="/display" onClick={closeMenu}>View Books</Link>
          </li>

        </ul>
      </nav>
    </header>
  );
}

export default Header;