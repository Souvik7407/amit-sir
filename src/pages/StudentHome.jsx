import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Users, Star, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

export default function StudentHome({ onSelectCourse, onOpenAuth, onOpenAdminAuth }) {
  const { courses, enrollments, user } = useApp();
  const [selectedPaymentCourse, setSelectedPaymentCourse] = useState(null);
  const [paymentSuccessCourse, setPaymentSuccessCourse] = useState(null);

  const handleEnrollClick = (course) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setSelectedPaymentCourse(course);
  };

  const handlePaymentSuccess = () => {
    const course = selectedPaymentCourse;
    setPaymentSuccessCourse(course);
    setTimeout(() => {
      setPaymentSuccessCourse(null);
      onSelectCourse(course);
    }, 2500);
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <span style={{ 
            background: 'var(--primary-glow)', 
            color: 'var(--primary)', 
            border: '1px solid rgba(99, 102, 241, 0.2)',
            padding: '6px 16px', 
            borderRadius: '50px', 
            fontSize: '0.8rem', 
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '16px',
            display: 'inline-block'
          }}>
            🎯 Pillars Coaching Classes
          </span>
          <h1 className="hero-title" style={{ margin: '0 auto 20px auto' }}>
            Kindle the Spark in Yourself
          </h1>
          <p className="hero-subtitle" style={{ margin: '0 auto 32px auto' }}>
            Crack JEE & Board Mathematics with specialist mentorship. Join expert interactive live classes, download standard formulas sheets, and resolve doubts instantly.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#courses" className="btn btn-primary">
              <span>Explore Batches</span>
              <ArrowRight size={16} />
            </a>
            <a href="#about" className="btn btn-secondary">
              <span>Why Amit Sir?</span>
            </a>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'left', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Available Batches</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Select a course to enroll and start learning instantly.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '30px' 
          }}>
            {courses.map((course) => {
              const isEnrolled = enrollments.includes(course.id) || (user && user.name === 'Demo Student');
              
              return (
                <div key={course.id} className="card-glass card-glass-hover" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  padding: '24px', 
                  textAlign: 'left',
                  height: '100%'
                }}>
                  {/* Thumbnail / Decoration */}
                  <div style={{ 
                    width: '100%', 
                    height: '180px', 
                    borderRadius: 'var(--border-radius-md)', 
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <BookOpen size={48} style={{ color: 'var(--primary)', opacity: 0.6 }} />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '12px', 
                      left: '12px',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <span className="badge-recorded">
                        {course.content?.length || 0} Lectures
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', height: '52px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {course.title}
                  </h3>
                  
                  <p style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '24px', 
                    flex: 1, 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.5'
                  }}>
                    {course.description}
                  </p>

                  {/* Course Metadata */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderTop: '1px solid var(--border-color)', 
                    paddingTop: '16px', 
                    marginBottom: '20px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <Users size={14} />
                      <span>{course.activeMembers || 0} enrolled</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 700 }}>
                      <Star size={14} style={{ fill: 'currentColor' }} />
                      <span>{course.rating || 5.0}</span>
                    </div>
                  </div>

                  {/* Bottom Checkout / Access Area */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Discounted Offer Price</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          ₹{course.price.toLocaleString('en-IN')}
                        </span>
                        {course.originalPrice && (
                          <>
                            <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                              ₹{course.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span style={{ 
                              fontSize: '0.7rem', 
                              fontWeight: 800, 
                              color: 'var(--success)', 
                              background: 'rgba(16, 185, 129, 0.08)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid rgba(16, 185, 129, 0.15)'
                            }}>
                              {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {isEnrolled ? (
                      <button 
                        onClick={() => onSelectCourse(course)} 
                        className="btn btn-success" 
                        style={{ display: 'flex', gap: '6px' }}
                      >
                        <span>Classroom</span>
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleEnrollClick(course)} 
                        className="btn btn-primary"
                      >
                        <span>Enroll Now</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '60px 0 20px', borderTop: '1px solid var(--border-color)' }}>
        <div className="container about-grid">
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Learn from the Specialist</h2>
            <p style={{ marginBottom: '20px' }}>
              Amit Sir is a renowned mathematics mentor with over 12+ years of experience training students for national competitive examinations, including JEE Mains, Advanced, KVPY, and Mathematical Olympiads.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ color: 'var(--success)' }}>✓</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Concept-first learning approach</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ color: 'var(--success)' }}>✓</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Daily Live Doubt Solving Panel</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ color: 'var(--success)' }}>✓</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>24/7 Access to interactive community boards</div>
              </div>
            </div>
          </div>
          <div className="card-glass" style={{ padding: '32px', textAlign: 'center', background: 'var(--bg-glass)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Join 5,000+ Students</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Start learning math with interactive animations and logical proofs.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>99.2%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Board Success Rate</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>450+</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>JEE IIT Selections</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Success Overlay Spinner */}
      {paymentSuccessCourse && (
        <div className="modal-overlay" style={{ zIndex: 110 }}>
          <div className="modal-content card-glass" style={{ maxWidth: '380px', textAlign: 'center', padding: '32px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'rgba(16, 185, 129, 0.1)', 
              color: 'var(--success)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px auto',
              border: '2px solid var(--success)'
            }}>
              <CheckCircle size={32} style={{ color: '#10b981' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: 700 }}>Payment Successful!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              You are now enrolled in <strong>{paymentSuccessCourse.title}</strong>. Redirecting you to the classroom classroom...
            </p>
          </div>
        </div>
      )}

      {/* Checkout Gateway */}
      <PaymentModal 
        course={selectedPaymentCourse}
        isOpen={selectedPaymentCourse !== null}
        onClose={() => setSelectedPaymentCourse(null)}
        onSuccess={handlePaymentSuccess}
      />

      <footer style={{ 
        borderTop: '1px solid var(--border-color)', 
        padding: '30px 0', 
        marginTop: '60px', 
        textAlign: 'center', 
        fontSize: '0.8rem', 
        color: 'var(--text-secondary)' 
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span>© 2026 Pillars Coaching Classes. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onOpenAdminAuth(); }} 
              style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}
              className="footer-admin-link"
            >
              Instructor Administration Login
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
