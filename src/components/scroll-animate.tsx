'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollAnimateProps {
  children: ReactNode;
  className?: string;
  animation?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
}

export function ScrollAnimate({ 
  children, 
  className = '', 
  animation = 'up',
  delay = 0 
}: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate');
            }, delay);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'left':
        return 'scroll-animate-left';
      case 'right':
        return 'scroll-animate-right';
      case 'scale':
        return 'scroll-animate-scale';
      default:
        return 'scroll-animate';
    }
  };

  return (
    <div ref={ref} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  );
}
