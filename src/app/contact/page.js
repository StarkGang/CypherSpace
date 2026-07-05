"use client";

import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import SectionHeading from "../../components/design-system/SectionHeading";
import Paper from "../../components/design-system/Paper";
import { PageSkeleton } from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import { FaInstagram, FaGithub, FaLinkedin, FaTwitter, FaYoutube, FaEnvelope, FaDiscord } from "react-icons/fa";
import { api } from "../../lib/api";

export default function ContactPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        setSettings(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) return (
    <PageWrapper pattern="grid">
      <PageSkeleton />
    </PageWrapper>
  );

  const socialLinks = settings?.social_links || {};

  return (
    <PageWrapper pattern="gingham">
      <div className="container mx-auto max-w-4xl px-4">
        
        <SectionHeading 
          title="Get in Touch" 
          subtitle="Have a question or want to collaborate? Reach out to us."
          metadata="CONTACT INFORMATION"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          
          <Paper variant="pinned" shadowSize="md" rotate={-1} className="p-8">
            <h3 className="font-display font-black text-3xl uppercase mb-6 border-b-4 border-[var(--color-border-subtle)] pb-2">
              Follow Us
            </h3>
            
            <div className="flex flex-col gap-4">
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                  <div className="p-3 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] group-hover:bg-[var(--color-brand-secondary)]/20 group-hover:text-[var(--color-brand-secondary)] transition-colors rounded-md">
                    <FaInstagram size={24} />
                  </div>
                  <span className="font-mono font-bold uppercase group-hover:underline">Instagram</span>
                </a>
              )}
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                  <div className="p-3 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] group-hover:bg-[var(--color-text-primary)]/10 transition-colors rounded-md">
                    <FaGithub size={24} />
                  </div>
                  <span className="font-mono font-bold uppercase group-hover:underline">GitHub</span>
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                  <div className="p-3 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] group-hover:bg-[var(--color-brand-tertiary)]/20 group-hover:text-[var(--color-brand-tertiary)] transition-colors rounded-md">
                    <FaLinkedin size={24} />
                  </div>
                  <span className="font-mono font-bold uppercase group-hover:underline">LinkedIn</span>
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                  <div className="p-3 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors rounded-md">
                    <FaTwitter size={24} />
                  </div>
                  <span className="font-mono font-bold uppercase group-hover:underline">Twitter</span>
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                  <div className="p-3 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors rounded-md">
                    <FaYoutube size={24} />
                  </div>
                  <span className="font-mono font-bold uppercase group-hover:underline">YouTube</span>
                </a>
              )}
              {socialLinks.discord && (
                <a href={socialLinks.discord} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                  <div className="p-3 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] group-hover:bg-[#5865F2]/20 group-hover:text-[#5865F2] transition-colors rounded-md">
                    <FaDiscord size={24} />
                  </div>
                  <span className="font-mono font-bold uppercase group-hover:underline">Discord</span>
                </a>
              )}
            </div>
          </Paper>

          <Paper variant="default" shadowSize="lg" rotate={1} className="p-8 flex flex-col justify-center text-center">
            <div className="w-20 h-20 bg-[var(--color-brand-primary)]/10 rounded-full border border-[var(--color-brand-primary)]/30 mx-auto mb-6 flex items-center justify-center text-[var(--color-brand-primary)]">
              <FaEnvelope size={32} />
            </div>
            <h3 className="font-display font-black text-3xl uppercase mb-4">
              Email Us
            </h3>
            <p className="font-body text-[var(--color-text-secondary)] text-lg mb-8">
              For general inquiries, partnerships, or sponsorships.
            </p>
            <Button href={`mailto:${socialLinks.email}`} variant="primary">
              Send an Email
            </Button>
          </Paper>

        </div>

      </div>
    </PageWrapper>
  );
}
