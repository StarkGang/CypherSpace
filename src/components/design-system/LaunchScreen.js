"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!targetDate) return;
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          total: difference
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}


function HoldToPowerUp({ onUnlock }) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const startHolding = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(intervalRef.current);
          onUnlock();
          return 100;
        }
        return p + 2;
      });
    }, 50);
  };

  const stopHolding = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 flex items-center justify-center">
        
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle cx="80" cy="80" r="76" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
          <circle 
            cx="80" cy="80" r="76" 
            stroke="#2563eb" 
            strokeWidth="4" 
            fill="none" 
            strokeDasharray={477} 
            strokeDashoffset={477 - (progress / 100) * 477} 
            className="transition-all duration-75 ease-linear"
          />
        </svg>
        <motion.button
          onPointerDown={startHolding}
          onPointerUp={stopHolding}
          onPointerLeave={stopHolding}
          whileTap={{ scale: 0.95 }}
          className="w-32 h-32 rounded-full bg-[#111] border border-blue-500/30 flex items-center justify-center cursor-pointer select-none relative z-10 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="font-mono text-sm uppercase font-bold text-blue-400 tracking-widest relative z-10 pointer-events-none">
            Hold
          </span>
        </motion.button>
      </div>
      <p className="mt-6 font-mono text-[10px] text-slate-500 uppercase tracking-[0.3em]">
        Hold to initialize
      </p>
    </div>
  );
}


function SlideToUnlock({ onUnlock }) {
  const containerRef = useRef(null);
  const handleDrag = (e, info) => {
    
    if (info.offset.x > 200) {
      onUnlock();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={containerRef}
        className="w-80 h-16 rounded-full bg-[#111] border border-slate-800 relative overflow-hidden flex items-center shadow-inner"
      >
        <span className="absolute w-full text-center font-mono text-xs uppercase tracking-widest text-slate-500 pointer-events-none">
          Slide to authorize
        </span>
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.05}
          onDragEnd={handleDrag}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-blue-600 rounded-full ml-1 flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shadow-lg"
        >
          <span className="text-white text-lg">→</span>
        </motion.div>
      </div>
    </div>
  );
}


function PasscodeEntry({ onUnlock }) {
  const [code, setCode] = useState("");
  const targetCode = "LAUNCH";
  
  useEffect(() => {
    if (code.toUpperCase() === targetCode) {
      setTimeout(onUnlock, 400);
    }
  }, [code, onUnlock]);

  return (
    <div className="flex flex-col items-center relative z-20">
      <p className="font-mono text-xs text-blue-400 uppercase tracking-widest mb-4">
        Enter Authorization Code
      </p>
      <div className="flex gap-2 relative">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-12 h-16 bg-[#111] border-b-2 border-slate-700 flex items-center justify-center text-2xl font-mono text-white pointer-events-none">
            {code[i] || ""}
          </div>
        ))}
        <input 
          type="text" 
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
          className="absolute inset-0 opacity-0 w-full h-full cursor-text"
          autoFocus
        />
      </div>
      <p className="mt-8 font-mono text-[10px] text-slate-600">
        HINT: LAUNCH
      </p>
    </div>
  );
}

export default function LaunchScreen({ launchDate, launchAction = "hold", onUnlock }) {
  const timeLeft = useCountdown(launchDate);
  const [shattering, setShattering] = useState(false);

  const handleUnlock = () => {
    setShattering(true);
    setTimeout(() => {
      onUnlock();
    }, 1500);
  };

  if (!timeLeft) return null;

  const isTimeUp = timeLeft.total <= 0;

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "#050505" }}
      >
        
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none transition-opacity duration-1000"
          style={{ 
            background: isTimeUp ? "radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(0,0,0,0) 70%)" : "radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 70%)",
            opacity: shattering ? 0 : 1
          }}
        />

        <div className={`relative z-10 flex flex-col items-center transition-all duration-1000 ${shattering ? "scale-150 blur-3xl opacity-0" : "scale-100 opacity-100"}`}>
          
          
          <div className="flex flex-col items-center mb-24">
            <img src="/logo.svg" alt="CypherSpace Logo" className="w-20 h-20 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
            <h1 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-[0.3em] text-white">
              CypherSpace
            </h1>
            <div className="mt-8 flex items-center gap-6">
              <div className="h-px w-16 bg-slate-800"></div>
              <img src="/nssce-logo.webp" alt="NSS College of Engineering" className="h-10 w-auto object-contain grayscale opacity-50" />
              <div className="h-px w-16 bg-slate-800"></div>
            </div>
          </div>

          <div className="min-h-[200px] flex flex-col items-center justify-center">
            {!isTimeUp ? (
              
              <div className="flex gap-6 md:gap-10 text-center">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds }
                ].map((unit, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="font-mono text-5xl md:text-7xl font-bold text-white tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      {unit.value.toString().padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-slate-500 mt-6">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                {launchAction === "hold" && <HoldToPowerUp onUnlock={handleUnlock} />}
                {launchAction === "slide" && <SlideToUnlock onUnlock={handleUnlock} />}
                {launchAction === "passcode" && <PasscodeEntry onUnlock={handleUnlock} />}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
