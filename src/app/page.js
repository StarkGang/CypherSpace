import React from "react";
import PageWrapper from "../components/layout/PageWrapper";
import Hero from "../components/home/Hero";
import CollegeSection from "../components/home/CollegeSection";
import ClubStats from "../components/home/ClubStats";
import FeaturedProject from "../components/home/FeaturedProject";
import UpcomingEvents from "../components/home/UpcomingEvents";
import LatestPaper from "../components/home/LatestPaper";
import RecentAchievement from "../components/home/RecentAchievement";
import ActivityFeed from "../components/home/ActivityFeed";
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

  return (
    <PageWrapper>
      
      <Hero settings={settings} activities={data?.activity_feed || []} />
      
      <CollegeSection />
      
      {show("show_stats") && data?.stats && (
        <ClubStats stats={data.stats} settings={settings} />
      )}
      
      {show("show_featured_project") && data?.featured_project && (
        <FeaturedProject project={data.featured_project} />
      )}
      
      {show("show_events") && data?.upcoming_events?.length > 0 && (
        <UpcomingEvents events={data.upcoming_events} />
      )}
      
      {show("show_latest_paper") && data?.latest_paper && (
        <LatestPaper paper={data.latest_paper} />
      )}
      
      {show("show_recent_achievement") && data?.recent_achievement && (
        <RecentAchievement achievement={data.recent_achievement} />
      )}
      
      {show("show_team_preview") && data?.team_preview?.length > 0 && (
        <TeamPreview team={data.team_preview} />
      )}

      {show("show_sponsors") && settings?.sponsors?.length > 0 && (
        <Sponsors sponsors={settings.sponsors} />
      )}

    </PageWrapper>
  );
}
