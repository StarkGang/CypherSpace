"use client";

import React, { useState } from "react";
import Paper from "../../components/design-system/Paper";
import Sticker from "../../components/design-system/Sticker";

import Button from "../../components/ui/Button";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

export default function ProjectsGrid({ projects }) {
  const [filter, setFilter] = useState("all");

  const filteredProjects = filter === "all"
    ? projects
    : projects.filter(p => p.status === filter);

  const featuredProject = filteredProjects.find(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);

  return (
    <>
      <div className="flex gap-4 mb-12">
        <Button
          variant={filter === "all" ? "primary" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Projects
        </Button>
        <Button
          variant={filter === "completed" ? "primary" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>
        <Button
          variant={filter === "in_progress" ? "primary" : "outline"}
          size="sm"
          onClick={() => setFilter("in_progress")}
        >
          In Progress
        </Button>
      </div>

      {featuredProject && (
        <div className="mb-20">
          <Paper variant="stacked" className="p-0 overflow-hidden group">
            {featuredProject.external_url ? (
              <a href={featuredProject.external_url} target="_blank" rel="noopener noreferrer" className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/2 aspect-video md:aspect-auto border-b-brutal md:border-b-0 md:border-r-brutal relative bg-gray-100 overflow-hidden">
                  {featuredProject.cover_image ? (
                    <img src={featuredProject.cover_image} alt={featuredProject.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop" alt="Fluid flow fallback" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute top-4 left-4 z-10">
                    <Sticker color="lime" size="lg" peel animate={false}>FEATURED</Sticker>
                  </div>
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Sticker color="pink" size="sm" animate={false}>{featuredProject.status.replace("_", " ")}</Sticker>
                    {featuredProject.tags?.slice(0,2).map((tag, i) => (
                      <Sticker key={i} color="blue" size="sm" animate={false}>{tag}</Sticker>
                    ))}
                  </div>
                  <h3 className="font-display font-black text-4xl uppercase mb-4 group-hover:text-[var(--color-sticker-pink)] transition-colors">{featuredProject.title}</h3>
                  <p className="font-body text-lg mb-8 line-clamp-4 text-gray-700 dark:text-gray-300">{featuredProject.description}</p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center border-b-2 border-black font-display font-bold uppercase tracking-wider pb-1">
                      View External <FiExternalLink className="ml-2" />
                    </span>
                  </div>
                </div>
              </a>
            ) : (
              <Link href={`/projects/${featuredProject.slug}`} className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/2 aspect-video md:aspect-auto border-b-brutal md:border-b-0 md:border-r-brutal relative bg-gray-100 overflow-hidden">
                  {featuredProject.cover_image ? (
                    <img src={featuredProject.cover_image} alt={featuredProject.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop" alt="Fluid flow fallback" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute top-4 left-4 z-10">
                    <Sticker color="lime" size="lg" peel animate={false}>FEATURED</Sticker>
                  </div>
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Sticker color="pink" size="sm" animate={false}>{featuredProject.status.replace("_", " ")}</Sticker>
                    {featuredProject.tags?.slice(0,2).map((tag, i) => (
                      <Sticker key={i} color="blue" size="sm" animate={false}>{tag}</Sticker>
                    ))}
                  </div>
                  <h3 className="font-display font-black text-4xl uppercase mb-4 group-hover:text-[var(--color-sticker-pink)] transition-colors">{featuredProject.title}</h3>
                  <p className="font-body text-lg mb-8 line-clamp-4 text-gray-700 dark:text-gray-300">{featuredProject.description}</p>
                  <div className="mt-auto">
                    <span className="inline-block border-b-2 border-black font-display font-bold uppercase tracking-wider pb-1">
                      Read Case Study &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </Paper>
        </div>
      )}



      <div className="container mx-auto max-w-7xl px-4">
        {regularProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularProjects.map((project, i) => {
              const rotations = [-1, 1, -2, 2, 0, -1];
              return (
                <div key={project.id} className="h-full">
                  <Paper
                    variant={i % 3 === 0 ? "pinned" : "default"}
                    rotate={rotations[i % 6]}
                    className="h-full flex flex-col p-0 overflow-hidden group hover:z-20 hover:scale-[1.02] transition-all duration-300"
                    noPadding
                  >
                    {project.external_url ? (
                      <a href={project.external_url} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
                        <div className="w-full aspect-video border-b-brutal relative bg-gray-100 overflow-hidden">
                          {project.cover_image ? (
                            <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop" alt="Fluid flow fallback" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          )}
                          <div className="absolute top-3 left-3">
                            <Sticker color={project.status === 'completed' ? 'lime' : 'pink'} size="sm" animate={false}>
                              {project.status.replace("_", " ")}
                            </Sticker>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow bg-white dark:bg-gray-900">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.tech_stack?.slice(0, 3).map((tech, j) => (
                              <span key={j} className="font-mono text-xs border border-black dark:border-white px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 dark:text-white uppercase font-bold">{tech}</span>
                            ))}
                          </div>
                          <h3 className="font-display font-black text-2xl uppercase mb-3 line-clamp-2 group-hover:text-[var(--color-sticker-pink)] transition-colors dark:text-white">{project.title}</h3>
                          <p className="font-body text-sm text-gray-600 line-clamp-3 mb-6 flex-grow">{project.description}</p>
                          <div className="mt-auto">
                            <span className="inline-flex items-center font-display font-bold uppercase tracking-wider text-sm border-b-2 border-transparent group-hover:border-black pb-0.5 transition-all w-max">
                              View External <FiExternalLink className="ml-1" />
                            </span>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <Link href={`/projects/${project.slug}`} className="flex flex-col h-full">
                        <div className="w-full aspect-video border-b-brutal relative bg-gray-100 overflow-hidden">
                          {project.cover_image ? (
                            <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop" alt="Fluid flow fallback" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          )}
                          <div className="absolute top-3 left-3">
                            <Sticker color={project.status === 'completed' ? 'lime' : 'pink'} size="sm" animate={false}>
                              {project.status.replace("_", " ")}
                            </Sticker>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow bg-white dark:bg-gray-900">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.tech_stack?.slice(0, 3).map((tech, j) => (
                              <span key={j} className="font-mono text-xs border border-black dark:border-white px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 dark:text-white uppercase font-bold">{tech}</span>
                            ))}
                          </div>
                          <h3 className="font-display font-black text-2xl uppercase mb-3 line-clamp-2 group-hover:text-[var(--color-sticker-pink)] transition-colors dark:text-white">{project.title}</h3>
                          <p className="font-body text-sm text-gray-600 line-clamp-3 mb-6 flex-grow">{project.description}</p>
                          <div className="mt-auto">
                            <span className="font-display font-bold uppercase tracking-wider text-sm border-b-2 border-transparent group-hover:border-black pb-0.5 transition-all">
                              View Details &rarr;
                            </span>
                          </div>
                        </div>
                      </Link>
                    )}
                  </Paper>
                </div>
              );
            })}
          </div>
        ) : (
          <Paper variant="default" className="text-center py-20">
            <h3 className="font-display font-black text-2xl uppercase mb-2">No projects found</h3>
            <p className="font-mono">Try changing your filters.</p>
          </Paper>
        )}
      </div>
    </>
  );
}
