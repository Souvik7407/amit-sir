import React, { useState, useEffect, useRef } from 'react';
import { Play, Tv, Send, Users, Wifi } from 'lucide-react';

const mockLiveComments = [
  { id: 1, name: 'Aryan Goel', text: 'Sir, please explain the last integration step again!' },
  { id: 2, name: 'Nikita Gupta', text: 'Ah, so that is why we used substitution. Got it!' },
  { id: 3, name: 'Rohan Sharma', text: 'Is this formula applicable for definite integrals too?' },
  { id: 4, name: 'Sneha Rao', text: 'Amazing explanation sir. Crystal clear.' },
  { id: 5, name: 'Dev Dixit', text: 'Will this lecture be uploaded as recorded later?' },
];

export default function VideoPlayer({ activeLecture }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [comments, setComments] = useState(mockLiveComments);
  const [newComment, setNewComment] = useState('');
  const [viewers, setViewers] = useState(182);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  // Simulate incoming chat messages for live streams
  useEffect(() => {
    if (!activeLecture?.isLive) return;

    const interval = setInterval(() => {
      const names = ['Karan S.', 'Meera Roy', 'Siddharth P.', 'Priya J.', 'Rahul K.'];
      const phrases = [
        'Amit Sir is the best!',
        'Is this standard JEE Advanced level?',
        'Yes, (sin x)/x is 1 as x -> 0.',
        'Got the answer: 1/2.',
        'Which book is best for calculus prep?',
        'Wow, shortcuts are super helpful!'
      ];
      
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomText = phrases[Math.floor(Math.random() * phrases.length)];

      setComments(prev => [
        ...prev,
        { id: Date.now(), name: randomName, text: randomText }
      ]);
      
      // randomize viewer count slightly
      setViewers(v => v + Math.floor(Math.random() * 5) - 2);
    }, 4500);

    return () => clearInterval(interval);
  }, [activeLecture]);

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments(prev => [
      ...prev,
      { id: Date.now(), name: 'You', text: newComment }
    ]);
    setNewComment('');
  };

  if (!activeLecture) {
    return (
      <div className="video-player-container">
        <div className="video-player-placeholder">
          <Tv size={48} style={{ color: 'var(--text-secondary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Select a lecture from the course playlist to begin learning</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`video-layout-grid ${!activeLecture.isLive ? 'recorded-mode' : ''}`}>
      
      {/* Main Video Box */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="video-player-container">
          {!isPlaying ? (
            <div className="video-player-placeholder" onClick={() => setIsPlaying(true)}>
              {activeLecture.isLive && (
                <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
                  <span className="badge-live">
                    <Wifi size={12} />
                    Live
                  </span>
                </div>
              )}
              
              <div className="play-icon-glow">
                <Play size={32} style={{ fill: 'currentColor', marginLeft: '4px' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{activeLecture.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {activeLecture.isLive ? 'Click to join live interactive session' : `Duration: ${activeLecture.duration} • Click to start playing`}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <video 
                src={activeLecture.url} 
                className="video-element"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                controls
                autoPlay
              />
              {activeLecture.isLive && (
                <div style={{ 
                  position: 'absolute', 
                  top: '16px', 
                  left: '16px', 
                  right: '16px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}>
                  <span className="badge-live">
                    <Wifi size={12} />
                    Live Stream
                  </span>
                  
                  <span style={{ 
                    background: 'rgba(0,0,0,0.6)', 
                    color: 'white', 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    backdropFilter: 'blur(4px)'
                  }}>
                    <Users size={12} />
                    <span>{viewers} Online</span>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>{activeLecture.title}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {activeLecture.isLive 
              ? 'Join this live interactive math session. Use the right chatbox to ask real-time questions directly to Amit Sir.' 
              : `Recorded lecture • Class materials and doubt typing panel are available down below.`}
          </p>
        </div>
      </div>

      {/* Live Chat Panel (Only visible for Live Sessions) */}
      {activeLecture.isLive && (
        <div className="card-glass" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          maxHeight: '420px', 
          borderRadius: 'var(--border-radius-md)',
          overflow: 'hidden'
        }}>
          {/* Chat Header */}
          <div style={{ 
            padding: '16px', 
            borderBottom: '1px solid var(--border-color)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Live Stream Chat</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={12} />
              {viewers}
            </span>
          </div>

          {/* Messages list */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '16px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px' 
          }}>
            {comments.map((cmt) => (
              <div key={cmt.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start', textAlign: 'left' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 800, 
                  color: cmt.name === 'You' ? 'var(--primary)' : 'var(--text-secondary)' 
                }}>
                  {cmt.name}
                </span>
                <span style={{ 
                  fontSize: '0.85rem', 
                  background: cmt.name === 'You' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid',
                  borderColor: cmt.name === 'You' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  padding: '6px 10px', 
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  wordBreak: 'break-word',
                  maxWidth: '100%'
                }}>
                  {cmt.text}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendComment} style={{ 
            padding: '12px', 
            borderTop: '1px solid var(--border-color)',
            background: 'rgba(0, 0, 0, 0.25)',
            display: 'flex',
            gap: '8px'
          }}>
            <input 
              type="text" 
              placeholder="Type message..." 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)}
              className="form-input" 
              style={{ padding: '8px 12px', fontSize: '0.85rem', borderRadius: '8px' }}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ padding: '8px 12px', borderRadius: '8px', minWidth: '40px' }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
