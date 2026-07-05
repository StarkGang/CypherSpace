import React from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import SectionHeading from "../../components/design-system/SectionHeading";
import { getProjects } from "../../lib/data";
import ProjectsGrid from "./ProjectsGrid";

export default async function ProjectsList() {
  const projects = await getProjects(50);

  return (
    <PageWrapper pattern="grid">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeading
          title="Club Projects"
          subtitle="Discover what we're building. From simple experiments to complex systems."
          metadata="PROJECT SHOWCASE"
          className="mb-12"
        />
        <ProjectsGrid projects={projects} />
      </div>
    </PageWrapper>
  );
}
