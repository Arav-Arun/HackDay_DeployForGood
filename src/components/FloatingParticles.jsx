import React from "react";

// Pre-computed random positions to avoid Math.random() at render time
const PARTICLE_POSITIONS = [
  { left: 12, top: 8, delay: 0, duration: 9, size: 3, opacity: 0.4 },
  { left: 85, top: 15, delay: 2, duration: 10, size: 4, opacity: 0.5 },
  { left: 45, top: 23, delay: 4, duration: 8, size: 2, opacity: 0.35 },
  { left: 67, top: 42, delay: 1, duration: 11, size: 5, opacity: 0.45 },
  { left: 23, top: 55, delay: 3, duration: 9, size: 3, opacity: 0.4 },
  { left: 90, top: 68, delay: 5, duration: 10, size: 4, opacity: 0.5 },
  { left: 34, top: 78, delay: 2, duration: 8, size: 2, opacity: 0.35 },
  { left: 56, top: 88, delay: 6, duration: 11, size: 5, opacity: 0.45 },
  { left: 78, top: 35, delay: 1, duration: 9, size: 3, opacity: 0.4 },
  { left: 5, top: 92, delay: 7, duration: 10, size: 4, opacity: 0.5 },
  { left: 18, top: 32, delay: 3, duration: 8, size: 2, opacity: 0.35 },
  { left: 72, top: 62, delay: 4, duration: 11, size: 5, opacity: 0.45 },
  { left: 38, top: 12, delay: 0, duration: 9, size: 3, opacity: 0.4 },
  { left: 95, top: 48, delay: 5, duration: 10, size: 4, opacity: 0.5 },
  { left: 52, top: 72, delay: 2, duration: 8, size: 2, opacity: 0.35 },
  { left: 8, top: 58, delay: 6, duration: 11, size: 5, opacity: 0.45 },
  { left: 28, top: 85, delay: 1, duration: 9, size: 3, opacity: 0.4 },
  { left: 62, top: 18, delay: 7, duration: 10, size: 4, opacity: 0.5 },
  { left: 82, top: 95, delay: 3, duration: 8, size: 2, opacity: 0.35 },
  { left: 48, top: 5, delay: 4, duration: 11, size: 5, opacity: 0.45 },
];

const FloatingParticles = ({ count = 20 }) => {
  const particles = PARTICLE_POSITIONS.slice(0, count);

  return (
    <div
      className="floating-particles"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {particles.map((particle, i) => (
        <div
          key={i}
          className="particle animate-float"
          style={{
            position: "absolute",
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(212, 168, 83, ${particle.opacity}), transparent)`,
            borderRadius: "50%",
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
