import React from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import SectionHeading from "../../components/design-system/SectionHeading";
import Paper from "../../components/design-system/Paper";
import Sticker from "../../components/design-system/Sticker";
import Link from "next/link";
import { format } from "date-fns";
import { FiExternalLink } from "react-icons/fi";
import { getBlogs } from "../../lib/data";

export default async function BlogList() {
  const posts = await getBlogs(50);

  return (
    <PageWrapper pattern="grid">
      <div className="container mx-auto max-w-5xl px-4">
        
        <SectionHeading 
          title="Notebook" 
          subtitle="Thoughts, tutorials, and updates from the community."
          metadata="CLUB BLOG"
          className="mb-16"
        />

        <div className="flex flex-col gap-12">
          {posts.length > 0 ? (
            posts.map((post, i) => (
              <div key={post.id} className="relative group">
                <Paper variant={i % 2 === 0 ? "stacked" : "default"} rotate={i % 2 === 0 ? 1 : -1} className="p-0 overflow-hidden hover:z-20 hover:scale-[1.01] transition-all duration-300">
                  {post.external_url ? (
                    <a href={post.external_url} target="_blank" rel="noopener noreferrer" className="flex flex-col md:flex-row h-full">
                      {post.cover_image && (
                        <div className="w-full md:w-1/3 h-48 md:h-auto border-b-brutal md:border-b-0 md:border-r-brutal overflow-hidden">
                          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                      )}
                      
                      <div className={`p-6 md:p-8 flex flex-col ${post.cover_image ? 'md:w-2/3' : 'w-full'}`}>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags?.map((tag, j) => (
                            <Sticker key={j} color="pink" size="sm" animate={false}>{tag}</Sticker>
                          ))}
                        </div>
                        
                        <h3 className="font-display font-black text-3xl md:text-4xl uppercase mb-4 leading-tight group-hover:text-[var(--color-sticker-blue)] transition-colors">
                          {post.title}
                        </h3>
                        
                        <div className="font-mono text-sm font-bold text-gray-500 mb-6 flex gap-4 uppercase tracking-widest">
                          <span>By {post.author_name || "Community"}</span>
                          {post.published_at && (
                            <span>• {format(new Date(post.published_at), 'MMM dd, yyyy')}</span>
                          )}
                        </div>
                        
                        <p className="font-body text-lg text-gray-700 line-clamp-3 mb-6 flex-grow">
                          {post.excerpt}
                        </p>
                        
                        <div className="mt-auto">
                          <span className="font-display font-bold uppercase border-b-2 border-black pb-0.5 group-hover:border-[var(--color-sticker-blue)] transition-colors flex items-center w-max">
                            Read External <FiExternalLink className="ml-2" />
                          </span>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <Link href={`/blog/${post.slug}`} className="flex flex-col md:flex-row h-full">
                      
                      {post.cover_image && (
                        <div className="w-full md:w-1/3 h-48 md:h-auto border-b-brutal md:border-b-0 md:border-r-brutal overflow-hidden">
                          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                      )}
                      
                      <div className={`p-6 md:p-8 flex flex-col ${post.cover_image ? 'md:w-2/3' : 'w-full'}`}>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags?.map((tag, j) => (
                            <Sticker key={j} color="pink" size="sm" animate={false}>{tag}</Sticker>
                          ))}
                        </div>
                        
                        <h3 className="font-display font-black text-3xl md:text-4xl uppercase mb-4 leading-tight group-hover:text-[var(--color-sticker-blue)] transition-colors">
                          {post.title}
                        </h3>
                        
                        <div className="font-mono text-sm font-bold text-gray-500 mb-6 flex gap-4 uppercase tracking-widest">
                          <span>By {post.author_name || "Community"}</span>
                          {post.published_at && (
                            <span>• {format(new Date(post.published_at), 'MMM dd, yyyy')}</span>
                          )}
                        </div>
                        
                        <p className="font-body text-lg text-gray-700 line-clamp-3 mb-6 flex-grow">
                          {post.excerpt}
                        </p>
                        
                        <div className="mt-auto">
                          <span className="font-display font-bold uppercase border-b-2 border-black pb-0.5 group-hover:border-[var(--color-sticker-blue)] transition-colors">
                            Read Article &rarr;
                          </span>
                        </div>
                      </div>

                    </Link>
                  )}
                </Paper>
              </div>
            ))
          ) : (
            <Paper variant="default" className="text-center py-20">
              <h3 className="font-display font-black text-2xl uppercase mb-2">No posts found</h3>
              <p className="font-mono">Check back later for updates.</p>
            </Paper>
          )}
        </div>

      </div>
    </PageWrapper>
  );
}
