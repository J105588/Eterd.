'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface BackgroundSliderProps {
  images: string[];
}

export default function BackgroundSlider({ images }: BackgroundSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Preload images incrementally
  useEffect(() => {
    if (images.length === 0) {
      setIsReady(true);
      return;
    }

    let count = 0;
    images.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        count++;
        setLoadedCount(prev => prev + 1);
        // Start as soon as the first image is ready
        if (index === 0) {
          setIsReady(true);
        }
      };
      img.onerror = () => {
        count++;
        setLoadedCount(prev => prev + 1);
        if (index === 0) {
          setIsReady(true);
        }
      };
    });
  }, [images]);

  useEffect(() => {
    if (!isReady || images.length === 0) return;

    const slides = containerRef.current?.querySelectorAll('.slide');
    if (!slides || slides.length === 0) return;

    const transitionDuration = 12; // Complete fade + scale duration
    const displayDuration = 12000; // Time between transitions in ms

    // First slide initial state
    gsap.set(slides[0], { opacity: 1, scale: 1.0 });
    gsap.to(slides[0], { scale: 1.05, duration: transitionDuration, ease: 'power1.inOut' });

    let activeIndex = 0;

    const playTransition = () => {
      // Find the next available image that is likely loaded
      // Since we can't easily sync React state with this GSAP loop variable without re-running effect,
      // we check the loadedCount to decide how far we can go in the array.
      // But simple modulo is safer if we assume images load roughly in order or we just loop 
      // through those that ARE currently in the DOM (which is all of them).
      
      const nextIndex = (activeIndex + 1) % images.length;
      
      // If the next image isn't loaded yet (judging by loadedCount), 
      // we might want to wait or just jump to the next loaded one.
      // For simplicity and "incremental" feel, we'll just cycle. 
      // If it's not loaded, the browser will show white/transparent until it is.
      
      const currentSlide = slides[activeIndex];
      const nextSlide = slides[nextIndex];

      if (!nextSlide) return;

      const tl = gsap.timeline({
        onComplete: () => {
          activeIndex = nextIndex;
          setCurrentIndex(nextIndex);
          gsap.delayedCall(displayDuration / 1000, playTransition);
        }
      });

      tlRef.current = tl;

      // Crossfade logic
      tl.to(currentSlide, {
        opacity: 0,
        scale: 1.08,
        duration: 4,
        ease: 'power2.inOut'
      })
      .fromTo(nextSlide,
        { opacity: 0, scale: 1.0 },
        {
          opacity: 1,
          scale: 1.05,
          duration: transitionDuration,
          ease: 'power1.inOut'
        },
        '<'
      );
    };

    // Start the loop after initial delay
    const initialDelay = gsap.delayedCall(displayDuration / 1000, playTransition);

    // Visibility API handlers
    const handleVisibilityChange = () => {
      if (document.hidden) {
        gsap.globalTimeline.pause();
      } else {
        gsap.globalTimeline.resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      initialDelay.kill();
      if (tlRef.current) tlRef.current.kill();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isReady, images.length]); // Dependencies: only start when ready

  // We show the first image as soon as isReady is true
  if (!isReady) {
    return <div className="fixed inset-0 bg-white z-0" />;
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden bg-white">
      {images.map((src, index) => (
        <div
          key={src}
          className="slide absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: 'center 40%',
            backgroundSize: 'cover',
            opacity: 0,
            transform: 'scale(1.0)',
            maskImage: 'radial-gradient(circle at center 45%, black, rgba(0,0,0,0.8) 30%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(circle at center 45%, black, rgba(0,0,0,0.8) 30%, transparent 95%)',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
          }}
        />
      ))}
      <div className="white-shroud" />
    </div>
  );
}
