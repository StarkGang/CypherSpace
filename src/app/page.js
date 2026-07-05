import React from "react";
import PageWrapper from "../components/layout/PageWrapper";
import Hero from "../components/home/Hero";
import ClubStats from "../components/home/ClubStats";
import FeaturedProject from "../components/home/FeaturedProject";
import FeaturedEvent from "../components/home/FeaturedEvent";
import BlastFromPast from "../components/home/BlastFromPast";
import UpcomingEvents from "../components/home/UpcomingEvents";
import LatestPaper from "../components/home/LatestPaper";
import RecentAchievement from "../components/home/RecentAchievement";
import TeamPreview from "../components/home/TeamPreview";
import Sponsors from "../components/home/Sponsors";
import { getHomepageData, getSettings } from "../lib/data";

export default async function Home() {
  const [data, settings] = await Promise.all([
    getHomepageData(),
    getSettings()
  ]);

  const sections = settings?.homepage_sections || {};
  const show = (key) => sections[key] !== false;

  const sectionsMap = {
    stats: show("show_stats") && data?.stats ? <ClubStats key="stats" stats={data.stats} settings={settings} /> : null,
    featured_project: show("show_featured_project") && data?.featured_project ? <FeaturedProject key="featured_project" project={data.featured_project} /> : null,
    featured_event: show("show_featured_event") && data?.featured_event ? <FeaturedEvent key="featured_event" event={data.featured_event} /> : null,
    blast_from_past: show("show_blast_from_past") && data?.blast_from_past_events?.length > 0 ? <BlastFromPast key="blast_from_past" events={data.blast_from_past_events} /> : null,
    events: show("show_events") && data?.upcoming_events?.length > 0 ? <UpcomingEvents key="events" events={data.upcoming_events} /> : null,
    latest_paper: show("show_latest_paper") && data?.latest_paper ? <LatestPaper key="latest_paper" paper={data.latest_paper} /> : null,
    recent_achievement: show("show_recent_achievement") && data?.recent_achievement ? <RecentAchievement key="recent_achievement" achievement={data.recent_achievement} /> : null,
    team_preview: show("show_team_preview") && data?.team_preview?.length > 0 ? <TeamPreview key="team_preview" team={data.team_preview} /> : null,
    sponsors: show("show_sponsors") && settings?.sponsors?.length > 0 ? <Sponsors key="sponsors" sponsors={settings.sponsors} /> : null,
  };

  const defaultOrder = [
    "stats",
    "featured_project",
    "featured_event",
    "blast_from_past",
    "events",
    "latest_paper",
    "recent_achievement",
    "team_preview",
    "sponsors"
  ];

  let order = sections.section_order || defaultOrder;
  
  order = order.filter(id => id !== 'college');
  if (!order.includes('featured_event')) {
    const fpIndex = order.indexOf('featured_project');
    if (fpIndex !== -1) {
      order.splice(fpIndex + 1, 0, 'featured_event');
    } else {
      order.unshift('featured_event');
    }
  }

  if (!order.includes('blast_from_past')) {
    const feIndex = order.indexOf('featured_event');
    if (feIndex !== -1) {
      order.splice(feIndex + 1, 0, 'blast_from_past');
    } else {
      order.push('blast_from_past');
    }
  }

  return (
    <PageWrapper>
      
      <Hero settings={settings} activities={data?.activity_feed || []} />
      
      {order.map(sectionId => sectionsMap[sectionId])}

    </PageWrapper>
  );
}
