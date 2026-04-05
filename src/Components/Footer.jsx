// components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} BookStore Admin Panel</p>
      <p>Manage your collection with ease.</p>
    </footer>
  );
}

export default Footer;