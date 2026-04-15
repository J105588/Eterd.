'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface BackgroundSliderProps {
  images: string[];
}

export default function BackgroundSlider({ images }: BackgroundSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preloaded, setPreloaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Preload all images
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      setPreloaded(true);
      return;
    }

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setPreloaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setPreloaded(true);
        }
      };
    });
  }, [images]);

  useEffect(() => {
    if (!preloaded || images.length === 0) return;

    const slides = containerRef.current?.querySelectorAll('.slide');
    if (!slides || slides.length === 0) return;

    const transitionDuration = 12; // Complete fade + scale duration
    const displayDuration = 12000; // Time between transitions in ms

    // First slide initial state
    gsap.set(slides[0], { opacity: 1, scale: 1.0 });
    gsap.to(slides[0], { scale: 1.05, duration: transitionDuration, ease: 'power1.inOut' });

    let activeIndex = 0;

    const playTransition = () => {
      const nextIndex = (activeIndex + 1) % images.length;
      const currentSlide = slides[activeIndex];
      const nextSlide = slides[nextIndex];

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
        '<' // Start at the same time as currentSlide fade
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
  }, [preloaded, images]);

  if (!preloaded) {
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
