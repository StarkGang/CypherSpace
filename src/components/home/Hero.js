"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiGithub, FiLink2 } from "react-icons/fi";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiCardano, SiTether, SiSolana, SiPolkadot, SiBinance } from "react-icons/si";

const FloatingBlocksLeft = () => {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-[15vw] max-w-[250px] hidden lg:block overflow-hidden pointer-events-none z-0">
      <div className="relative w-full h-full opacity-30">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-md bg-white/10"
            style={{
              width: "40px",
              height: "40px",
              left: `${(i % 4) * 50}px`,
              top: `${Math.floor(i / 4) * 50 + (i % 3) * 20}px`,
              opacity: Math.random() > 0.5 ? 0.7 : 0,
            }}
          />
        ))}

        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute rounded-lg flex items-center justify-center text-white"
          style={{ width: "40px", height: "40px", left: "60px", top: "100px", background: "#3b82f6" }}
        >
          <SiCardano size={24} />
        </motion.div>

        <motion.div 
          animate={{ y: [0, 15, 0] }} 
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
          className="absolute rounded-lg flex items-center justify-center text-white"
          style={{ width: "40px", height: "40px", left: "120px", top: "300px", background: "#10b981" }}
        >
          <FaEthereum size={24} />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
          className="absolute rounded-lg flex items-center justify-center text-white"
          style={{ width: "40px", height: "40px", left: "40px", top: "500px", background: "#f59e0b" }}
        >
          <FaBitcoin size={24} />
        </motion.div>
      </div>
    </div>
  );
};

const FloatingBlocksRight = () => {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-[15vw] max-w-[250px] hidden lg:block overflow-hidden pointer-events-none z-0">
      <div className="relative w-full h-full opacity-30">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-md bg-white/10"
            style={{
              width: "40px",
              height: "40px",
              right: `${(i % 4) * 50}px`,
              top: `${Math.floor(i / 4) * 50 + (i % 2) * 30}px`,
              opacity: Math.random() > 0.5 ? 0.7 : 0,
            }}
          />
        ))}

        <motion.div 
          animate={{ y: [0, 12, 0] }} 
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute rounded-lg flex items-center justify-center text-white"
          style={{ width: "40px", height: "40px", right: "80px", top: "150px", background: "#14b8a6" }}
        >
          <SiTether size={24} />
        </motion.div>

        <motion.div 
          animate={{ y: [0, -12, 0] }} 
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
          className="absolute rounded-lg flex items-center justify-center text-white"
          style={{ width: "40px", height: "40px", right: "120px", top: "350px", background: "#f3ba2f" }}
        >
          <SiBinance size={24} />
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
          className="absolute rounded-lg flex items-center justify-center text-white"
          style={{ width: "40px", height: "40px", right: "60px", top: "550px", background: "#0ea5e9" }}
        >
          <SiSolana size={24} />
        </motion.div>
      </div>
    </div>
  );
};


const CONCEPTS = [
  "Decentralized Applications",
  "Smart Contracts",
  "DeFi Protocols",
  "NFT Infrastructure",
  "Zero-Knowledge Proofs",
  "Cross-chain Bridges",
];

function TypingConcept() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = CONCEPTS[idx];
    let timeout;
    if (!deleting && text.length < target.length) {
      timeout = setTimeout(() => setText(target.slice(0, text.length + 1)), 55);
    } else if (!deleting && text.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 28);
    } else if (deleting && text.length === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setIdx((i) => (i + 1) % CONCEPTS.length);
      }, 0);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, idx]);

  return (
    <span style={{ color: "#2563eb" }}>
      {text}
      <span
        className="inline-block w-0.5 h-[1em] ml-0.5 align-middle"
        style={{
          background: "#2563eb",
        }}
      />
    </span>
  );
}

const TX_TYPES = ["TRANSFER", "STAKE", "DEPLOY", "VOTE", "MINT", "BRIDGE"];
const TX_STATUS = ["CONFIRMED", "CONFIRMED", "CONFIRMED", "PENDING"];

