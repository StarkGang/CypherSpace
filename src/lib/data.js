import { getDb } from '@/lib/db';
import { entityToDict, projectToDict } from '@/lib/models';
import { ObjectId } from 'mongodb';
import { unstable_cache } from 'next/cache';


export const getSettings = unstable_cache(
  async () => {
    try {
      const db = await getDb();
      let settings = await db.collection('settings').findOne({});
      if (!settings) {
        return null;
      }
      const { _id, ...rest } = settings;
      return { id: _id.toString(), ...rest };
    } catch (e) {
      console.error("Failed to fetch settings:", e);
      return null;
    }
  },
  ['site-settings'],
  { tags: ['settings'], revalidate: 3600 }
);


export const getHomepageData = unstable_cache(
  async () => {
    try {
      const db = await getDb();
      let settings = await db.collection('settings').findOne({});
    const highlights = settings?.homepage_highlights || {};
    const sections = settings?.homepage_sections || {};
    
    const data = {
      stats: null,
      featured_project: null,
      upcoming_events: [],
      latest_paper: null,
      recent_achievement: null,
      activity_feed: [],
      team_preview: []
    };

    if (sections.show_stats !== false) {
      const [members, projects, events, resources, papers] = await Promise.all([
        db.collection('team').countDocuments(),
        db.collection('projects').countDocuments(),
        db.collection('events').countDocuments(),
        db.collection('resources').countDocuments(),
        db.collection('papers').countDocuments(),
      ]);
      data.stats = { members, projects, events, resources, papers };
    }

    if (sections.show_featured_project !== false) {
      let fp = null;
      if (highlights.featured_project_id) {
        try { fp = await db.collection('projects').findOne({ _id: new ObjectId(highlights.featured_project_id) }); } catch(e) {}
      }
      if (!fp) {
        fp = await db.collection('projects').findOne({ featured: true }, { sort: { created_at: -1 } });
      }
      data.featured_project = fp ? entityToDict(fp) : null;
    }

    if (sections.show_events !== false) {
      let events = await db.collection('events').find({ status: { $in: ['ongoing', 'upcoming'] } }).sort({ status: 1, date: 1 }).limit(3).toArray();
      if (events.length < 3) {
        const past = await db.collection('events').find({ status: 'past' }).sort({ date: -1 }).limit(3 - events.length).toArray();
        events = [...events, ...past];
      }
      data.upcoming_events = events.map(entityToDict);
    }

    if (sections.show_latest_paper !== false) {
      let lp = null;
      if (highlights.featured_paper_id) {
        try { lp = await db.collection('papers').findOne({ _id: new ObjectId(highlights.featured_paper_id) }); } catch(e) {}
      }
      if (!lp) {
        lp = await db.collection('papers').findOne({}, { sort: { created_at: -1 } });
      }
      data.latest_paper = lp ? entityToDict(lp) : null;
    }

    if (sections.show_recent_achievement !== false) {
      let ra = null;
      if (highlights.featured_achievement_id) {
        try { ra = await db.collection('achievements').findOne({ _id: new ObjectId(highlights.featured_achievement_id) }); } catch(e) {}
      }
      if (!ra) {
        ra = await db.collection('achievements').findOne({}, { sort: { date: -1 } });
      }
      data.recent_achievement = ra ? entityToDict(ra) : null;
    }

    if (sections.show_activity_feed !== false) {
      const activities = await db.collection('activity').find({ entity_type: { $ne: 'settings' } }).sort({ created_at: -1 }).limit(10).toArray();
      data.activity_feed = activities.map(act => {
        const { _id, ...rest } = act;
        return { id: _id.toString(), ...rest, created_at: act.created_at?.toISOString() || null };
      });
    }

    if (sections.show_team_preview !== false) {
      const team = await db.collection('team').find({}).sort({ display_order: 1 }).limit(6).toArray();
      data.team_preview = team.map(entityToDict);
    }

    return data;
    } catch (e) {
      console.error("Failed to fetch homepage data:", e);
      return {
        stats: null,
        featured_project: null,
        upcoming_events: [],
        latest_paper: null,
        recent_achievement: null,
        activity_feed: [],
        team_preview: []
      };
    }
  },
  ['homepage-data'],
  { tags: ['homepage', 'settings', 'projects', 'events', 'papers', 'achievements', 'activity', 'team'], revalidate: 3600 }
);


export const getBlogs = unstable_cache(
  async (limit = 50) => {
    try {
      const db = await getDb();
      const cursor = db.collection('blogs').find({ published: true }).sort({ created_at: -1 }).limit(limit);
      const items = await cursor.toArray();
      return items.map(entityToDict);
    } catch (e) {
      console.error("Failed to fetch blogs:", e);
      return [];
    }
  },
  ['blogs-list'],
  { tags: ['blogs'], revalidate: 3600 }
);


export const getProjects = unstable_cache(
  async (limit = 50) => {
    try {
      const db = await getDb();
      const projects = await db.collection('projects')
        .find({})
        .sort({ created_at: -1 })
        .limit(limit)
        .toArray();
      return projects.map(projectToDict);
    } catch (e) {
      console.error("Failed to fetch projects:", e);
      return [];
    }
  },
  ['projects-list'],
  { tags: ['projects'], revalidate: 3600 }
);


export const getPapers = unstable_cache(
  async (limit = 50) => {
    try {
      const db = await getDb();
      const cursor = db.collection('papers').find({}).sort({ created_at: -1 }).limit(limit);
      const items = await cursor.toArray();
      return items.map(entityToDict);
    } catch (e) {
      console.error("Failed to fetch papers:", e);
      return [];
    }
  },
  ['papers-list'],
  { tags: ['papers'], revalidate: 3600 }
);
