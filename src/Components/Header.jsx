// components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/"><img src=""/>BookStore</Link>
      </div>
      <nav>
        <ul className="nav-links">
          {/* This matches the 'path' you set in Main.jsx */}
           <li><Link to="/">Home</Link></li>
           <li><Link to="/add">Add Book</Link></li>
          <li><Link to="/display">View books</Link></li>        
        </ul>
      </nav>
    </header>
  );
}

export default Header;