function BlockFeed({ activities = [] }) {
  const [entries, setEntries] = useState([]);
  const [statusText, setStatusText] = useState("LISTENING FOR BLOCKS...");
  const scrollRef = useRef(null);

  useEffect(() => {
    const states = [
      "LISTENING FOR BLOCKS...",
      "SYNCING MEMPOOL...",
      "VERIFYING PEERS...",
      "AWAITING TRANSACTIONS...",
    ];
    let i = 0;
    const int = setInterval(() => {
      i = (i + 1) % states.length;
      setStatusText(states[i]);
    }, 2500);
    return () => clearInterval(int);
  }, []);

  const getPath = (type, slug) => {
    const t = (type || "").toLowerCase();
    const map = {
      project: "/projects",
      event: "/events",
      paper: "/papers",
      resource: "/resources",
      blog: "/blog",
      achievement: "/achievements",
      team: "/team",
    };
    const base = map[t];
    if (!base) return null;
    if (t === "team" && !slug) return base;
    return slug ? `${base}/${slug}` : base;
  };

  useEffect(() => {
    const mappedReal = (activities || []).slice(0, 8).map((act) => {
      const safeId = String(act.id || act._id || "000000000000000000000000");
      const blockNum = parseInt(safeId.slice(0, 8) || "0", 16) % 100000000;
      return {
        id: safeId,
        isReal: true,
        block: isNaN(blockNum) ? 19458230 : blockNum,
        hash: "0x" + safeId.slice(-8).toUpperCase(),
        to: act.title || act.name || act.entity_slug || 'Unknown',
        type: (act.entity_type || 'SYS').toUpperCase(),
        rawStatus: act.type || 'LOG',
        ts: act.created_at ? new Date(act.created_at).getTime() : Date.now(),
        path: getPath(act.entity_type, act.entity_slug),
      };
    });

    const initialCount = Math.min(4, mappedReal.length);
    const startIndex = mappedReal.length - initialCount;
    
    setEntries(mappedReal.slice(startIndex));
    
    let i = startIndex - 1;
    const interval = setInterval(() => {
      setEntries((prev) => {
        if (i >= 0) {
          const next = [mappedReal[i], ...prev];
          i--;
          return next;
        }
        clearInterval(interval);
        return prev;
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, [activities]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [entries]);

  const ago = (ts) => {
    const s = Math.round((Date.now() - ts) / 1000);
    if (s < 60) return `${s}s ago`;
    return `${Math.round(s / 60)}m ago`;
  };

  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-subtle)",
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      }}
    >
      
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          borderBottom: "1px solid var(--color-border-subtle)",
          background: "var(--color-bg-dark)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold" style={{ color: "var(--color-text-secondary)" }}>
            Recent Network Activity
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: "#10b981",
            }}
          />
          <span className="text-xs font-mono" style={{ color: "#10b981" }}>
            LIVE
          </span>
        </div>
      </div>

      
      <div
        className="grid px-4 py-2 text-xs font-mono"
        style={{
          gridTemplateColumns: "90px 1fr 100px 70px",
          color: "var(--color-text-muted)",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}
      >
        <span>BLOCK</span>
        <span>ID → ENTITY</span>
        <span>TYPE</span>
        <span className="text-right">STATUS</span>
      </div>

      
      <div
        ref={scrollRef}
        className="overflow-y-auto"
        style={{ maxHeight: 280, scrollbarWidth: "none" }}
      >
        <AnimatePresence initial={false}>
          {entries.map((e) => {
            const RowWrapper = e.path ? Link : "div";
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b"
                style={{ borderColor: "var(--color-border-subtle)" }}
              >
                <RowWrapper
                  href={e.path || "#"}
                  className={`grid px-4 py-2.5 text-xs font-mono items-center w-full transition-colors ${e.path ? "hover:bg-[var(--color-bg-dark)] cursor-pointer group" : ""}`}
                  style={{ gridTemplateColumns: "90px 1fr 100px 70px" }}
                >
                  <span style={{ color: "#2563eb" }}>#{e.block.toLocaleString()}</span>
                  
                  <div className="flex flex-col min-w-0 pr-4">
                    <div className="truncate font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>
                      {e.to}
                    </div>
                    <div className="text-[10px] opacity-70 truncate" style={{ color: "var(--color-text-muted)" }}>
                      TX: {e.hash}
                    </div>
                  </div>

                  <span
                    style={{
                      color: e.type === "EVENT" ? "#4f46e5" : e.type === "PROJECT" ? "#10b981" : e.type === "PAPER" ? "#db2777" : e.type === "ACHIEVEMENT" ? "#f59e0b" : e.type === "BLOG" ? "#8b5cf6" : e.type === "TEAM" ? "#06b6d4" : e.type === "RESOURCE" || e.type === "RESOURCES" ? "#eab308" : "var(--color-text-secondary)",
                    }}
                  >
                    {e.type}
                  </span>
                  
                  <span
                    className="text-right flex items-center justify-end relative"
                    style={{
                      color: e.rawStatus === "created" ? "#10b981" : e.rawStatus === "updated" ? "#3b82f6" : "#ef4444",
                    }}
                  >
                    <span className={`transform transition-transform ${e.path ? "group-hover:-translate-x-4" : ""}`}>
                      {e.rawStatus === "created" ? "✓" : e.rawStatus === "updated" ? "✎" : "✕"}
                    </span>
                    {e.path && <span className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#2563eb" }}>→</span>}
                  </span>
                </RowWrapper>
              </motion.div>
            );
          })}
          
          
          <motion.div
            key="status-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid px-4 py-2.5 text-xs font-mono items-center border-b"
            style={{
              gridTemplateColumns: "90px 1fr 100px 70px",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <span style={{ color: "var(--color-text-secondary)" }}>
              <motion.span 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                █
              </motion.span>
            </span>
            <div style={{ color: "var(--color-text-muted)" }}>
              {statusText}
            </div>
            <span></span>
            <span className="text-right flex justify-end" style={{ color: "var(--color-text-secondary)" }}>
              <motion.span 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="inline-block"
              >
                ⟳
              </motion.span>
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      
      <div
        className="flex gap-6 px-4 py-3 text-xs font-mono"
        style={{
          borderTop: "1px solid var(--color-border-subtle)",
          background: "var(--color-bg-dark)",
        }}
      >
        <span style={{ color: "var(--color-text-muted)" }}>
          GAS: <span style={{ color: "var(--color-text-primary)" }}>34 Gwei</span>
        </span>
        <span style={{ color: "var(--color-text-muted)" }}>
          TPS: <span style={{ color: "var(--color-text-primary)" }}>2,841</span>
        </span>
        <span style={{ color: "var(--color-text-muted)" }}>
          NODES: <span style={{ color: "var(--color-text-primary)" }}>8,231</span>
        </span>
      </div>
    </div>
  );
}


export default function Hero({ settings, activities = [] }) {
  const heroTitle = settings?.hero_title || settings?.club_name || "CypherSpace";
  const heroHighlight = settings?.hero_highlight || "Blockchain Community, NSSCE";
  const heroSubtitle = settings?.hero_subtitle || "We bring together curious students who want to understand how cryptography and decentralized systems actually work — not through textbooks alone, but by building real things, solving real problems, and contributing to the open-source ecosystem that matters.";

  return (
    <section className="relative pt-4 pb-16 md:pt-8 md:pb-24 overflow-hidden min-h-[50vh]">
      
      <div className="absolute top-0 right-0 w-2/3 h-full opacity-60 pointer-events-none z-0">
        <div className="w-full h-full relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full filter blur-[120px]"></div>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full filter blur-[100px]"></div>
          
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <g stroke="url(#line-grad)" strokeWidth="1" fill="none">
              <path d="M100 200 L300 150 L500 300 L700 250 L800 400 L600 500 L400 450 Z" />
              <path d="M300 150 L400 50 L500 300" />
              <path d="M700 250 L900 150 L800 400" />
              <path d="M100 200 L200 400 L400 450" />
            </g>
            <g fill="var(--color-primary-accent)">
              <circle cx="100" cy="200" r="3" />
              <circle cx="300" cy="150" r="4" />
              <circle cx="500" cy="300" r="5" fill="#3b82f6" />
              <circle cx="700" cy="250" r="3" />
              <circle cx="800" cy="400" r="4" fill="#c084fc" />
              <circle cx="600" cy="500" r="3" />
              <circle cx="400" cy="450" r="4" />
              <circle cx="400" cy="50" r="3" />
              <circle cx="900" cy="150" r="3" />
              <circle cx="200" cy="400" r="3" />
            </g>
          </svg>
        </div>
      </div>

      <div className="w-full relative z-10 mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start pt-0 md:pt-4">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-8 lg:col-span-7"
          >
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-display font-bold uppercase leading-[0.9] mb-4 text-white"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                  letterSpacing: "-0.02em",
                  wordBreak: "break-word"
                }}
              >
                <div className="flex flex-col items-start">
                  <span>{heroTitle}</span>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                    <span className="text-[var(--color-primary-accent)] tracking-tighter leading-[1]" style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)" }}>
                      {heroHighlight}
                    </span>
                  </div>
                </div>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[15px] leading-relaxed max-w-lg text-[var(--color-text-secondary)]"
            >
              {heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/events" className="btn-solid-primary">
                View Events <FiArrowRight size={16} />
              </Link>
              <Link href="/about" className="btn-outline">
                <FiLink2 size={16} /> Join the Chain
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-col gap-3"
            >
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-gray-500">Building On</span>
              <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                <FaBitcoin size={28} className="text-white hover:text-[#f59e0b]" />
                <FaEthereum size={28} className="text-white hover:text-[#3b82f6]" />
                <SiSolana size={28} className="text-white hover:text-[#14b8a6]" />
                <SiPolkadot size={28} className="text-white hover:text-[#e6007a]" />
              </div>
            </motion.div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block lg:col-span-5 relative z-10"
          >
            <BlockFeed activities={activities} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

