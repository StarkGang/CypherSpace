"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageWrapper from "../../../components/layout/PageWrapper";
import Paper from "../../../components/design-system/Paper";
import Sticker from "../../../components/design-system/Sticker";
import { PageSkeleton, CardSkeleton } from "../../../components/ui/Skeleton";
import Button from "../../../components/ui/Button";
import { format } from "date-fns";
import { api } from "../../../lib/api";

export default function BlogDetail() {
  const params = useParams();
  const slug = params?.slug;
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    
    const fetchPost = async () => {
      try {
        const res = await api.get(`/blogs/${slug}`);
        setPost(res.data.data);
      } catch (err) {
        setError("Post not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <PageWrapper>
      <div className="container mx-auto max-w-4xl px-4 py-20">
        <CardSkeleton />
      </div>
    </PageWrapper>;

  if (error || !post) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Paper className="text-center p-12" rotate={-1}>
            <h1 className="text-4xl font-display font-black uppercase mb-4">404 - Not Found</h1>
            <p className="font-mono mb-8">{error}</p>
            <Button href="/blog">Back to Notebook</Button>
          </Paper>
        </div>
      </PageWrapper>
    );
  }

  const renderBlock = (block, index) => {
    switch (block.type) {
      case "text":
        return (
          <div key={index} className="font-body text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-300 mb-8 whitespace-pre-wrap">
            {block.content}
          </div>
        );
      case "heading":
        return (
          <h2 key={index} className="font-display font-black text-3xl md:text-4xl uppercase mt-12 mb-6 dark:text-white">
            {block.content}
          </h2>
        );
      case "image":
        return (
          <div key={index} className="my-12">
            <div className="border-brutal overflow-hidden">
              <img src={block.content} alt={block.metadata?.caption || "Blog image"} className="w-full h-auto" />
            </div>
            {block.metadata?.caption && (
              <p className="font-mono text-sm text-center mt-3 text-gray-500 dark:text-gray-400 bg-[var(--color-paper-cream)] dark:bg-[#21262d] p-2 border-brutal inline-block mx-auto">
                {block.metadata.caption}
              </p>
            )}
          </div>
        );
      case "code":
        return (
          <div key={index} className="my-8 relative group">
            <div className="absolute top-0 right-0 bg-black text-white font-mono text-xs px-2 py-1 uppercase border-l border-b border-black z-10">
              {block.metadata?.language || "code"}
            </div>
            <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-6 overflow-x-auto font-mono text-sm md:text-base border-brutal shadow-[6px_6px_0px_#1A1A1A]">
              <code>{block.content}</code>
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PageWrapper pattern="gingham">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        
        <Paper variant="default" className="p-0 overflow-hidden" shadowSize="lg">
          
          {post.cover_image && (
            <div className="w-full h-64 md:h-[400px] bg-gray-100 dark:bg-gray-800 border-b-brutal relative overflow-hidden">
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 md:p-12 lg:p-16 bg-white dark:bg-[#161b22]">
            
            <div className="mb-12 text-center flex flex-col items-center">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {post.tags?.map((tag, i) => (
                  <Sticker key={i} color="pink" size="sm" animate={false}>{tag}</Sticker>
                ))}
              </div>
              
              <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-8 dark:text-white">
                {post.title}
              </h1>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 font-mono text-sm uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400 border-y-2 border-black dark:border-white py-4 w-full max-w-2xl">
                <span>By {post.author_name || "Community"}</span>
                {post.published_at && (
                  <span className="hidden md:inline">•</span>
                )}
                {post.published_at && (
                  <span>{format(new Date(post.published_at), 'MMMM dd, yyyy')}</span>
                )}
              </div>
            </div>

            <article className="max-w-3xl mx-auto">
              {post.blocks?.map((block, i) => renderBlock(block, i))}
            </article>

          </div>
        </Paper>
        
        <div className="mt-12 text-center">
          <Button href="/blog" variant="ghost">&larr; Back to Notebook</Button>
        </div>

      </div>
    </PageWrapper>
  );
}
