"use client";
import React, { useEffect, useRef } from "react";

const NODE_COUNT = 45;
const CONNECT_DIST = 140;
const SPEED = 0.25;

function mkNode(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * SPEED,
    vy: (Math.random() - 0.5) * SPEED,
    r: Math.random() * 2 + 1.5,
    phase: Math.random() * Math.PI * 2,
    phaseSpeed: Math.random() * 0.018 + 0.006,
    flash: false,
    flashTimer: 0,
    type: Math.random() > 0.7 ? "blue" : "teal",
  };
}

export default function BlockchainBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let nodes = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      nodes = Array.from({ length: NODE_COUNT }, () =>
        mkNode(canvas.width, canvas.height)
      );
    };
    resize();
    window.addEventListener("resize", resize);

    
    let flashTimeout;
    const triggerFlash = () => {
      const n = nodes[Math.floor(Math.random() * nodes.length)];
      if (n) { n.flash = true; n.flashTimer = 40; }
      flashTimeout = setTimeout(triggerFlash, Math.random() * 1800 + 400);
    };
    triggerFlash();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.18;
            
            ctx.setLineDash([4, 6]);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.flash || b.flash
              ? `rgba(0, 212, 170, ${alpha * 2.5})`
              : `rgba(67, 97, 238, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      
      for (const n of nodes) {
        n.phase += n.phaseSpeed;
        const glow = n.r + Math.sin(n.phase) * 1.2;

        if (n.flash) {
          n.flashTimer--;
          if (n.flashTimer <= 0) n.flash = false;
        }

        const rgb = n.flash ? "0, 212, 170" : n.type === "teal" ? "0, 212, 170" : "67, 97, 238";
        const alpha = n.flash ? 1 : 0.45 + Math.sin(n.phase) * 0.2;

        
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glow * 5);
        grad.addColorStop(0, `rgba(${rgb}, ${alpha * 0.35})`);
        grad.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, glow * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        
        ctx.beginPath();
        ctx.arc(n.x, n.y, glow, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
        ctx.fill();

        
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(flashTimeout);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.75,
      }}
    />
  );
}
