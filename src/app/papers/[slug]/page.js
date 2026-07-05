"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageWrapper from "../../../components/layout/PageWrapper";
import Paper from "../../../components/design-system/Paper";
import Sticker from "../../../components/design-system/Sticker";
import { PageSkeleton, CardSkeleton } from "../../../components/ui/Skeleton";
import Button from "../../../components/ui/Button";
import { FiExternalLink } from "react-icons/fi";
import { api } from "../../../lib/api";

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  } catch {
    return dateStr;
  }
}

export default function PaperDetail() {
  const params = useParams();
  const slug = params?.slug;
  
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    
    const fetchPaper = async () => {
      try {
        const res = await api.get(`/papers/${slug}`);
        setPaper(res.data.data);
      } catch (err) {
        setError("Paper not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [slug]);

  if (loading) return <PageWrapper>
      <div className="container mx-auto max-w-4xl px-4 py-20">
        <CardSkeleton />
      </div>
    </PageWrapper>;

  if (error || !paper) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Paper className="text-center p-12" rotate={-1}>
            <h1 className="text-4xl font-display font-black uppercase mb-4">404 - Not Found</h1>
            <p className="font-mono mb-8">{error}</p>
            <Button href="/papers">Back to Papers</Button>
          </Paper>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper pattern="grid">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        
        <Paper variant="default" className="p-8 md:p-16" shadowSize="lg">
          
          <div className="flex justify-between items-start mb-8">
            <Sticker color="yellow" size="md">RESEARCH PAPER</Sticker>
            {paper.date_discussed && (
              <div className="bg-black text-white font-mono font-bold px-3 py-1 text-sm uppercase">
                Discussed: {formatDate(paper.date_discussed)}
              </div>
            )}
          </div>

          <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-6">
            {paper.title}
          </h1>

          {paper.authors && paper.authors.length > 0 && (
            <div className="mb-10 p-4 border-2 border-dashed border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Authors</p>
              <p className="font-body font-bold text-lg dark:text-white">{paper.authors.join(", ")}</p>
            </div>
          )}

          {paper.paper_link && (
            <div className="mb-12">
              <Button href={paper.paper_link} variant="outline" icon={<FiExternalLink />}>
                Read Original Paper
              </Button>
            </div>
          )}

          {paper.summary && (
            <div className="border-t-4 border-black dark:border-white pt-8 mb-12">
              <h2 className="font-display font-black text-2xl uppercase mb-4 dark:text-white">Abstract / Summary</h2>
              <p className="font-body text-lg leading-relaxed text-gray-800 dark:text-gray-300">
                {paper.summary}
              </p>
            </div>
          )}

          {paper.takeaways && (
            <div className="border-t-4 border-black dark:border-white pt-8">
              <h2 className="font-display font-black text-2xl uppercase mb-6 bg-[var(--color-sticker-pink)] text-black inline-block px-2 border-brutal">
                Discussion Notes
              </h2>
              <div className="font-body text-lg leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-300 bg-[var(--color-paper-cream)] dark:bg-[#161b22] p-6 border-brutal shadow-[4px_4px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_#FFFFFF] rotate-[0.5deg]">
                {paper.takeaways}
              </div>
            </div>
          )}

        </Paper>
        
        <div className="mt-12 text-center">
          <Button href="/papers" variant="ghost">&larr; Back to reading list</Button>
        </div>

      </div>
    </PageWrapper>
  );
}
