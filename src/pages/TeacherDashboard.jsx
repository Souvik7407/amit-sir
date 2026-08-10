import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  IndianRupee, Users, BookOpen, AlertCircle, 
  Plus, Trash2, MessageSquare, ListVideo, 
  Send, Check, Video, Radio, ShieldAlert 
} from 'lucide-react';

export default function TeacherDashboard() {
  const { 
    courses, addCourse, deleteCourse, 
    addContentToCourse, deleteContentFromCourse, 
    doubts, resolveDoubt, stats 
  } = useApp();

  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'doubts'
  
  // New Course state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  
  // Selected course for uploading content
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  
  // New Content state
  const [contentTitle, setContentTitle] = useState('');
  const [contentType, setContentType] = useState('recorded'); // 'recorded' | 'live'
  const [contentDuration, setContentDuration] = useState('45 mins');
  const [contentUrl, setContentUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-displaying-financial-charts-40156-large.mp4');

  // Doubt Reply state
  const [replyText, setReplyText] = useState({});

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;

    const op = parseFloat(newOriginalPrice) || parseFloat(newPrice) * 2;

    addCourse({
      title: newTitle,
      description: newDesc,
      price: parseFloat(newPrice),
      originalPrice: op
    });

    setNewTitle('');
    setNewDesc('');
    setNewPrice('');
    setNewOriginalPrice('');
    alert("New batch created successfully!");
  };

  const handleAddContent = (e) => {
    e.preventDefault();
    if (!contentTitle.trim() || !selectedCourseId) return;

    addContentToCourse(selectedCourseId, {
      title: contentTitle,
      duration: contentType === 'live' ? 'Live Session' : contentDuration,
      url: contentUrl,
      isLive: contentType === 'live'
    });

    setContentTitle('');
    alert("Content uploaded successfully!");
  };

  const handleResolveDoubtSubmit = (doubtId) => {
    const text = replyText[doubtId];
    if (!text || !text.trim()) return;

    resolveDoubt(doubtId, text);
    setReplyText(prev => ({ ...prev, [doubtId]: '' }));
    alert("Response sent to student!");
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="container" style={{ padding: '32px 0 80px 0', textAlign: 'left' }}>
      
      {/* Header and Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>Amit Sir's Panel</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your mathematics batches, upload streaming lectures, and answer student questions.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 16px', borderRadius: '10px', alignItems: 'center' }}>
          <ShieldAlert size={16} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700 }}>Admin Console</span>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="stats-grid">
        <div className="card-glass stat-card">
          <div className="stat-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Revenue</div>
            <div className="stat-value">₹{stats.totalEarnings.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="card-glass stat-card">
          <div className="stat-icon" style={{ color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Members</div>
            <div className="stat-value">{stats.totalStudents}</div>
          </div>
        </div>

        <div className="card-glass stat-card">
          <div className="stat-icon" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Batches</div>
            <div className="stat-value">{stats.totalBatches}</div>
          </div>
        </div>

        <div className="card-glass stat-card" style={{ border: stats.activeDoubtsCount > 0 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-color)' }}>
          <div className="stat-icon" style={{ 
            color: stats.activeDoubtsCount > 0 ? '#f59e0b' : 'var(--text-muted)', 
            background: stats.activeDoubtsCount > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.03)' 
          }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Doubts</div>
            <div className="stat-value" style={{ color: stats.activeDoubtsCount > 0 ? '#f59e0b' : 'inherit' }}>
              {stats.activeDoubtsCount}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '32px' }}>
        <button 
          onClick={() => setActiveTab('courses')}
          style={{ 
            padding: '12px 24px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'courses' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'courses' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          Batches & Content Manager
        </button>
        <button 
          onClick={() => setActiveTab('doubts')}
          style={{ 
            padding: '12px 24px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'doubts' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'doubts' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Doubt Resolution Center</span>
          {stats.activeDoubtsCount > 0 && (
            <span style={{ 
              background: '#f59e0b', 
              color: '#000', 
              fontSize: '0.65rem', 
              fontWeight: 800, 
              padding: '2px 6px', 
              borderRadius: '10px' 
            }}>
              {stats.activeDoubtsCount} New
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Course and Video Management */}
      {activeTab === 'courses' && (
        <div className="dashboard-layout-grid">
          
          {/* Left Column: Create Course and Upload Video Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Create Batch Form */}
            <div className="card-glass" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} style={{ color: 'var(--primary)' }} />
                <span>Create New Batch</span>
              </h3>
              
              <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Batch Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="E.g., Class 11 Trigonometry Basics" 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe syllabus coverage and features..." 
                    value={newDesc} 
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="form-input" 
                    style={{ resize: 'vertical' }}
                  />
                </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Offer Price (₹)</label>
                    <input 
                      type="number" 
                      required 
                      min={0}
                      placeholder="4999" 
                      value={newPrice} 
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Actual Price (₹)</label>
                    <input 
                      type="number" 
                      min={0}
                      placeholder="9999" 
                      value={newOriginalPrice} 
                      onChange={(e) => setNewOriginalPrice(e.target.value)}
                      className="form-input" 
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                  Create Batch
                </button>
              </form>
            </div>

            {/* Upload Content Form */}
            <div className="card-glass" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ListVideo size={18} style={{ color: 'var(--accent)' }} />
                <span>Upload Course Material</span>
              </h3>

              <form onSubmit={handleAddContent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Select Target Batch</label>
                  <select 
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="form-input"
                    style={{ background: 'var(--bg-primary)' }}
                  >
                    <option value="">-- Choose a course --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Lecture Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="E.g., 4. Trigonometric Identities Part 1" 
                    value={contentTitle} 
                    onChange={(e) => setContentTitle(e.target.value)}
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Session Type</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      type="button" 
                      className={`dev-toggle-btn ${contentType === 'recorded' ? 'active' : ''}`}
                      style={{ flex: 1, padding: '8px' }}
                      onClick={() => setContentType('recorded')}
                    >
                      <Video size={14} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                      Recorded Lecture
                    </button>
                    <button 
                      type="button" 
                      className={`dev-toggle-btn ${contentType === 'live' ? 'active' : ''}`}
                      style={{ flex: 1, padding: '8px' }}
                      onClick={() => setContentType('live')}
                    >
                      <Radio size={14} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                      Live Stream
                    </button>
                  </div>
                </div>

                {contentType === 'recorded' && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Lecture Duration</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 45 mins" 
                      value={contentDuration} 
                      onChange={(e) => setContentDuration(e.target.value)}
                      className="form-input" 
                    />
                  </div>
                )}

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Streaming URL / File Path</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter MP4 or live stream endpoint" 
                    value={contentUrl} 
                    onChange={(e) => setContentUrl(e.target.value)}
                    className="form-input" 
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '8px' }}
                  disabled={!selectedCourseId}
                >
                  Upload Content
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: List of courses and their syllabus content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Active Classes ({courses.length})</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {courses.map((course) => (
                <div key={course.id} className="card-glass" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{course.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Price: <strong>₹{course.price.toLocaleString('en-IN')}</strong> {course.originalPrice && <span style={{ textDecoration: 'line-through', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>₹{course.originalPrice.toLocaleString('en-IN')}</span>} • Enrollment: <strong>{course.activeMembers} members</strong>
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
                          deleteCourse(course.id);
                        }
                      }}
                      className="btn btn-danger" 
                      style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Course Content list inside Admin card */}
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Syllabus Content ({course.content?.length || 0})
                    </div>
                    
                    {course.content && course.content.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {course.content.map(item => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                              {item.isLive ? (
                                <span className="badge-live" style={{ fontSize: '0.55rem', padding: '1px 4px' }}>Live</span>
                              ) : (
                                <Video size={12} style={{ color: 'var(--text-secondary)' }} />
                              )}
                              <span>{item.title}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {item.isLive ? 'Live session' : item.duration}
                              </span>
                              <button 
                                onClick={() => deleteContentFromCourse(course.id, item.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7 }}
                                title="Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '8px 0', textAlign: 'center' }}>
                        No content uploaded to this batch yet.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Doubt Resolution Center */}
      {activeTab === 'doubts' && (
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Student Doubt Queues</h3>

          {doubts.length === 0 ? (
            <div className="card-glass" style={{ padding: '60px', textAlign: 'center' }}>
              <MessageSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3>All Doubts Solved!</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Your students currently have no pending doubts. Good job!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {doubts.map((doubt) => (
                <div key={doubt.id} className="card-glass" style={{ 
                  padding: '24px', 
                  borderLeft: doubt.status === 'resolved' ? '4px solid var(--success)' : '4px solid var(--warning)' 
                }}>
                  {/* Header metadata */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {doubt.courseTitle}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '4px' }}>
                        Asked by {doubt.studentName} ({doubt.studentEmail})
                      </div>
                    </div>
                    
                    <span className={`btn ${doubt.status === 'resolved' ? 'doubt-status-resolved' : 'doubt-status-pending'}`} style={{ 
                      padding: '4px 10px', 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      borderRadius: '30px', 
                      cursor: 'default'
                    }}>
                      {doubt.status === 'resolved' ? 'Resolved' : 'Pending Review'}
                    </span>
                  </div>

                  {/* Doubt Question text */}
                  <div style={{ 
                    background: 'rgba(0,0,0,0.15)', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    fontSize: '0.9rem', 
                    lineHeight: '1.5',
                    color: 'var(--text-primary)',
                    marginBottom: '16px',
                    border: '1px solid var(--border-color)'
                  }}>
                    {doubt.question}
                  </div>

                  {/* Reply Action */}
                  {doubt.status === 'pending' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <textarea 
                        rows={3}
                        placeholder="Write your explanation or proof. Tip: you can provide step-by-step calculus hints..."
                        value={replyText[doubt.id] || ''}
                        onChange={(e) => setReplyText(prev => ({ ...prev, [doubt.id]: e.target.value }))}
                        className="form-input"
                      />
                      <button 
                        onClick={() => handleResolveDoubtSubmit(doubt.id)}
                        className="btn btn-success"
                        style={{ alignSelf: 'flex-end', display: 'flex', gap: '6px' }}
                      >
                        <Check size={16} />
                        <span>Send Answer</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ 
                      background: 'rgba(16, 185, 129, 0.03)', 
                      border: '1px solid rgba(16, 185, 129, 0.1)', 
                      padding: '16px', 
                      borderRadius: '8px', 
                      fontSize: '0.85rem' 
                    }}>
                      <div style={{ fontWeight: 700, color: 'var(--success)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={14} />
                        <span>Your Reply:</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {doubt.reply}
                      </p>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
