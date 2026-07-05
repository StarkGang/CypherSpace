"use client";

import React, { useEffect, useRef } from "react";

export default function NeobrutalistBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    let animationFrameId;
    let shapes = [];
    let mouse = { x: null, y: null };

    const lightColors = ["#FF6B9D", "#A8E610", "#FFE156", "#4ECDC4"];
    const darkColors = ["#FF2A6D", "#CFFF04", "#FFD700", "#05D5FA"];
    const checkTheme = () => document.documentElement.classList.contains("dark");
    let isDark = checkTheme();

    const observer = new MutationObserver(() => {
      isDark = checkTheme();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initShapes();
    };

    const initShapes = () => {
      shapes = [];
      const numShapes = Math.min(Math.floor((canvas.width * canvas.height) / 35000), 25);
      
      for (let i = 0; i < numShapes; i++) {
        const type = Math.random();
        shapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 30 + 15,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.02,
          colorIndex: Math.floor(Math.random() * lightColors.length),
          type: type < 0.2 ? 'star' : type < 0.4 ? 'node' : type < 0.6 ? 'brain' : type < 0.8 ? 'vector' : 'neuron'
        });
      }
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const strokeColor = isDark ? "rgba(255,255,255,0.9)" : "#1A1A1A"; 
      
      shapes.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.vRot;
        if (s.x < -s.size) s.x = canvas.width + s.size;
        if (s.x > canvas.width + s.size) s.x = -s.size;
        if (s.y < -s.size) s.y = canvas.height + s.size;
        if (s.y > canvas.height + s.size) s.y = -s.size;
        let dx = 0;
        let dy = 0;
        if (mouse.x && mouse.y) {
          dx = (mouse.x - canvas.width / 2) * 0.03 * (s.size / 50);
          dy = (mouse.y - canvas.height / 2) * 0.03 * (s.size / 50);
        }

        ctx.save();
        ctx.translate(s.x - dx, s.y - dy);
        ctx.rotate(s.rotation);
        ctx.shadowColor = strokeColor;
        ctx.shadowOffsetX = isDark ? 4 : 5;
        ctx.shadowOffsetY = isDark ? 4 : 5;
        ctx.shadowBlur = 0;

        ctx.beginPath();
        if (s.type === 'star') {
          ctx.moveTo(0, -s.size);
          ctx.quadraticCurveTo(0, -s.size * 0.2, s.size, 0);
          ctx.quadraticCurveTo(0, s.size * 0.2, 0, s.size);
          ctx.quadraticCurveTo(0, s.size * 0.2, -s.size, 0);
          ctx.quadraticCurveTo(0, -s.size * 0.2, 0, -s.size);
          ctx.closePath();
        } else if (s.type === 'node') {
          ctx.arc(0, 0, s.size * 0.4, 0, Math.PI * 2);
          ctx.rect(s.size * 0.2, -s.size * 0.5, s.size * 0.6, s.size * 0.15);
          ctx.arc(s.size * 0.8, -s.size * 0.425, s.size * 0.25, 0, Math.PI * 2);
          ctx.rect(-s.size * 0.8, -s.size * 0.8, s.size * 0.6, s.size * 0.15);
          ctx.arc(-s.size * 0.8, -s.size * 0.725, s.size * 0.25, 0, Math.PI * 2);
          ctx.rect(-s.size * 0.6, s.size * 0.6, s.size * 0.6, s.size * 0.15);
          ctx.arc(-s.size * 0.6, s.size * 0.675, s.size * 0.25, 0, Math.PI * 2);
        } else if (s.type === 'brain') {
          ctx.moveTo(-s.size * 0.05, -s.size * 0.8);
          ctx.bezierCurveTo(-s.size * 0.6, -s.size * 1.0, -s.size * 1.2, -s.size * 0.4, -s.size * 1.0, 0);
          ctx.bezierCurveTo(-s.size * 1.2, s.size * 0.5, -s.size * 0.6, s.size * 1.0, -s.size * 0.05, s.size * 0.8);
          ctx.closePath();
          ctx.moveTo(s.size * 0.05, -s.size * 0.8);
          ctx.bezierCurveTo(s.size * 0.6, -s.size * 1.0, s.size * 1.2, -s.size * 0.4, s.size * 1.0, 0);
          ctx.bezierCurveTo(s.size * 1.2, s.size * 0.5, s.size * 0.6, s.size * 1.0, s.size * 0.05, s.size * 0.8);
          ctx.closePath();
        } else if (s.type === 'vector') {
          ctx.rect(-s.size * 0.8, -s.size * 0.8, s.size * 0.2, s.size * 1.6);
          ctx.rect(-s.size * 0.8, s.size * 0.6, s.size * 1.6, s.size * 0.2);
          ctx.moveTo(-s.size * 0.4, s.size * 0.4);
          ctx.lineTo(s.size * 0.6, -s.size * 0.6);
          ctx.lineTo(s.size * 0.6, -s.size * 0.2);
          ctx.lineTo(s.size * 0.8, -s.size * 0.8);
          ctx.lineTo(s.size * 0.2, -s.size * 0.8);
          ctx.lineTo(s.size * 0.4, -s.size * 0.6);
          ctx.lineTo(-s.size * 0.6, s.size * 0.4);
          ctx.closePath();
        } else {
          ctx.arc(0, 0, s.size * 0.4, 0, Math.PI * 2);
          ctx.rect(s.size * 0.3, -s.size * 0.1, s.size * 0.8, s.size * 0.2);
          ctx.arc(s.size * 1.2, -s.size * 0.2, s.size * 0.15, 0, Math.PI * 2);
          ctx.arc(s.size * 1.2, s.size * 0.2, s.size * 0.15, 0, Math.PI * 2);
          ctx.rect(-s.size * 0.8, -s.size * 0.6, s.size * 0.6, s.size * 0.15);
          ctx.rect(-s.size * 0.8, s.size * 0.45, s.size * 0.6, s.size * 0.15);
          ctx.rect(-s.size * 0.6, -s.size * 0.1, s.size * 0.4, s.size * 0.2);
        }

        ctx.fillStyle = isDark ? darkColors[s.colorIndex] : lightColors[s.colorIndex];
        ctx.fill();
        if (s.type === 'brain') {
          ctx.moveTo(-s.size * 0.3, -s.size * 0.6);
          ctx.bezierCurveTo(-s.size * 0.8, -s.size * 0.5, -s.size * 0.8, -s.size * 0.1, -s.size * 0.3, 0);
          ctx.bezierCurveTo(-s.size * 0.9, s.size * 0.1, -s.size * 0.9, s.size * 0.6, -s.size * 0.3, s.size * 0.6);
          ctx.moveTo(s.size * 0.3, -s.size * 0.6);
          ctx.bezierCurveTo(s.size * 0.8, -s.size * 0.5, s.size * 0.8, -s.size * 0.1, s.size * 0.3, 0);
          ctx.bezierCurveTo(s.size * 0.9, s.size * 0.1, s.size * 0.9, s.size * 0.6, s.size * 0.3, s.size * 0.6);
        }
  
        ctx.shadowColor = "transparent";
        ctx.lineWidth = 3;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-40"
      style={{ opacity: 0.9 }}
    />
  );
}
