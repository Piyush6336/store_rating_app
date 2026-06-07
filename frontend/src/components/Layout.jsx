import React from 'react';
import { KeyRound, LogOut, Store } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';

export default function Layout({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <Store size={22} />
          <span>Store Ratings</span>
        </Link>
        <div className="topbar-actions">
          <span className="user-chip">{user?.name}</span>
          <Link className="icon-button" title="Change password" to="/password">
            <KeyRound size={18} />
          </Link>
          <button className="icon-button" title="Logout" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <main className="page">
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
