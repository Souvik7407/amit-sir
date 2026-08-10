import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CreditCard, QrCode, ShieldCheck, Loader2, Tag, Ticket, Check } from 'lucide-react';

export default function PaymentModal({ course, isOpen, onClose, onSuccess }) {
  const { enrollInCourse } = useApp();
  const [payMethod, setPayMethod] = useState('upi'); // 'upi' | 'card'
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Card states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Coupon states
  const [couponInput, setCouponInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen || !course) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    
    if (code === 'MATHS50') {
      const discount = Math.round(course.price * 0.50);
      setDiscountAmount(discount);
      setAppliedCoupon('MATHS50');
      setCouponSuccess('Success! 50% discount has been applied.');
    } else if (code === 'JEE2026') {
      const discount = Math.round(course.price * 0.20);
      setDiscountAmount(discount);
      setAppliedCoupon('JEE2026');
      setCouponSuccess('Success! 20% JEE Prep discount has been applied.');
    } else if (code === 'AMITSIR') {
      const discount = Math.min(500, course.price);
      setDiscountAmount(discount);
      setAppliedCoupon('AMITSIR');
      setCouponSuccess('Success! Flat ₹500 discount has been applied.');
    } else {
      setCouponError('Invalid Coupon Code! Try MATHS50, JEE2026, or AMITSIR.');
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon('');
    setCouponInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate transaction delay
    setTimeout(() => {
      enrollInCourse(course.id);
      setIsProcessing(false);
      onSuccess();
      onClose();
    }, 2000);
  };

  const finalPayable = course.price - discountAmount;

  return (
    <div className="modal-overlay">
      <div className="modal-content card-glass" style={{ maxWidth: '500px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Checkout Gateway
          </span>
          <h2 style={{ fontSize: '1.5rem', marginTop: '4px' }}>Secure Enrollment</h2>
          
          {/* Detailed Course & Price Summary */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)',
            marginTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{course.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Lifetime Classroom Access</div>
              </div>
            </div>
            
            <div style={{ borderTop: '1px dotted var(--border-color)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              {course.originalPrice && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Actual Course Price</span>
                    <span style={{ textDecoration: 'line-through' }}>₹{course.originalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                    <span>Batch Special Discount</span>
                    <span>-₹{(course.originalPrice - course.price).toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <span>Subtotal Offer Price</span>
                <span>₹{course.price.toLocaleString('en-IN')}</span>
              </div>
              
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Ticket size={12} />
                    <span>Coupon ({appliedCoupon})</span>
                  </span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                <span>Amount Payable</span>
                <span style={{ color: 'var(--primary)' }}>₹{finalPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {isProcessing ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px 0',
            gap: '16px'
          }}>
            <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Verifying Transaction...</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Please do not close this window or press the back button.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Coupon Code Section */}
            <div style={{ marginBottom: '24px', background: 'rgba(0,0,0,0.02)', border: '1px dashed var(--border-color)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>
                <Tag size={12} />
                <span>Promo Coupon Code</span>
              </div>

              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Try MATHS50, JEE2026, AMITSIR" 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="form-input" 
                    style={{ padding: '8px 12px', fontSize: '0.85rem', textTransform: 'uppercase' }}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '8px 12px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
                    <Check size={14} />
                    <span>Coupon <strong>{appliedCoupon}</strong> Applied</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleRemoveCoupon} 
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '6px', fontWeight: 600 }}>{couponError}</div>
              )}
              {couponSuccess && !appliedCoupon && (
                <div style={{ color: 'var(--success)', fontSize: '0.75rem', marginTop: '6px', fontWeight: 600 }}>{couponSuccess}</div>
              )}
            </div>

            {/* Tab Switcher */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', padding: '4px', borderRadius: '10px', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
              <button 
                className={`dev-toggle-btn ${payMethod === 'upi' ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}
                onClick={() => setPayMethod('upi')}
              >
                <QrCode size={16} />
                <span>UPI / QR Scan</span>
              </button>
              <button 
                className={`dev-toggle-btn ${payMethod === 'card' ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}
                onClick={() => setPayMethod('card')}
              >
                <CreditCard size={16} />
                <span>Debit/Credit Card</span>
              </button>
            </div>

            {payMethod === 'upi' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem' }}>Scan the QR Code using any UPI application (GPay, PhonePe, Paytm, BHIM) to pay.</p>
                
                {/* Simulated QR Code SVG */}
                <div style={{ 
                  background: 'white', 
                  padding: '16px', 
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  border: '3px solid var(--primary)',
                  display: 'inline-block'
                }}>
                  <svg width="180" height="180" viewBox="0 0 100 100" style={{ display: 'block' }}>
                    {/* Anchor boxes */}
                    <rect x="0" y="0" width="25" height="25" fill="#080b11" />
                    <rect x="3" y="3" width="19" height="19" fill="white" />
                    <rect x="7" y="7" width="11" height="11" fill="#6366f1" />

                    <rect x="75" y="0" width="25" height="25" fill="#080b11" />
                    <rect x="78" y="3" width="19" height="19" fill="white" />
                    <rect x="82" y="7" width="11" height="11" fill="#6366f1" />

                    <rect x="0" y="75" width="25" height="25" fill="#080b11" />
                    <rect x="3" y="78" width="19" height="19" fill="white" />
                    <rect x="7" y="82" width="11" height="11" fill="#6366f1" />

                    {/* QR Code details */}
                    <rect x="35" y="5" width="10" height="10" fill="#080b11" />
                    <rect x="55" y="10" width="15" height="5" fill="#080b11" />
                    <rect x="40" y="20" width="5" height="15" fill="#080b11" />
                    <rect x="10" y="35" width="20" height="5" fill="#080b11" />
                    <rect x="0" y="50" width="15" height="15" fill="#080b11" />
                    <rect x="25" y="50" width="15" height="10" fill="#080b11" />
                    <rect x="30" y="65" width="20" height="15" fill="#080b11" />
                    <rect x="60" y="30" width="30" height="10" fill="#080b11" />
                    <rect x="55" y="45" width="10" height="25" fill="#080b11" />
                    <rect x="75" y="50" width="20" height="20" fill="#080b11" />
                    <rect x="80" y="80" width="15" height="15" fill="#080b11" />
                    <rect x="60" y="80" width="10" height="5" fill="#080b11" />
                    <rect x="55" y="90" width="15" height="10" fill="#080b11" />
                  </svg>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Merchant ID: <strong>amitsircoaching@ybl</strong>
                </div>

                <button 
                  onClick={handlePaymentSubmit}
                  className="btn btn-primary" 
                  style={{ width: '100%', height: '48px', marginTop: '8px' }}
                >
                  Simulate QR Scan Success (₹{finalPayable.toLocaleString('en-IN')})
                </button>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit}>
                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Amit Kumar" 
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="form-input" 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={19}
                    placeholder="4111 2222 3333 4444" 
                    value={cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                      setCardNumber(formatted);
                    }}
                    className="form-input" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input 
                      type="text" 
                      required 
                      maxLength={5}
                      placeholder="MM/YY" 
                      value={expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 2) {
                          val = val.slice(0, 2) + '/' + val.slice(2);
                        }
                        setExpiry(val);
                      }}
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input 
                      type="password" 
                      required 
                      maxLength={3}
                      placeholder="***" 
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="form-input" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', height: '48px', marginTop: '16px' }}
                >
                  Pay ₹{finalPayable.toLocaleString('en-IN')} Now
                </button>
              </form>
            )}

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              marginTop: '20px', 
              fontSize: '0.75rem', 
              color: 'var(--text-muted)'
            }}>
              <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
              <span>SSL Secure 256-Bit Encrypted Payments</span>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
