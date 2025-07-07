import React, { useRef, useEffect } from 'react';

// List of logos and names based on files present in /logos
const universities = [
  { name: 'Harvard', logo: '/logos/harvard-logo.png' },
  { name: 'MIT', logo: '/logos/mit-logo.png' },
  { name: 'NYU', logo: '/logos/nyu-logo.png' },
  { name: 'Princeton', logo: '/logos/princeton-logo.png' },
  { name: 'Stanford', logo: '/logos/stanford-university-logo.png' },
  { name: 'UChicago', logo: '/logos/uchicago-logo.png' },
  { name: 'UPenn', logo: '/logos/upenn-logo.png' },
  { name: 'Yale', logo: '/logos/yale-logo.png' },
];

export default function TrustedBySection() {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    let animationFrame;
    let isHovered = false;
    let speed = 0.7; // px per frame

    const scroll = () => {
      if (!carousel) return;
      if (!isHovered) {
        carousel.scrollLeft += speed;
        // When we've scrolled halfway (one set of logos), reset to 0 for seamless loop
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(scroll);
    };
    scroll();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section className="my-10 text-center">
      <div className="text-lg font-semibold mb-4 text-gray-700">Trusted by students who got into</div>
      <div
        className="relative w-full flex justify-center items-center"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          border: '2.5px solid #e5e7eb',
          borderRadius: 32,
          background: 'linear-gradient(90deg, #f8fafc 60%, #e2e8f0 100%)',
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.06)',
          padding: '18px 0',
          overflow: 'hidden',
        }}
      >
        <div
          ref={carouselRef}
          className="flex gap-16 items-center py-2"
          style={{
            width: '100%',
            overflow: 'hidden',
            scrollBehavior: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {[...universities, ...universities].map((u, i) => (
            <div key={u.name + i} className="flex flex-col items-center min-w-[200px]">
              <img
                src={u.logo}
                alt={u.name}
                style={{
                  width: 180,
                  height: 180,
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block',
                  background: 'none',
                }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 