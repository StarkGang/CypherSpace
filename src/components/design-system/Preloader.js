"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("has_seen_preloader");
    if (hasSeen) {
      setShouldRender(false);
      setLoading(false);
    } else {
      sessionStorage.setItem("has_seen_preloader", "true");
      
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#050505" }} 
        >
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.4, 0], scale: 1 }}
            transition={{ duration: 3.5, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] rounded-[100%] blur-[100px] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(0,0,0,0) 70%)" }}
          />

          
          <div className="relative z-10 flex items-center justify-center w-32 h-32 md:w-40 md:h-40 mb-12">
            <motion.div
              initial={{ scale: 0.7, opacity: 0, filter: "brightness(0) blur(20px)" }}
              animate={{ scale: 1.1, opacity: 1, filter: "brightness(1.2) blur(0px)" }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              <img 
                src="/logo.svg" 
                alt="CypherSpace" 
                fetchPriority="high"
                decoding="sync"
                className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(37,99,235,0.6)] relative z-10" 
              />
              
              
              <motion.div
                initial={{ backgroundPosition: "-200% 0" }}
                animate={{ backgroundPosition: "200% 0" }}
                transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  backgroundImage: "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.8) 50%, transparent 65%)",
                  backgroundSize: "200% 100%",
                  backgroundRepeat: "no-repeat",
                  maskImage: "url('/logo.svg')",
                  WebkitMaskImage: "url('/logo.svg')",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat"
                }}
              />
            </motion.div>
          </div>

          
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 15, letterSpacing: "0.05em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.35em" }}
              transition={{ delay: 1, duration: 2.2, ease: "easeOut" }}
              className="font-display text-lg md:text-xl font-bold uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] ml-[0.35em]"
            >
              Cypher Space <span style={{ color: "#3b82f6" }}></span>
            </motion.div>
            
            
            <motion.div
               initial={{ opacity: 0, letterSpacing: "0.1em" }}
               animate={{ opacity: 0.5, letterSpacing: "0.6em" }}
               transition={{ delay: 1.6, duration: 2.2, ease: "easeOut" }}
               className="font-mono text-[9px] md:text-[10px] uppercase text-blue-200 mt-4 ml-[0.6em]"
            >
               Blockchain Club @ NSSCE
            </motion.div>

            
            <div className="w-64 md:w-80 h-[1px] mt-10 overflow-hidden relative" style={{ background: "rgba(255,255,255,0.05)" }}>
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
