import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function DoubtSection({ courseId, courseTitle }) {
  const { doubts, addDoubt, user } = useApp();
  const [question, setQuestion] = useState('');

  // Filter doubts related to this specific course
  const courseDoubts = doubts.filter(d => d.courseId === courseId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    addDoubt(courseId, courseTitle, question);
    setQuestion('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', textAlign: 'left', marginTop: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          width: '42px', 
          height: '42px', 
          borderRadius: '10px', 
          background: 'rgba(99, 102, 241, 0.12)', 
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}>
          <MessageSquare size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Doubt Resolution Portal</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Type your equations or questions. Amit Sir and math TAs reply within 24 hours.</p>
        </div>
      </div>

      <div className="doubt-layout-grid">
        
        {/* Ask a Doubt Form */}
        <div className="card-glass" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={18} style={{ color: 'var(--primary)' }} />
            <span>Ask Amit Sir a Doubt</span>
          </h3>
          
          {user ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Write your question</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="E.g., In lecture 2, why does integration by parts fail for ln(x)/x when we use u = 1/x? Can you explain the correct choice of function?" 
                  value={question} 
                  onChange={(e) => setQuestion(e.target.value)}
                  className="form-input" 
                  style={{ resize: 'vertical', minHeight: '100px', lineHeight: '1.5' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center' }}
              >
                <span>Submit Doubt</span>
                <Send size={16} />
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                You must be signed in to post a question on the doubt board.
              </p>
            </div>
          )}
        </div>

        {/* Doubts Feed */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>
            Batch Q&A Board ({courseDoubts.length})
          </h3>

          {courseDoubts.length === 0 ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              border: '1px dashed var(--border-color)', 
              borderRadius: 'var(--border-radius-md)',
              background: 'rgba(255,255,255,0.01)'
            }}>
              <MessageSquare size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No doubts raised yet</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Be the first to ask a doubt or help your classmates learn!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {courseDoubts.map((doubt) => (
                <div key={doubt.id} className="doubt-card">
                  {/* Doubt Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        border: '1px solid var(--border-color)'
                      }}>
                        {doubt.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{doubt.studentName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {new Date(doubt.timestamp).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>

                    <span className={`btn ${doubt.status === 'resolved' ? 'doubt-status-resolved' : 'doubt-status-pending'}`} style={{ 
                      padding: '4px 10px', 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      borderRadius: '30px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      cursor: 'default'
                    }}>
                      {doubt.status === 'resolved' ? (
                        <>
                          <CheckCircle2 size={12} />
                          <span>Resolved</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={12} />
                          <span>Awaiting Review</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Doubt Body */}
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                    {doubt.question}
                  </div>

                  {/* Reply Block */}
                  {doubt.status === 'resolved' && (
                    <div style={{ 
                      background: 'rgba(99, 102, 241, 0.05)', 
                      borderLeft: '3px solid var(--primary)', 
                      padding: '16px', 
                      borderRadius: '0 8px 8px 0',
                      marginTop: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', 
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontWeight: 'bold'
                        }}>
                          A
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          Amit Sir (Instructor)
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {doubt.reply}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
