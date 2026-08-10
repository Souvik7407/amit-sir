import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, PlayCircle, Radio, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import DoubtSection from '../components/DoubtSection';
import { useApp } from '../context/AppContext';

const courseNotesData = {
  'jee-calc-101': [
    { title: 'Standard Calculus Integrals', content: '∫ xⁿ dx = (xⁿ⁺¹)/(n+1) + C,  n ≠ -1\n∫ eˣ dx = eˣ + C\n∫ (1/x) dx = ln|x| + C' },
    { title: 'Integration By Parts (ILATE)', content: '∫ u dv = u·v - ∫ v du\nPriority: Inverse, Log, Algebra, Trig, Expo' },
    { title: 'Standard Limits & Derivatives', content: 'lim (x→0) (sin x)/x = 1\nlim (x→0) (eˣ - 1)/x = 1\nd/dx (ln x) = 1/x' }
  ],
  'boards-matrix-12': [
    { title: 'Matrix Algebra & Determinants', content: 'Matrix Inverse: A⁻¹ = adj(A) / |A|,  |A| ≠ 0\nTranspose rules: (AB)ᵀ = Bᵀ Aᵀ' },
    { title: 'Adjoint Properties', content: 'A · adj(A) = adj(A) · A = |A| · I\n|adj(A)| = |A|ⁿ⁻¹ where n is order' }
  ],
  'olympiad-algebra': [
    { title: 'Theory of Equations (Vieta\'s)', content: 'For ax² + bx + c = 0:\n  α + β = -b/a\n  αβ = c/a' },
    { title: 'Classic Inequalities', content: 'AM-GM: (a+b)/2 ≥ √(ab),  a,b ≥ 0\nCauchy-Schwarz: (∑ aᵢbᵢ)² ≤ (∑ aᵢ²)(∑ bᵢ²)' }
  ]
};

export default function CourseView({ courseId, onBack }) {
  const { courses } = useApp();
  const course = courses.find(c => c.id === courseId);

  const [activeLecture, setActiveLecture] = useState(null);

  // Set first lecture as default active lecture on load
  useEffect(() => {
    if (course && course.content && course.content.length > 0) {
      // Prefer starting with a Live stream if one is online, else first video
      const liveItem = course.content.find(item => item.isLive);
      setActiveLecture(liveItem || course.content[0]);
    }
  }, [course]);

  if (!course) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Course not found</h2>
        <button onClick={onBack} className="btn btn-secondary" style={{ marginTop: '16px' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 0 80px 0', textAlign: 'left' }}>
      
      {/* Back Button and course header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        <button 
          onClick={onBack} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-secondary)', 
            cursor: 'pointer', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            width: 'fit-content'
          }}
          className="back-btn"
        >
          <ArrowLeft size={16} />
          <span>Back to courses</span>
        </button>
        
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>{course.title}</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', fontSize: '0.95rem' }}>{course.description}</p>
      </div>

      {/* Main Grid: Player on left, Syllabus/Playlist on right */}
      <div className="classroom-grid">
        
        {/* Left Column: Player & Doubt Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Custom Video Player component */}
          <VideoPlayer activeLecture={activeLecture} />
          
          {/* Doubt typing box and history */}
          <DoubtSection courseId={course.id} courseTitle={course.title} />

        </div>

        {/* Right Column: Interactive Classroom Playlist & Sheets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Playlist */}
          <div className="card-glass" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} style={{ color: 'var(--primary)' }} />
              <span>Lectures Playlist</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {course.content && course.content.length > 0 ? (
                course.content.map((item) => {
                  const isSelected = activeLecture?.id === item.id;
                  
                  return (
                    <div 
                      key={item.id}
                      onClick={() => setActiveLecture(item)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'start'
                      }}
                      className="playlist-item"
                    >
                      {item.isLive ? (
                        <Radio size={16} style={{ color: '#ef4444', marginTop: '2px', animation: 'pulse 1.5s infinite' }} />
                      ) : (
                        <PlayCircle size={16} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-secondary)', marginTop: '2px' }} />
                      )}
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '0.85rem', 
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}>
                          {item.title}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.isLive ? 'Online Session' : item.duration}
                          </span>
                          {item.isLive && (
                            <span className="badge-live" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>Live</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '20px 0', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  No materials uploaded yet.
                </div>
              )}
            </div>
          </div>

          {/* Sheets and Study Materials (Extra premium feature to enrich app) */}
          <div className="card-glass" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} style={{ color: 'var(--accent)' }} />
              <span>DDP Sheets & Notes</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a 
                href="#"
                onClick={(e) => { e.preventDefault(); alert("File downloaded! (Mock PDF Sheets download)"); }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--border-color)', 
                  textDecoration: 'none', 
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem'
                }}
              >
                <span>Calculus Practice Sheet 1.pdf</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Download</span>
              </a>
              <a 
                href="#"
                onClick={(e) => { e.preventDefault(); alert("File downloaded! (Mock PDF Sheets download)"); }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--border-color)', 
                  textDecoration: 'none', 
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem'
                }}
              >
                <span>Symmetric Roots Cheat Sheet.pdf</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Download</span>
              </a>
            </div>
          </div>

          {/* Quick Study Math Formulas Notes */}
          <div className="card-glass" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} style={{ color: 'var(--primary)' }} />
              <span>Interactive Formula Sheet</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {courseNotesData[course.id] ? (
                courseNotesData[course.id].map((note, index) => (
                  <div key={index} style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    background: 'rgba(125, 204, 173, 0.05)', 
                    borderLeft: '3px solid var(--primary)',
                    textAlign: 'left'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {note.title}
                    </div>
                    <pre style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-secondary)', 
                      whiteSpace: 'pre-wrap', 
                      fontFamily: 'monospace',
                      lineHeight: '1.4'
                    }}>
                      {note.content}
                    </pre>
                  </div>
                ))
              ) : (
                <div style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  background: 'rgba(0,0,0,0.02)', 
                  border: '1px dashed var(--border-color)', 
                  fontSize: '0.75rem', 
                  color: 'var(--text-muted)',
                  textAlign: 'center'
                }}>
                  No formula notes uploaded for this batch yet.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
