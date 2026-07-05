"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Paper from "../../../components/design-system/Paper";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { TableSkeleton, FormSkeleton, PageSkeleton } from "../../../components/ui/Skeleton";
import { FiSave, FiPlus, FiX } from "react-icons/fi";
import { api } from "../../../lib/api";

function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <div
      className="flex items-center justify-between p-4 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onChange(!checked)}
    >
      <div className="flex-1 mr-4">
        <span className="font-semibold text-sm block">
          {label}
        </span>
        {description && (
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            {description}
          </span>
        )}
      </div>
      <div
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
          checked ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newTickerItem, setNewTickerItem] = useState("");

  const [formData, setFormData] = useState({
    club_name: "Cypher Space",
    club_subtitle: "Blockchain Community, NSSCE",
    hero_title: "CYPHER SPACE",
    hero_highlight: "Web3, Cryptography & Decentralized Systems",
    hero_subtitle:
      "Exploring Blockchain Through Research, Projects, Learning and Community.",
    social_links: {
      github: "",
      linkedin: "",
      instagram: "",
      twitter: "",
      youtube: "",
      discord: "",
      email: "",
    },

    club_stats: {
      members: "",
      projects: "",
      events: "",
      papers: "",
    },
    homepage_sections: {
      show_stats: true,
      show_featured_project: true,
      show_events: true,
      show_latest_paper: true,
      show_recent_achievement: true,
      show_activity_feed: true,
      show_team_preview: true,
      show_neon_effect: true,
      show_sponsors: true,
    },
    enable_launch_mode: false,
    launch_date: "",
    launch_action: "hold", 
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        const data = res.data.data;
        setFormData((prev) => ({
          ...prev,
          ...data,
          social_links: {
            ...prev.social_links,
            ...(data?.social_links || {}),
          },
          homepage_sections: {
            ...prev.homepage_sections,
            ...(data?.homepage_sections || {}),
          },
          club_stats: {
            ...prev.club_stats,
            ...(data?.club_stats || {}),
          },
        }));
      } catch (err) {
        setError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleAddTickerItem = () => {
    const trimmed = newTickerItem.trim().toUpperCase();
    if (!trimmed) return;
    if (formData.ticker_items.includes(trimmed)) return;
    setFormData((prev) => ({
      ...prev,
      ticker_items: [...prev.ticker_items, trimmed],
    }));
    setNewTickerItem("");
  };

  const handleRemoveTickerItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      ticker_items: prev.ticker_items.filter((_, i) => i !== index),
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.put("/settings", formData);
      setSuccess("Settings updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <AdminLayout requiredRole="admin">
        <FormSkeleton />
      </AdminLayout>
    );

  return (
    <AdminLayout requiredRole="admin">
      <div className="mb-8">
        <h1 className="font-semibold text-3xl mb-1">
          Site Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Branding, Hero, Homepage Sections & Social Links
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 pb-32 max-w-4xl"
      >
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-2 border-green-500 text-green-800 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider">
            {success}
          </div>
        )}

        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="font-semibold text-xl mb-6 border-b border-slate-200 dark:border-[#30363d] pb-3">
            Launch Mode Settings
          </h2>
          
          <div className="mb-6">
            <ToggleSwitch
              label="Enable Countdown Launch Mode"
              description="Locks the entire site behind a countdown timer and requires a fun unlock action to enter."
              checked={formData.enable_launch_mode || false}
              onChange={(val) => setFormData(prev => ({ ...prev, enable_launch_mode: val }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Launch Date & Time (ISO String or generic string)"
              name="launch_date"
              type="datetime-local"
              value={formData.launch_date || ""}
              onChange={handleChange}
              helperText="The exact time the countdown reaches zero."
            />
            
            <div className="flex flex-col mb-6">
              <label className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">
                Unlock Action Type
              </label>
              <select
                name="launch_action"
                value={formData.launch_action || "hold"}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
              >
                <option value="hold">Hold to Power Up</option>
                <option value="slide">Slide to Unlock</option>
                <option value="passcode">Passcode Entry</option>
              </select>
              <span className="text-xs text-slate-500 mt-2">
                The interactive action users must perform when the timer hits zero.
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="font-semibold text-xl mb-6 border-b border-slate-200 dark:border-[#30363d] pb-3">
            Club Branding
          </h2>

          <Input
            label="Club Name"
            name="club_name"
            value={formData.club_name}
            onChange={handleChange}
            helperText="Appears in the navbar and footer"
            required
          />

          <Input
            label="Club Subtitle"
            name="club_subtitle"
            value={formData.club_subtitle}
            onChange={handleChange}
            helperText='e.g. "Blockchain & Web3 Community, NSSCE"'
          />
        </div>

        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="font-semibold text-xl mb-2 border-b border-slate-200 dark:border-[#30363d] pb-3">
            Hero Section
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            The large headline and description shown at the top of the homepage.
          </p>

          <Input
            label="Hero Title"
            name="hero_title"
            value={formData.hero_title}
            onChange={handleChange}
            helperText="The massive headline text (e.g. CYPHER SPACE)"
            required
          />

          <Input
            label="Hero Highlight"
            name="hero_highlight"
            value={formData.hero_highlight || ""}
            onChange={handleChange}
            helperText="The highlighted, glowing text below the main title"
          />

          <Input
            as="textarea"
            label="Hero Subtitle"
            name="hero_subtitle"
            value={formData.hero_subtitle}
            onChange={handleChange}
            rows={3}
            helperText="The description text below the headline"
          />
        </div>


        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="font-semibold text-xl mb-6 border-b border-slate-200 dark:border-[#30363d] pb-3">
            Social Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Instagram URL"
              value={formData.social_links.instagram}
              onChange={(e) =>
                handleNestedChange(
                  "social_links",
                  "instagram",
                  e.target.value
                )
              }
            />
            <Input
              label="GitHub URL"
              value={formData.social_links.github}
              onChange={(e) =>
                handleNestedChange("social_links", "github", e.target.value)
              }
            />
            <Input
              label="LinkedIn URL"
              value={formData.social_links.linkedin}
              onChange={(e) =>
                handleNestedChange("social_links", "linkedin", e.target.value)
              }
            />
            <Input
              label="Twitter URL"
              value={formData.social_links.twitter}
              onChange={(e) =>
                handleNestedChange("social_links", "twitter", e.target.value)
              }
            />
            <Input
              label="YouTube URL"
              value={formData.social_links.youtube}
              onChange={(e) =>
                handleNestedChange("social_links", "youtube", e.target.value)
              }
            />
            <Input
              label="Discord URL"
              value={formData.social_links.discord}
              onChange={(e) =>
                handleNestedChange("social_links", "discord", e.target.value)
              }
            />
            <Input
              label="Email"
              value={formData.social_links.email || ""}
              onChange={(e) =>
                handleNestedChange("social_links", "email", e.target.value)
              }
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="font-semibold text-xl mb-6 border-b border-slate-200 dark:border-[#30363d] pb-3">
            Stats Overrides
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Leave blank to use actual counts or default values.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Community Members"
              type="number"
              value={formData.club_stats.members || ""}
              onChange={(e) =>
                handleNestedChange("club_stats", "members", e.target.value === "" ? null : parseInt(e.target.value))
              }
            />
            <Input
              label="Projects Shipped"
              type="number"
              value={formData.club_stats.projects || ""}
              onChange={(e) =>
                handleNestedChange("club_stats", "projects", e.target.value === "" ? null : parseInt(e.target.value))
              }
            />
            <Input
              label="Events Hosted"
              type="number"
              value={formData.club_stats.events || ""}
              onChange={(e) =>
                handleNestedChange("club_stats", "events", e.target.value === "" ? null : parseInt(e.target.value))
              }
            />
            <Input
              label="Papers Discussed"
              type="number"
              value={formData.club_stats.papers || ""}
              onChange={(e) =>
                handleNestedChange("club_stats", "papers", e.target.value === "" ? null : parseInt(e.target.value))
              }
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="font-semibold text-xl mb-2 border-b border-slate-200 dark:border-[#30363d] pb-3">
            Homepage Sections
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Toggle which sections are visible on the public homepage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ToggleSwitch
              checked={formData.homepage_sections.show_stats}
              onChange={(val) =>
                handleNestedChange("homepage_sections", "show_stats", val)
              }
              label="Club Stats"
              description="Members, projects, events counters"
            />
            <ToggleSwitch
              checked={formData.homepage_sections.show_featured_project}
              onChange={(val) =>
                handleNestedChange(
                  "homepage_sections",
                  "show_featured_project",
                  val
                )
              }
              label="Featured Project"
              description="Highlighted project showcase"
            />
            <ToggleSwitch
              checked={formData.homepage_sections.show_events}
              onChange={(val) =>
                handleNestedChange("homepage_sections", "show_events", val)
              }
              label="Events"
              description="Upcoming and recent events"
            />
            <ToggleSwitch
              checked={formData.homepage_sections.show_latest_paper}
              onChange={(val) =>
                handleNestedChange(
                  "homepage_sections",
                  "show_latest_paper",
                  val
                )
              }
              label="Latest Paper"
              description="Most recent research paper"
            />
            <ToggleSwitch
              checked={formData.homepage_sections.show_recent_achievement}
              onChange={(val) =>
                handleNestedChange(
                  "homepage_sections",
                  "show_recent_achievement",
                  val
                )
              }
              label="Recent Achievement"
              description="Latest achievement or award"
            />
            <ToggleSwitch
              checked={formData.homepage_sections.show_activity_feed}
              onChange={(val) =>
                handleNestedChange(
                  "homepage_sections",
                  "show_activity_feed",
                  val
                )
              }
              label="Live Feed"
              description="Recent activity timeline"
            />
            <ToggleSwitch
              checked={formData.homepage_sections.show_team_preview}
              onChange={(val) =>
                handleNestedChange(
                  "homepage_sections",
                  "show_team_preview",
                  val
                )
              }
              label="Team Preview"
              description="Team members grid"
            />
            <ToggleSwitch
              checked={formData.homepage_sections.show_neon_effect}
              onChange={(val) =>
                handleNestedChange(
                  "homepage_sections",
                  "show_neon_effect",
                  val
                )
              }
              label="Enable Neon Effect"
              description="Show glowing orbs in hero section"
            />
            <ToggleSwitch
              checked={formData.homepage_sections.show_sponsors}
              onChange={(val) =>
                handleNestedChange("homepage_sections", "show_sponsors", val)
              }
              label="Sponsors"
              description="Show sponsors on the homepage"
            />
          </div>
        </div>



        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white dark:bg-[#161b22] border-t border-slate-200 dark:border-[#30363d] z-30 flex justify-end gap-4 shadow-lg">
          <Button
            type="submit"
            variant="primary"
            icon={<FiSave />}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
