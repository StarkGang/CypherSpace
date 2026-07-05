"use client";
import React, { useEffect, useRef } from "react";

const NODE_COUNT = 80;
const CONNECT_DIST = 150;
const MOUSE_RADIUS = 200;
const SPEED = 0.4;

export default function NodeNetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let nodes = [];
    
    let mouse = { x: null, y: null };
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * SPEED * 2,
        vy: (Math.random() - 0.5) * SPEED * 2,
        r: Math.random() * 2 + 1,
      }));
    };
    
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          
          if (d < CONNECT_DIST) {
            const alpha = 1 - (d / CONNECT_DIST);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 0.4})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE_RADIUS) {
            const alpha = 1 - (d / MOUSE_RADIUS);
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 0.6})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            
            const force = (MOUSE_RADIUS - d) / MOUSE_RADIUS;
            n.vx -= (dx / d) * force * 0.05;
            n.vy -= (dy / d) * force * 0.05;
          }
        }
        
        
        const maxV = 1.5;
        if (n.vx > maxV) n.vx = maxV;
        if (n.vx < -maxV) n.vx = -maxV;
        if (n.vy > maxV) n.vy = maxV;
        if (n.vy < -maxV) n.vy = -maxV;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, 0.8)`;
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
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
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
        opacity: 0.6,
      }}
    />
  );
}
