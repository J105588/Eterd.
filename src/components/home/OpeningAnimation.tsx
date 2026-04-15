'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface OpeningAnimationProps {
  onComplete: () => void;
}

export default function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Final fade out of the container
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: onComplete
        });
      }
    });

    // Initial state
    gsap.set([path1Ref.current, path2Ref.current], {
      strokeDasharray: (i, target) => (target as SVGPathElement).getTotalLength(),
      strokeDashoffset: (i, target) => (target as SVGPathElement).getTotalLength(),
      fillOpacity: 0,
      stroke: '#000000',
    });

    // 1. Draw paths
    tl.to([path1Ref.current, path2Ref.current], {
      strokeDashoffset: 0,
      duration: 2.5,
      ease: 'power2.inOut',
      stagger: 0.5
    })
    // 2. Fill paths
    .to([path1Ref.current, path2Ref.current], {
      fillOpacity: 1,
      duration: 1,
      ease: 'power1.in'
    }, '-=0.5')
    // 3. Scale or subtle effect before transition
    .to(svgRef.current, {
      scale: 1.1,
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut'
    }, '+=0.5');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
    >
      <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
        <svg
          ref={svgRef}
          viewBox="0 0 375 375"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(32, 108)">
            <g transform="translate(68.625696, 1.925801)">
              <path
                ref={path1Ref}
                className="opening-svg-path"
                fillOpacity={0}
                stroke="transparent"
                d="M 14.875 122.5 C 3.445312 112.132812 -2.265625 97.1875 -2.265625 77.65625 C -2.265625 58.132812 3.445312 43.148438 14.875 32.703125 C 26.300781 22.253906 43.066406 17.03125 65.171875 17.03125 L 156.453125 17.03125 C 159.023438 17.03125 161.21875 17.972656 163.03125 19.859375 C 164.851562 21.753906 165.765625 23.910156 165.765625 26.328125 C 165.765625 28.753906 164.851562 30.875 163.03125 32.6875 C 161.21875 34.507812 159.023438 35.421875 156.453125 35.421875 L 64.265625 35.421875 C 30.203125 35.421875 13.171875 49.570312 13.171875 77.875 C 13.171875 106.1875 30.203125 120.34375 64.265625 120.34375 L 156.90625 120.34375 C 159.476562 120.34375 161.597656 121.175781 163.265625 122.84375 C 164.929688 124.507812 165.765625 126.628906 165.765625 129.203125 C 165.765625 131.773438 164.929688 133.894531 163.265625 135.5625 C 161.597656 137.226562 159.476562 138.0625 156.90625 138.0625 L 65.171875 138.0625 C 43.066406 138.0625 26.300781 132.875 14.875 122.5 Z M 14.875 122.5 "
              />
            </g>
            <g transform="translate(98.726431, 122.928376)">
              <path
                ref={path2Ref}
                className="opening-svg-path"
                fillOpacity={0}
                stroke="transparent"
                d="M 66.640625 -44.28125 L 66.640625 -37.46875 C 66.640625 -35.726562 65.992188 -34.210938 64.703125 -32.921875 C 63.421875 -31.640625 61.910156 -31 60.171875 -31 L 53.359375 -31 C 51.617188 -31 50.101562 -31.640625 48.8125 -32.921875 C 47.53125 -34.210938 46.890625 -35.726562 46.890625 -37.46875 L 46.890625 -44.28125 C 46.890625 -46.019531 47.53125 -47.53125 48.8125 -48.8125 C 50.101562 -50.101562 51.617188 -50.75 53.359375 -50.75 L 60.171875 -50.75 C 61.910156 -50.75 63.421875 -50.101562 64.703125 -48.8125 C 65.992188 -47.53125 66.640625 -46.019531 66.640625 -44.28125 Z M 66.640625 -44.28125 "
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
