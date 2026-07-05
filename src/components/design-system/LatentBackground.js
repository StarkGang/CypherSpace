"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "../ThemeProvider";

export default function LatentBackground() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    
    let animationFrameId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.5 + 1.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          twinkleSpeed: Math.random() * 0.08 + 0.05,
          alpha: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isDarkMode = document.documentElement.classList.contains("dark");
      const dotColor = isDarkMode ? "255, 255, 255" : "168, 85, 247";
      const linkColor = isDarkMode ? "168, 85, 247" : "147, 51, 234"; 

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.twinkleSpeed;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        
        const baseAlpha = (Math.sin(p.alpha) + 1) / 2;
        const currentAlpha = Math.pow(baseAlpha, 3) * 0.9 + 0.1; 
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, ${currentAlpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < 15000) { 
            const distance = Math.sqrt(distanceSq);
            const lineOpacity = (1 - distance / 122) * 0.15;
            
            if (lineOpacity > 0) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${linkColor}, ${lineOpacity})`;
              ctx.lineWidth = 0.6;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]); 

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${!isDark ? 'hidden' : ''}`}
      style={{ opacity: 0.6 }} 
    />
  );
}
