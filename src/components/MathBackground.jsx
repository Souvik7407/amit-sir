import React, { useEffect, useRef } from 'react';

const mathSymbols = [
  '∫ f(x)dx', '∑ x_i', 'lim x→0', 'π', 'e^{iπ} + 1 = 0',
  'a² + b² = c²', 'f(x) = sin(x)', '∞', '√x', 'θ',
  'dy/dx', '∂y/∂x', 'Δx → 0', 'log(x)', 'Matrix A × B',
  'y = mx + c', 'sin²θ + cos²θ = 1', 'E = mc²', '∇ × B', 'x = (-b ± √Δ)/2a'
];

export default function MathBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle screen resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize symbols particle list
    const particles = mathSymbols.map((symbol) => ({
      text: symbol,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4, // ultra slow drift
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.floor(Math.random() * 8) + 12, // 12px to 20px
      opacity: Math.random() * 0.4 + 0.1, // very light overlay
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.005
    }));

    // Sine wave phase
    let phase = 0;

    // Draw Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Math Graph Grid Overlay
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)'; // soft white coordinate plane grid
      ctx.lineWidth = 1;
      
      // Vertical grid lines
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = 0; y < height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw a flowing Sine Wave across center/bottom
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)'; // white flowing sine wave
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const waveY = height * 0.75; // vertical centering of wave
      for (let x = 0; x < width; x++) {
        const y = waveY + Math.sin(x * 0.004 + phase) * 80 + Math.cos(x * 0.0015 + phase * 0.5) * 20;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Tracing a second out-of-phase cosine wave
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)'; // secondary white cosine wave
      ctx.beginPath();
      const waveY2 = height * 0.4;
      for (let x = 0; x < width; x++) {
        const y = waveY2 + Math.cos(x * 0.005 + phase * 0.8) * 60;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      phase += 0.005; // speed of wave animation

      // 3. Render and Update Floating Math Equations
      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.font = `bold ${p.size}px 'Outfit', sans-serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.65})`; // chalk-like white text
        ctx.fillText(p.text, 0, 0);
        ctx.restore();

        // Update positions
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;

        // Wrap around borders
        if (p.x < -150) p.x = width + 100;
        if (p.x > width + 150) p.x = -100;
        if (p.y < -100) p.y = height + 100;
        if (p.y > height + 100) p.y = -100;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.85
      }}
    />
  );
}
