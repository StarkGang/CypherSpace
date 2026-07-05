import React from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import SectionHeading from "../../components/design-system/SectionHeading";
import Paper from "../../components/design-system/Paper";
import Sticker from "../../components/design-system/Sticker";
import Button from "../../components/ui/Button";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { getPapers } from "../../lib/data";

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

export default async function PapersList() {
  const papers = await getPapers(50);

  return (
    <PageWrapper pattern="grid">
      <div className="container mx-auto max-w-6xl px-4">
        
        <SectionHeading 
          title="Reading Group" 
          subtitle="A collection of research papers we've discussed and summarized."
          metadata="LITERATURE REVIEW"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {papers.length > 0 ? (
            papers.map((paper, i) => {
              const rotations = [-1, 2, -2, 1];
              return (
                <div key={paper.id} className="h-full">
                  <Paper 
                    variant={i % 4 === 0 ? "stacked" : "default"} 
                    rotate={rotations[i % 4]}
                    className="h-full flex flex-col hover:z-20 hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <Sticker color="yellow" size="sm" animate={false}>PAPER</Sticker>
                      {paper.date_discussed && (
                        <span className="font-mono text-xs font-bold uppercase border-b-2 border-black">
                          {formatDate(paper.date_discussed)}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-display font-black text-2xl uppercase mb-2 line-clamp-2">
                      {paper.external_url ? (
                        <a href={paper.external_url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-sticker-pink)] transition-colors flex items-center">
                          {paper.title} <FiExternalLink className="ml-2 w-5 h-5 flex-shrink-0" />
                        </a>
                      ) : (
                        <Link href={`/papers/${paper.slug}`} className="hover:text-[var(--color-sticker-pink)] transition-colors">
                          {paper.title}
                        </Link>
                      )}
                    </h3>
                    
                    {paper.authors && paper.authors.length > 0 && (
                      <p className="font-mono text-sm font-bold text-gray-500 dark:text-gray-400 mb-6">
                        By {paper.authors.join(", ")}
                      </p>
                    )}
                    
                    <p className="font-body text-gray-700 dark:text-gray-300 mb-8 line-clamp-3 flex-grow">
                      {paper.summary}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t-brutal flex justify-between items-center">
                      {paper.external_url ? (
                        <a 
                          href={paper.external_url}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-display font-bold uppercase tracking-wider hover:text-[var(--color-sticker-pink)] transition-colors flex items-center"
                        >
                          View External <FiExternalLink className="ml-1" />
                        </a>
                      ) : (
                        <Link 
                          href={`/papers/${paper.slug}`}
                          className="font-display font-bold uppercase tracking-wider hover:text-[var(--color-sticker-pink)] transition-colors"
                        >
                          Read Notes &rarr;
                        </Link>
                      )}
                      
                      {paper.paper_link && (
                        <a 
                          href={paper.paper_link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="font-mono text-xs font-bold uppercase border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors"
                        >
                          PDF
                        </a>
                      )}
                    </div>
                  </Paper>
                </div>
              );
            })
          ) : (
            <Paper variant="default" className="text-center py-20 md:col-span-2">
              <h3 className="font-display font-black text-2xl uppercase mb-2">No papers found</h3>
            </Paper>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
