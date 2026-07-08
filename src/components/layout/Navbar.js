"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu, FiX, FiChevronDown,
  FiDownload, FiBookOpen, FiBox, FiAward,
  FiCalendar, FiEdit3, FiUsers, FiInfo, FiMail,
  FiShield, FiLink, FiSun, FiMoon, FiArrowRight
} from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useTheme } from "../ThemeProvider";
import Image from "next/image";

const exploreSections = {
  Ecosystem: [
    { name: "Resources", path: "/resources", icon: <FiBookOpen size={15} />, desc: "Learning materials" },
    { name: "Projects", path: "/projects", icon: <FiBox size={15} />, desc: "Our open source work" },
    { name: "Papers", path: "/papers", icon: <FiDownload size={15} />, desc: "Research and papers" },
  ],
  Community: [
    { name: "Events", path: "/events", icon: <FiCalendar size={15} />, desc: "Upcoming meetups" },
    { name: "Blog", path: "/blog", icon: <FiEdit3 size={15} />, desc: "Latest articles" },
    { name: "Achievements", path: "/achievements", icon: <FiAward size={15} />, desc: "Milestones reached" },
  ],
  "The Club": [
    { name: "About Us", path: "/about", icon: <FiInfo size={15} />, desc: "Who we are" },
    { name: "Team", path: "/team", icon: <FiUsers size={15} />, desc: "Meet the members" },
    { name: "Contact", path: "/contact", icon: <FiMail size={15} />, desc: "Get in touch" },
  ],
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isDark, toggleDark } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setTimeout(() => setIsOpen(false), 0); }, [pathname]);

  const isActive = (path) => pathname === path || pathname.startsWith(path + "/");

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(10, 14, 22, 0.95)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--color-glass-border)"
            : "1px solid transparent",
        }}
      >
        <nav className="w-full max-w-[1600px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              >
                <img src="/logo.svg" alt="CypherSpace" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight hidden sm:block uppercase">
                <span style={{ color: "var(--color-text-primary)" }}>Cypher</span>
                <span style={{ color: "var(--color-primary-accent)" }}>Space</span>
              </span>
            </div>
            
          </Link>
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {Object.entries(exploreSections).map(([section, links]) => (
              <div key={section} className="relative group">
                <button
                  className="flex items-center gap-1.5 py-2 text-sm font-medium transition-colors duration-200 hover:text-white"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {section} <FiChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full right-0 lg:left-1/2 lg:-translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div 
                    className="w-[280px] p-2 rounded-xl shadow-2xl border flex flex-col gap-1"
                    style={{ 
                      background: "var(--color-bg-surface)",
                      borderColor: "var(--color-glass-border)",
                    }}
                  >
                    {links.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className="group/link flex items-center gap-3 p-3 rounded-lg transition-all duration-200"
                        style={{ background: isActive(link.path) ? "var(--color-glass-hover)" : "transparent" }}
                        onMouseOver={(e) => e.currentTarget.style.background = "var(--color-glass-hover)"}
                        onMouseOut={(e) => e.currentTarget.style.background = isActive(link.path) ? "var(--color-glass-hover)" : "transparent"}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                          style={{ 
                            background: "var(--color-bg-deep)",
                            color: isActive(link.path) ? "var(--color-primary-accent)" : "var(--color-text-secondary)"
                          }}
                        >
                          {link.icon}
                        </div>
                        <div className="flex flex-col">
                          <span 
                            className="text-sm font-semibold transition-colors"
                            style={{ color: isActive(link.path) ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}
                          >
                            {link.name}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/contact"
              className="btn-solid-primary"
            >
              Contact <FiArrowRight size={16} />
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: "var(--color-text-primary)" }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </nav>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden"
              style={{
                background: "var(--color-bg-deep)",
                borderTop: "1px solid var(--color-glass-border)",
              }}
            >
              <div className="w-full px-6 py-6 flex flex-col gap-6 max-h-[calc(100vh-80px)] overflow-y-auto hide-scrollbar pb-12">
                {Object.entries(exploreSections).map(([section, links]) => (
                  <div key={section} className="flex flex-col gap-2">
                    <p
                      className="text-xs font-mono font-bold tracking-[0.15em] uppercase px-2 mb-2"
                      style={{ color: "var(--color-primary-accent)" }}
                    >
                      {section}
                    </p>
                    {links.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className="flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-bold transition-all active:scale-[0.98]"
                        style={{
                          color: isActive(link.path) ? "white" : "var(--color-text-secondary)",
                          background: isActive(link.path) ? "rgba(255, 255, 255, 0.05)" : "transparent",
                          border: isActive(link.path) ? "1px solid var(--color-glass-border)" : "1px solid transparent",
                        }}
                      >
                        <span className={isActive(link.path) ? "text-[var(--color-primary-accent)]" : "opacity-60"}>{link.icon}</span> 
                        {link.name}
                      </Link>
                    ))}
                  </div>
                ))}
                
                <div className="h-px w-full my-2" style={{ background: "var(--color-glass-border)" }}></div>

                <Link
                  href="/contact"
                  className="btn-solid-primary w-full justify-center mt-2 mb-4"
                >
                  Contact <FiArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
