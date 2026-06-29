import React, { useEffect, useRef } from 'react';

export const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;

      constructor() {
        // Explode from bottom or center
        this.x = width / 2 + (Math.random() * 80 - 40);
        this.y = height + 10;
        this.size = Math.random() * 8 + 6;
        
        // Curated festive color palette
        const colors = [
          '#facc15', '#eab308', // Gold
          '#3b82f6', '#60a5fa', // Blue
          '#ef4444', '#f87171', // Red
          '#10b981', '#34d399', // Green
          '#ec4899', '#f472b6', // Pink
          '#a855f7', '#c084fc'  // Purple
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Burst velocity upwards and outwards
        this.speedX = Math.random() * 12 - 6;
        this.speedY = -(Math.random() * 14 + 10);
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.opacity = 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Apply gravity & air drag
        this.speedY += 0.3; // Gravity pulling down
        this.speedX *= 0.98; // Wind drag slowing horizontal speed
        this.rotation += this.rotationSpeed;

        // Fade out slowly when falling past half screen
        if (this.y > height / 2) {
          this.opacity -= 0.01;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        
        // Draw rectangle particle
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const particles: Particle[] = [];
    
    // Spawn initial burst of 150 particles
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }

    // Side spawns for continuous fireworks effect
    const spawnSideBurst = () => {
      if (particles.length > 300) return; // Cap maximum active particles
      
      // Left side burst
      for (let i = 0; i < 15; i++) {
        const p = new Particle();
        p.x = 0;
        p.y = height * 0.7;
        p.speedX = Math.random() * 10 + 5;
        p.speedY = -(Math.random() * 12 + 6);
        particles.push(p);
      }
      
      // Right side burst
      for (let i = 0; i < 15; i++) {
        const p = new Particle();
        p.x = width;
        p.y = height * 0.7;
        p.speedX = -(Math.random() * 10 + 5);
        p.speedY = -(Math.random() * 12 + 6);
        particles.push(p);
      }
    };

    // Trigger side bursts after 800ms
    const sideBurstTimeout = setTimeout(spawnSideBurst, 800);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        // Remove dead particles
        if (p.opacity <= 0 || p.y > height + 20) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Start loop
    animate();

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(sideBurstTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999]"
    />
  );
};
