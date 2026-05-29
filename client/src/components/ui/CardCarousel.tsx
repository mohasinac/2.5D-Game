import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface CarouselCard {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: React.ReactNode;
  gradient: string;
  badge?: string;
  disabled?: boolean;
  onSelect: () => void;
}

interface CardCarouselProps {
  cards: CarouselCard[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
}

export function CardCarousel({ cards, initialIndex = 0, onIndexChange, className = '' }: CardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const go = useCallback((dir: -1 | 1) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(i => {
      const next = (i + dir + cards.length) % cards.length;
      onIndexChange?.(next);
      return next;
    });
    setTimeout(() => setIsAnimating(false), 280);
  }, [isAnimating, cards.length, onIndexChange]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
      else if (e.key === 'Enter' || e.key === ' ') {
        const card = cards[activeIndex];
        if (card && !card.disabled) card.onSelect();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [go, cards, activeIndex]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      go(e.deltaY > 0 ? 1 : -1);
    };
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [go]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const getCardStyle = (idx: number): React.CSSProperties => {
    const offset = idx - activeIndex;
    const wrappedOffset = (() => {
      const half = Math.floor(cards.length / 2);
      let o = offset;
      if (o > half) o -= cards.length;
      if (o < -half) o += cards.length;
      return o;
    })();

    const absOffset = Math.abs(wrappedOffset);
    const isActive = wrappedOffset === 0;
    const isAdjacent = absOffset === 1;
    const isVisible = absOffset <= 2;

    return {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: `translate(-50%, -50%) translateX(${wrappedOffset * 88}%) scale(${isActive ? 1 : isAdjacent ? 0.82 : 0.68})`,
      opacity: isActive ? 1 : isAdjacent ? 0.5 : isVisible ? 0.2 : 0,
      transition: 'transform 260ms cubic-bezier(0.4,0,0.2,1), opacity 260ms ease',
      zIndex: isActive ? 10 : isAdjacent ? 5 : 1,
      pointerEvents: isVisible ? 'auto' : 'none',
      cursor: isActive ? 'pointer' : 'pointer',
    };
  };

  return (
    <div
      ref={containerRef}
      className={`card-carousel ${className}`}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Nav arrows */}
      <button
        onClick={() => go(-1)}
        className="carousel-nav-btn carousel-nav-left"
        aria-label="Previous"
        style={{
          position: 'absolute', left: '4px', top: '50%', transform: 'translateY(-50%)',
          zIndex: 20, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff', borderRadius: '50%', width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '18px', transition: 'background 150ms',
        }}
      >
        ‹
      </button>
      <button
        onClick={() => go(1)}
        className="carousel-nav-btn carousel-nav-right"
        aria-label="Next"
        style={{
          position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)',
          zIndex: 20, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff', borderRadius: '50%', width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '18px', transition: 'background 150ms',
        }}
      >
        ›
      </button>

      {/* Cards */}
      {cards.map((card, idx) => (
        <div
          key={card.id}
          style={getCardStyle(idx)}
          onClick={() => {
            if (idx !== activeIndex) {
              const offset = idx - activeIndex;
              const half = Math.floor(cards.length / 2);
              let o = offset;
              if (o > half) o -= cards.length;
              if (o < -half) o += cards.length;
              go(o > 0 ? 1 : -1);
            } else if (!card.disabled) {
              card.onSelect();
            }
          }}
        >
          <div
            className="carousel-card"
            style={{
              width: '280px',
              height: '360px',
              borderRadius: '16px',
              background: card.gradient,
              border: idx === activeIndex ? '2px solid rgba(255,255,255,0.4)' : '2px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              boxShadow: idx === activeIndex
                ? '0 0 40px rgba(255,255,255,0.15), 0 20px 60px rgba(0,0,0,0.5)'
                : '0 8px 32px rgba(0,0,0,0.4)',
              position: 'relative',
              overflow: 'hidden',
              userSelect: 'none',
            }}
          >
            {card.badge && (
              <div style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(255,255,255,0.2)', borderRadius: 6,
                padding: '2px 8px', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase',
              }}>
                {card.badge}
              </div>
            )}
            {card.disabled && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '14px',
                background: 'rgba(0,0,0,0.55)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', color: 'rgba(255,255,255,0.5)',
                fontWeight: 600, letterSpacing: '0.05em', zIndex: 2,
              }}>
                LOCKED
              </div>
            )}

            {card.icon && (
              <div style={{ fontSize: '64px', marginBottom: '16px', lineHeight: 1 }}>
                {card.icon}
              </div>
            )}

            <div style={{
              fontSize: '26px', fontWeight: 900, color: '#fff',
              textAlign: 'center', letterSpacing: '0.04em',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              textTransform: 'uppercase',
            }}>
              {card.title}
            </div>

            {card.subtitle && (
              <div style={{
                fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)',
                textAlign: 'center', marginTop: '4px', letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {card.subtitle}
              </div>
            )}

            <div style={{
              marginTop: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.75)',
              textAlign: 'center', lineHeight: 1.5,
            }}>
              {card.description}
            </div>

            {idx === activeIndex && !card.disabled && (
              <div style={{
                marginTop: '24px', padding: '10px 28px',
                background: 'rgba(255,255,255,0.2)', borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.3)',
                fontSize: '13px', fontWeight: 700, color: '#fff',
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                SELECT
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '8px', zIndex: 20,
      }}>
        {cards.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              const diff = idx - activeIndex;
              if (diff !== 0) go(diff > 0 ? 1 : -1);
            }}
            style={{
              width: idx === activeIndex ? '20px' : '8px',
              height: '8px', borderRadius: '4px',
              background: idx === activeIndex ? '#fff' : 'rgba(255,255,255,0.3)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 260ms ease',
            }}
            aria-label={`Go to card ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
