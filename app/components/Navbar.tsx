"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../css/home.css';

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/logo-thalassa.png" alt="Logo" className="brand-logo-img" />
        <div className="brand-text">
          <span className="brand-name">Thalassa Sisterhood Group</span>
          <span className="brand-sub">Maritime Cargo System</span>
        </div>
      </div>
      <div className="navbar-links">
        <Link href="/" className={pathname === '/' ? 'active' : ''}>HOME</Link>
        <Link href="/services" className={pathname === '/services' ? 'active' : ''}>SERVICES</Link>
        <Link href="/fleet" className={pathname === '/fleet' ? 'active' : ''}>FLEET</Link>
        <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>CONTACT</Link>
      </div>
      <Link href="/login" className="btn-login-outline">LOG IN</Link>
    </nav>
  );
}
