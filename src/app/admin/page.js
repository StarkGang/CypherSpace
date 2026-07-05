"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Paper from "../../components/design-system/Paper";
import { DashboardSkeleton } from "../../components/ui/Skeleton";
import { api } from "../../lib/api";
import { formatDistanceToNow } from "date-fns";
import { 
  FiBox, FiCalendar, FiBookOpen, 
  FiDownload, FiEdit3, FiAward, FiUsers 
} from "react-icons/fi";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/activity?limit=10")
        ]);
        
        setStats(statsRes.data.data);
        setActivity(activityRes.data.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: "Projects", value: stats?.projects || 0, icon: <FiBox />, color: "lime" },
    { title: "Events", value: stats?.events ?? 0, icon: <FiCalendar />, color: "pink" },
    { title: "Papers", value: stats?.papers || 0, icon: <FiBookOpen />, color: "yellow" },
    { title: "Resources", value: stats?.resources || 0, icon: <FiDownload />, color: "blue" },
    { title: "Blog Posts", value: stats?.blogs || 0, icon: <FiEdit3 />, color: "lime" },
    { title: "Achievements", value: stats?.achievements || 0, icon: <FiAward />, color: "yellow" },
    { title: "Team Members", value: stats?.team ?? 0, icon: <FiUsers />, color: "pink" },
  ];

  if (loading) return (
    <AdminLayout>
      <DashboardSkeleton />
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-display font-black text-4xl uppercase mb-2">Dashboard</h1>
          <p className="font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm font-bold">
            System Overview & Activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        {statCards.map((stat, i) => {
          const colorMap = {
            lime: "bg-green-500/20 text-green-600 dark:text-green-400",
            pink: "bg-pink-500/20 text-pink-600 dark:text-pink-400",
            yellow: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
            blue: "bg-blue-500/20 text-blue-600 dark:text-blue-400"
          };
          
          return (
            <Paper 
              key={i} 
              className="p-4 md:p-6 flex flex-col justify-between h-32 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-md ${colorMap[stat.color] || "bg-slate-500/20 text-slate-500"}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="font-display font-black text-4xl">
                {stat.value}
              </div>
            </Paper>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          <Paper className="p-0 overflow-hidden h-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161b22]">
              <h2 className="font-display font-black text-xl uppercase">Recent Activity</h2>
            </div>
            
            <div className="p-0">
              {activity.length > 0 ? (
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {activity.map((act) => (
                    <li key={act.id} className="p-4 hover:bg-slate-50 dark:hover:bg-[#161b22] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold uppercase bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-1.5 py-0.5 rounded-sm">
                            {act.entity_type}
                          </span>
                          <span className="font-mono text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                            {act.type}
                          </span>
                        </div>
                        <p className="font-display font-bold text-lg uppercase truncate max-w-[300px] md:max-w-[400px]">
                          {act.title}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-mono text-sm">
                  No recent activity found.
                </div>
              )}
            </div>
          </Paper>
        </div>

        <div className="lg:col-span-1">
          <Paper className="p-6 h-full bg-slate-50 dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d]">
            <h2 className="font-display font-black text-2xl uppercase mb-4">Quick Tips</h2>
            <div className="space-y-4 font-mono text-sm">
              <div className="p-4 bg-white dark:bg-[#0d1117] rounded-md border border-slate-200 dark:border-slate-800">
                <p className="font-bold mb-1 text-slate-900 dark:text-white">Image URLs</p>
                <p className="text-slate-600 dark:text-slate-400">You can use any public image URL. For free hosting, try Imgur, GitHub issues, or Discord.</p>
              </div>
              <div className="p-4 bg-white dark:bg-[#0d1117] rounded-md border border-slate-200 dark:border-slate-800">
                <p className="font-bold mb-1 text-slate-900 dark:text-white">Blog Formatting</p>
                <p className="text-slate-600 dark:text-slate-400">The blog uses a block-based system. Add text, headings, code snippets, and images in order.</p>
              </div>
              <div className="p-4 bg-white dark:bg-[#0d1117] rounded-md border border-slate-200 dark:border-slate-800">
                <p className="font-bold mb-1 text-slate-900 dark:text-white">Homepage Control</p>
                <p className="text-slate-600 dark:text-slate-400">Use the Settings tab to control which items appear on the public homepage.</p>
              </div>
            </div>
          </Paper>
        </div>

      </div>
    </AdminLayout>
  );
}
