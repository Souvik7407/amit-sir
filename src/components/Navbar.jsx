import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, User, BookOpen, KeyRound } from 'lucide-react';

export default function Navbar({ onOpenAuth, onOpenAdminAuth }) {
  const { user, logout } = useApp();

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); }} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="/logo.jpg" 
            alt="Pillars Coaching Classes Logo" 
            style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '50%', 
              border: '2px solid var(--primary)',
              objectFit: 'cover'
            }} 
          />
          <span style={{ fontWeight: 800 }}>Pillars Coaching Classes</span>
        </a>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div className="user-widget">
              <span className="avatar" style={{ background: user.role === 'teacher' ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}>
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {user.role === 'teacher' ? 'Amit Sir' : user.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {user.role === 'teacher' ? 'Instructor (Admin)' : 'Student'}
                </span>
              </div>
              <button 
                onClick={logout} 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', gap: '4px', alignItems: 'center' }}
                title="Logout"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={onOpenAdminAuth} 
                className="btn btn-secondary"
                style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <KeyRound size={14} />
                <span>Instructor Portal</span>
              </button>
              <button onClick={onOpenAuth} className="btn btn-primary" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <User size={16} />
                <span>Student Sign In</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
