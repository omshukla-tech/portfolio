import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>&copy; {currentYear} Om Shukla. Crafted with passion, code, and precision.</p>
    </footer>
  );
}
