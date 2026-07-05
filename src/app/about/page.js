"use client";

import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import SectionHeading from "../../components/design-system/SectionHeading";
import Paper from "../../components/design-system/Paper";
import Sticker from "../../components/design-system/Sticker";
import { PageSkeleton } from "../../components/ui/Skeleton";
import { api } from "../../lib/api";

export default function AboutPage() {
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

  return (
    <PageWrapper pattern="grid">
      <div className="container mx-auto max-w-4xl px-4">

        <SectionHeading
          title="About Us"
          subtitle="Blockchain Community @ NSS COLLEGE OF ENGINEERING, PALAKKAD"
          metadata="CLUB INFORMATION"
          className="mb-16"
          align="center"
        />

        <div className="relative mb-16">
          <div className="absolute -top-6 -right-6 z-10 hidden md:block">
            <Sticker color="lime" size="lg" rotate={15}>CYPHER SPACE @ NSSCE</Sticker>
          </div>

          <Paper variant="stacked" rotate={1} className="p-8 md:p-16 relative">
            <div className="font-body text-lg md:text-xl leading-relaxed text-[var(--color-text-primary)] whitespace-pre-wrap">
              {settings?.about_text || "Cypher Space is a community of makers, learners, and researchers passionate about Blockchain, Web3, and Decentralization."}
            </div>
          </Paper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <Paper variant="default" shadowSize="sm" rotate={-1} className="p-8">
            <h3 className="font-display font-black text-3xl uppercase mb-4 border-b-4 border-[var(--color-brand-secondary)] pb-2 inline-block">
              Our Vission
            </h3>
            <p className="font-body text-lg">
              We want NSSCE to be known as a place where serious blockchain engineering happens. Students who leave here should be capable of contributing to protocol teams, security audits, and cryptographic research — not just deploying templates.
            </p>
          </Paper>

          <Paper variant="default" shadowSize="sm" rotate={2} className="p-8">
            <h3 className="font-display font-black text-3xl uppercase mb-4 border-b-4 border-[var(--color-brand-tertiary)] pb-2 inline-block">
              What We Do
            </h3>
            <ul className="font-body text-lg list-disc list-inside space-y-2">
              <li>Paper Reading Sessions</li>
              <li>Collaborative Open Source Projects</li>
              <li>Workshops and Bootcamps</li>
              <li>Hackathons & Competitions</li>
            </ul>
          </Paper>
        </div>

      </div>
    </PageWrapper>
  );
}
