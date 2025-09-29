
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = 'No videos yet.' }) => {
  const videoRefs = useRef(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    );
    videoRefs.current.forEach((vid) => observer.observe(vid));
    return () => observer.disconnect();
  }, [items]);

  const setVideoRef = (id) => (el) => {
    if (!el) {
      videoRefs.current.delete(id);
      return;
    }
    videoRefs.current.set(id, el);
  };

  return (
    <div className="reels-page">
      <div className="reels-feed" role="list">
        {items.length === 0 && (
          <div className="empty-state">
            <p>{emptyMessage}</p>
          </div>
        )}
        {items.map((item) => (
          <section key={item._id} className="reel" role="listitem">
            <div className="reel-inner">
              <div className="reel-video-wrapper">
                <video
                  ref={setVideoRef(item._id)}
                  className="reel-video"
                  src={item.video}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                />
                <MuteButton videoRef={videoRefs.current.get(item._id)} />
              </div>
              <div className="reel-overlay">
                <div className="reel-overlay-gradient" aria-hidden="true" />
                {item.foodPartner && (
                  <div className="reel-creator" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0 0 16px', marginBottom: '64px' }}>
                    <Link
                      to={`/food-partner/${item.foodPartner._id}`}
                      className="reel-creator-link"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        color: 'var(--color-text)',
                        fontWeight: 500
                      }}
                    >
                      <img
                        src={
                          item.foodPartner.avatar ||
                          'https://ui-avatars.com/api/?name=' +
                            encodeURIComponent(item.foodPartner.name || 'Partner')
                        }
                        alt={item.foodPartner.name || 'Food Partner'}
                        className="reel-creator-avatar"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          background: '#eee'
                        }}
                      />
                      <span>{item.foodPartner.name || 'Food Partner'}</span>
                    </Link>
                    <Link
                      to={`/food-partner/${item.foodPartner._id}`}
                      className="visit-store-btn"
                      style={{
                        padding: '6px 14px',
                        background: 'var(--color-accent)',
                        color: '#fff',
                        borderRadius: '20px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        fontSize: '0.95rem',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                      }}
                    >
                      Visit Store
                    </Link>
                  </div>
                )}
                <div className="reel-actions">
                  <div className="reel-action-group">
                    <button
                      onClick={onLike ? () => onLike(item) : undefined}
                      className="reel-action"
                      aria-label="Like"
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                      </svg>
                    </button>
                    <div className="reel-action__count">
                      {item.likeCount ?? item.likesCount ?? item.likes ?? 0}
                    </div>
                  </div>
                  <div className="reel-action-group">
                    <button
                      className="reel-action"
                      onClick={onSave ? () => onSave(item) : undefined}
                      aria-label="Bookmark"
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                      </svg>
                    </button>
                    <div className="reel-action__count">
                      {item.savesCount ?? item.bookmarks ?? item.saves ?? 0}
                    </div>
                  </div>
                  <div className="reel-action-group">
                    <button className="reel-action" aria-label="Comments">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                      </svg>
                    </button>
                    <div className="reel-action__count">
                      {item.commentsCount ??
                        (Array.isArray(item.comments) ? item.comments.length : 0)}
                    </div>
                  </div>
                </div>
                <div className="reel-content">
                  <p className="reel-description" title={item.description}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

const MuteButton = ({ videoRef }) => {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (videoRef) {
      videoRef.muted = muted;
    }
  }, [muted, videoRef]);

  return (
    <button
      className="mute-btn"
      type="button"
      onClick={() => setMuted((prev) => !prev)}
      aria-label={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
};

export default ReelFeed;
