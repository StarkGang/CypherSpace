"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaGithub, FaLinkedin, FaTwitter, FaDiscord, FaYoutube } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { api } from "../../lib/api";


const footerLinks = {
  Ecosystem: [
    { name: "Resources", path: "/resources" },
    { name: "Projects", path: "/projects" },
    { name: "Papers", path: "/papers" },
  ],
  Community: [
    { name: "Events", path: "/events" },
    { name: "Blog", path: "/blog" },
    { name: "Achievements", path: "/achievements" },
  ],
  "The Club": [
    { name: "About Us", path: "/about" },
    { name: "Team", path: "/team" },
    { name: "Contact", path: "/contact" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = React.useState(null);

  React.useEffect(() => {
    api.get("/settings").then(res => setSocialLinks(res.data.data.social_links || {})).catch(console.error);
  }, []);

  const socials = [
    { id: "github", icon: <FaGithub size={16} /> },
    { id: "linkedin", icon: <FaLinkedin size={16} /> },
    { id: "twitter", icon: <FaTwitter size={16} /> },
    { id: "instagram", icon: <FaInstagram size={16} /> },
    { id: "youtube", icon: <FaYoutube size={16} /> },
    { id: "discord", icon: <FaDiscord size={16} /> },
  ].filter(s => socialLinks && socialLinks[s.id]);

  return (
    <footer
      className="relative z-40 mt-20"
      style={{
        background: "var(--color-bg-surface)",
        borderTop: "1px solid var(--color-border-subtle)",
      }}
    >
      
      <div className="container mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          
          <div className="md:col-span-4 flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <img src="/logo.svg" alt="CypherSpace" className="w-full h-full object-contain" />
                </div>
                <span className="font-display font-bold text-xl">
                  <span style={{ color: "var(--color-text-primary)" }}>Cypher</span>
                  <span style={{ color: "#2563eb" }}>Space</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                A student-led blockchain and Web3 community building the decentralized future one block at a time at NSSCE.
              </p>
            </div>

            
            <div className="flex gap-3">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={socialLinks[s.id]}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
                  style={{
                    background: "var(--color-bg-dark)",
                    border: "1px solid var(--color-border-subtle)",
                    color: "var(--color-text-secondary)",
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "var(--color-border-glow)"; e.currentTarget.style.color = "#2563eb"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "var(--color-border-subtle)"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          
          <div className="md:col-span-8 grid grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <p
                  className="text-xs font-mono font-bold tracking-[0.15em] uppercase mb-4"
                  style={{ color: "#2563eb" }}
                >
                  {section}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {links.map((l) => (
                    <li key={l.name}>
                      <Link
                        href={l.path}
                        className="block py-1.5 text-sm transition-colors duration-200"
                        style={{ color: "var(--color-text-secondary)" }}
                        onMouseOver={e => (e.currentTarget.style.color = "#2563eb")}
                        onMouseOut={e => (e.currentTarget.style.color = "var(--color-text-secondary)")}
                      >
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        
        <div
          className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs"
          style={{
            borderTop: "1px solid var(--color-border-subtle)",
            color: "var(--color-text-muted)",
          }}
        >
          <p>© {year} CypherSpace • NSS College of Engineering, Palakkad</p>
          <p>
            Built with{" "}
            <span style={{ color: "#2563eb" }}>⛓</span> by <a href="https://github.com/fringelabs" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563eb] transition-colors">FringeLabs</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
