import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldAlert, KeyRound, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function AdminAuthModal({ isOpen, onClose }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (email.trim().toLowerCase() === 'amit.sir@maths.com' && pin === '2026') {
        login({
          name: 'Amit Sir',
          email: 'amit.sir@maths.com',
          role: 'teacher',
          isLoggedIn: true
        });
        setIsSubmitting(false);
        onClose();
      } else {
        setError('Unauthorized Admin Credentials. Please check your Email and Security PIN.');
        setIsSubmitting(false);
      }
    }, 1200);
  };

  const handleQuickDemoAdmin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      login({
        name: 'Amit Sir',
        email: 'amit.sir@maths.com',
        role: 'teacher',
        isLoggedIn: true
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card-glass" style={{ maxWidth: '420px', border: '1px solid rgba(125, 204, 173, 0.3)' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img 
            src="/logo.jpg" 
            alt="Amit Sir Coaching Logo" 
            style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              border: '2px solid var(--primary)',
              marginBottom: '16px',
              objectFit: 'cover',
              display: 'inline-block'
            }} 
          />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0' }}>Instructor Portal</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Authorized access only for Amit Sir Coaching console.</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            padding: '12px', 
            borderRadius: '8px', 
            color: 'var(--danger)', 
            fontSize: '0.8rem', 
            display: 'flex', 
            gap: '8px', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Admin Email</label>
            <input 
              type="email" 
              required 
              placeholder="amit.sir@maths.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input" 
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Security PIN</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                required 
                maxLength={6}
                placeholder="••••" 
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="form-input" 
                disabled={isSubmitting}
                style={{ letterSpacing: '0.4em' }}
              />
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Lock size={16} />
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', height: '46px', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Authorizing...</span>
              </>
            ) : (
              <>
                <span>Verify & Enter Console</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0 16px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>OR QUICK TESTING</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        <button 
          type="button"
          onClick={handleQuickDemoAdmin}
          className="btn btn-secondary" 
          style={{ 
            width: '100%', 
            height: '42px', 
            border: '1px dashed var(--primary)', 
            background: 'rgba(125, 204, 173, 0.05)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
          disabled={isSubmitting}
        >
          1-Click Instructor Login
        </button>

      </div>
    </div>
  );
}
