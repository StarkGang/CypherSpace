"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu, FiX, FiChevronDown,
  FiDownload, FiBookOpen, FiBox, FiAward,
  FiCalendar, FiEdit3, FiUsers, FiInfo, FiMail,
  FiShield, FiLink, FiSun, FiMoon
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
            ? "var(--color-bg-surface)"
            : "transparent",
          borderBottom: scrolled
            ? "1px solid var(--color-border-subtle)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 6px -1px rgb(0 0 0 / 0.05)" : "none",
        }}
      >
        <nav className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              >
                <img src="/logo.svg" alt="CypherSpace" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight hidden sm:block">
                <span style={{ color: "var(--color-text-primary)" }}>Cypher</span>
                <span style={{ color: "#2563eb" }}>Space</span>
              </span>
            </div>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
            
            <img 
              src="/nssce-logo.webp" 
              alt="NSSCE" 
              className="h-8 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
              title="NSS College of Engineering" 
            />
          </Link>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Section Dropdowns */}
            {Object.entries(exploreSections).map(([section, links]) => (
              <div key={section} className="relative group">
                <button
                  className="flex items-center gap-1.5 px-2 lg:px-3 py-2 rounded-lg text-[10px] lg:text-xs font-mono font-bold tracking-[0.15em] uppercase transition-colors duration-200 group-hover:text-blue-600"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {section} <FiChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </button>
                
                {/* Dropdown Panel */}
                <div className="absolute top-full right-0 lg:left-0 lg:right-auto pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div 
                    className="w-[320px] p-4 rounded-2xl shadow-xl border flex flex-col gap-2"
                    style={{ 
                      background: "var(--color-bg-surface)",
                      borderColor: "var(--color-border-subtle)",
                    }}
                  >
                    <div className="px-2 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800/50">
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {section}
                      </span>
                    </div>
                    {links.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className="group/link flex items-start gap-4 p-2.5 rounded-xl transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          style={{ 
                            color: isActive(link.path) ? "#2563eb" : "currentColor"
                          }}
                        >
                          <span className="opacity-70 group-hover/link:opacity-100 transition-opacity">
                            {link.icon}
                          </span>
                        </div>
                        <div className="flex flex-col pt-0.5">
                          <span 
                            className="text-sm font-semibold transition-colors group-hover/link:text-blue-600"
                            style={{ color: isActive(link.path) ? "#2563eb" : "var(--color-text-primary)" }}
                          >
                            {link.name}
                          </span>
                          <span className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            {link.desc}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>

            <button
              onClick={toggleDark}
              className="p-2 rounded-lg transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              style={{ color: "var(--color-text-secondary)" }}
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <Link
              href="/contact"
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
              style={{ 
                background: "#2563eb",
                color: "#ffffff"
              }}
            >
              Contact
            </Link>

          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: "var(--color-text-primary)" }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden"
              style={{
                background: "var(--color-bg-surface)",
                borderTop: "1px solid var(--color-border-subtle)",
              }}
            >
              <div className="container mx-auto max-w-7xl px-4 py-4 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
                {Object.entries(exploreSections).map(([section, links]) => (
                  <div key={section} className="flex flex-col gap-2">
                    <p
                      className="text-[10px] font-mono font-bold tracking-[0.15em] uppercase px-2"
                      style={{ color: "#2563eb" }}
                    >
                      {section}
                    </p>
                    {links.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                        style={{
                          color: isActive(link.path) ? "#2563eb" : "var(--color-text-secondary)",
                          background: isActive(link.path) ? "rgba(37, 99, 235, 0.08)" : "transparent",
                        }}
                      >
                        {link.icon} {link.name}
                      </Link>
                    ))}
                  </div>
                ))}
                
                <div className="h-px w-full my-2" style={{ background: "var(--color-border-subtle)" }}></div>

                <Link
                  href="/contact"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <FiMail size={15} /> Contact
                </Link>
                <button
                  onClick={toggleDark}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {isDark ? <FiSun size={15} /> : <FiMoon size={15} />}
                  {isDark ? "Light Mode" : "Dark Mode"}
                </button>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
