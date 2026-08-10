import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Phone, Lock, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login } = useApp();
  const [authMethod, setAuthMethod] = useState('google'); // 'google' | 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  // Timer countdown for OTP
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setShowGoogleChooser(true);
  };

  const selectGoogleAccount = (name, email) => {
    setIsSubmitting(true);
    setTimeout(() => {
      login({
        name,
        email,
        role: 'student',
        method: 'google',
        isLoggedIn: true
      });
      setIsSubmitting(false);
      setShowGoogleChooser(false);
      onClose();
    }, 800);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setOtpSent(true);
      setTimer(30);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode !== '123456' && otpCode.length > 0) {
      alert("Invalid OTP! Try using the default code '123456'.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      login({
        name: `User ${phoneNumber.slice(-4)}`,
        email: `student-${phoneNumber.slice(-4)}@amitsircoaching.com`,
        phone: phoneNumber,
        role: 'student',
        method: 'otp',
        isLoggedIn: true
      });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const resetOtpFlow = () => {
    setOtpSent(false);
    setOtpCode('');
  };

  return (
    <div className="modal-overlay">
      {showGoogleChooser ? (
        <div className="modal-content card-glass" style={{ maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
              alt="Google" 
              style={{ width: '40px', height: '40px', marginBottom: '12px' }} 
            />
            <h3 style={{ fontSize: '1.25rem' }}>Choose an account</h3>
            <p style={{ fontSize: '0.85rem' }}>to continue to Amit Sir Coaching</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div 
              onClick={() => selectGoogleAccount('Sourav Sen', 'sourav.sen@gmail.com')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'background 0.2s'
              }}
              className="google-account-item"
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>S</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sourav Sen</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>sourav.sen@gmail.com</div>
              </div>
            </div>

            <div 
              onClick={() => selectGoogleAccount('Amit Verma', 'amit.verma99@gmail.com')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'background 0.2s'
              }}
              className="google-account-item"
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>A</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Amit Verma</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>amit.verma99@gmail.com</div>
              </div>
            </div>

            <button 
              onClick={() => setShowGoogleChooser(false)}
              className="btn btn-secondary" 
              style={{ marginTop: '12px', width: '100%' }}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      ) : (
        <div className="modal-content card-glass">
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Welcome Back</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Start boosting your mathematics score today.</p>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px', marginBottom: '24px' }}>
            <button 
              className={`dev-toggle-btn ${authMethod === 'google' ? 'active' : ''}`}
              style={{ flex: 1, padding: '10px' }}
              onClick={() => setAuthMethod('google')}
            >
              Google Login
            </button>
            <button 
              className={`dev-toggle-btn ${authMethod === 'otp' ? 'active' : ''}`}
              style={{ flex: 1, padding: '10px' }}
              onClick={() => setAuthMethod('otp')}
            >
              OTP Login
            </button>
          </div>

          {authMethod === 'google' ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '24px', fontSize: '0.9rem' }}>
                Sign in instantly using your Google account to access all your courses, doubt sessions, and bookmarks.
              </p>
              <button 
                onClick={handleGoogleLogin} 
                className="btn btn-secondary" 
                style={{ width: '100%', display: 'flex', gap: '12px', justifyContent: 'center', height: '48px', alignItems: 'center' }}
                disabled={isSubmitting}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                  alt="Google" 
                  style={{ width: '20px', height: '20px' }} 
                />
                <span style={{ fontWeight: 600 }}>{isSubmitting ? 'Connecting...' : 'Continue with Google'}</span>
              </button>
            </div>
          ) : (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp}>
                  <div className="form-group">
                    <label className="form-label">Enter Mobile Number</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem' }}>+91</span>
                      <input 
                        type="tel" 
                        required 
                        maxLength={10}
                        pattern="[0-9]{10}"
                        placeholder="9876543210" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        className="form-input" 
                        style={{ paddingLeft: '56px' }}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', height: '48px', marginTop: '8px' }}
                    disabled={isSubmitting || phoneNumber.length !== 10}
                  >
                    <span>{isSubmitting ? 'Sending OTP...' : 'Send Verification Code'}</span>
                    <ChevronRight size={18} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                      <CheckCircle2 className="text-success" size={18} style={{ color: '#10b981' }} />
                      <span style={{ fontSize: '0.8rem', color: '#10b981' }}>OTP sent to +91 {phoneNumber}. Use code <strong>123456</strong>.</span>
                    </div>

                    <label className="form-label">Enter 6-Digit OTP</label>
                    <input 
                      type="text" 
                      required 
                      maxLength={6}
                      placeholder="Enter verification code" 
                      value={otpCode} 
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="form-input" 
                      style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem', fontWeight: 'bold' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <button 
                      type="button" 
                      onClick={resetOtpFlow} 
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      Change Number
                    </button>

                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {timer > 0 ? `Resend OTP in ${timer}s` : (
                        <button 
                          type="button" 
                          onClick={() => { setTimer(30); }}
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Resend OTP
                        </button>
                      )}
                    </span>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', height: '48px' }}
                    disabled={isSubmitting || otpCode.length !== 6}
                  >
                    <span>{isSubmitting ? 'Verifying...' : 'Verify & Continue'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick Demo Login Option */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0 16px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>OR TRY OUT</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          </div>

          <button 
            type="button"
            onClick={() => {
              login({
                name: 'Demo Student',
                email: 'demo.student@amitsircoaching.com',
                role: 'student',
                method: 'demo',
                isLoggedIn: true
              });
              onClose();
            }}
            className="btn btn-secondary" 
            style={{ 
              width: '100%', 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'center', 
              height: '44px', 
              alignItems: 'center', 
              border: '1px dashed var(--primary)',
              background: 'rgba(125, 204, 173, 0.05)',
              color: 'var(--text-primary)'
            }}
          >
            <span>Sign In as Demo Student (1-Click)</span>
          </button>
        </div>
      )}
    </div>
  );
}
