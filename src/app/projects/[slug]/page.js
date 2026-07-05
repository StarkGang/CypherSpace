"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageWrapper from "../../../components/layout/PageWrapper";
import Paper from "../../../components/design-system/Paper";
import Sticker from "../../../components/design-system/Sticker";
import { PageSkeleton, CardSkeleton } from "../../../components/ui/Skeleton";
import Button from "../../../components/ui/Button";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { api } from "../../../lib/api";

export default function ProjectDetail() {
  const params = useParams();
  const slug = params?.slug;
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${slug}`);
        setProject(res.data.data);
      } catch (err) {
        setError("Project not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) return <PageWrapper>
      <div className="container mx-auto max-w-4xl px-4 py-20">
        <CardSkeleton />
      </div>
    </PageWrapper>;

  if (error || !project) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Paper className="text-center p-12" rotate={-1}>
            <h1 className="text-4xl font-display font-black uppercase mb-4">404 - Not Found</h1>
            <p className="font-mono mb-8">{error}</p>
            <Button href="/projects">Back to Projects</Button>
          </Paper>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper pattern="gingham">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        
        <Paper variant="default" className="p-0 overflow-hidden" shadowSize="lg">
          
          <div className="w-full h-64 md:h-96 bg-gray-100 border-b-brutal relative overflow-hidden">
            {project.cover_image ? (
              <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop" alt="Fluid flow fallback" className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="absolute bottom-4 right-8 z-10 flex gap-2">
              <Sticker color={project.status === 'completed' ? 'lime' : 'pink'} size="lg" peel>
                {project.status.replace("_", " ")}
              </Sticker>
              {project.featured && (
                <Sticker color="yellow" size="lg" rotate={10}>FEATURED</Sticker>
              )}
            </div>
          </div>

          <div className="p-6 md:p-12 bg-white dark:bg-[#161b22]">
            
            <div className="mb-10 border-b-4 border-black dark:border-white pb-8">
              <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-6 dark:text-white">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap gap-3">
                {project.tags?.map((tag, i) => (
                  <Sticker key={i} color="blue" size="sm" animate={false}>{tag}</Sticker>
                ))}
              </div>
            </div>

            {(() => {
              const hasSidebar = (project.github_link || project.demo_link) || 
                                 (project.tech_stack && project.tech_stack.length > 0) || 
                                 (project.contributors && project.contributors.length > 0);
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className={hasSidebar ? "md:col-span-2" : "md:col-span-3"}>
                    {project.description && (
                      <div className="border-t-4 border-black dark:border-white pt-8">
                        <h2 className="font-display font-black text-2xl uppercase mb-4 dark:text-white">About the Project</h2>
                        <div className="font-body text-lg leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-300">
                          {project.description}
                        </div>
                      </div>
                    )}

                {project.gallery && project.gallery.length > 0 && (
                  <div className="mt-16">
                    <h2 className="font-display font-black text-3xl uppercase mb-6 bg-[var(--color-sticker-lime)] inline-block px-2 border-brutal">
                      Gallery
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.gallery.map((imgUrl, i) => (
                        <div key={i} className="aspect-video border-brutal overflow-hidden">
                          <img src={imgUrl} alt={`${project.title} gallery ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                  </div>
                  
                  {hasSidebar && (
                    <div className="md:col-span-1 flex flex-col gap-8">
                      
                      {(project.github_link || project.demo_link) && (
                        <Paper variant="pinned" noPadding className="p-6 bg-[var(--color-paper-cream)] dark:bg-[#161b22]" rotate={2} shadowSize="sm">
                          <h3 className="font-mono font-bold uppercase tracking-widest text-sm mb-4 border-b border-black dark:border-white pb-2 dark:text-white">Links</h3>
                          <div className="flex flex-col gap-3">
                            {project.demo_link && (
                              <Button href={project.demo_link} variant="primary" fullWidth icon={<FaExternalLinkAlt />}>
                                Live Demo
                              </Button>
                            )}
                            {project.github_link && (
                              <Button href={project.github_link} variant="outline" fullWidth icon={<FaGithub />}>
                                Source Code
                              </Button>
                            )}
                          </div>
                        </Paper>
                      )}

                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="border-l-4 border-black dark:border-white pl-4">
                          <h3 className="font-mono font-bold uppercase tracking-widest text-sm mb-4 dark:text-white">Technology Stack</h3>
                          <div className="flex flex-wrap gap-2">
                            {project.tech_stack.map((tech, i) => (
                              <span key={i} className="font-mono text-sm border-2 border-black dark:border-white px-2 py-1 bg-white dark:bg-gray-800 font-bold dark:text-white">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.contributors && project.contributors.length > 0 && (
                        <div className="border-l-4 border-[var(--color-sticker-pink)] pl-4">
                          <h3 className="font-mono font-bold uppercase tracking-widest text-sm mb-4 dark:text-white">Contributors</h3>
                          <ul className="flex flex-col gap-2">
                            {project.contributors.map((contributor, i) => (
                              <li key={i} className="font-display font-bold uppercase text-lg flex items-center gap-2 dark:text-white">
                                <div className="w-2 h-2 bg-black dark:bg-white rounded-full" />
                                {contributor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </Paper>
        
        <div className="mt-12 text-center">
          <Button href="/projects" variant="ghost">&larr; Back to all projects</Button>
        </div>

      </div>
    </PageWrapper>
  );
}
