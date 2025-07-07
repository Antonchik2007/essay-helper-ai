import React, { useEffect, useState } from 'react';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const animationStyle = {
    animation: 'scroll 30s linear infinite',
    width: 'max-content',
  };

  const keyframes = `
    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-${universities.length * (isMobile ? 140 : 220)}px);
      }
    }
  `;

  return (
    <section className="my-10 text-center">
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
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
          className="flex gap-8 sm:gap-16 items-center py-2"
          style={animationStyle}
        >
          {[...universities, ...universities, ...universities].map((u, i) => (
            <div key={u.name + i} className="flex flex-col items-center min-w-[140px] sm:min-w-[220px]">
              <img
                src={u.logo}
                alt={u.name}
                style={{
                  width: isMobile ? 120 : 200,
                  height: isMobile ? 120 : 200,
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