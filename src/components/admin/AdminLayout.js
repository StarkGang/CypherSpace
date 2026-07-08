"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "../ThemeProvider";
import Link from "next/link";
import Image from "next/image";
import {
  FiHome, FiBox, FiCalendar, FiBookOpen,
  FiDownload, FiEdit3, FiAward, FiUsers,
  FiSettings, FiLogOut, FiMenu, FiX, FiMoon, FiSun, FiShield, FiActivity, FiRefreshCw, FiUser
} from "react-icons/fi";
import { PageSkeleton } from "../ui/Skeleton";
import { api } from "../../lib/api";

export default function AdminLayout({ children, requiredRole = "editor" }) {
  const { user, loading, logout, isSuperAdmin, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isDark, toggleDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    } else if (!loading && user) {
      if (requiredRole === "root" && !isSuperAdmin) {
        router.push("/admin");
      } else if (requiredRole === "admin" && !isAdmin) {
        router.push("/admin");
      }
    }
  }, [user, loading, router, requiredRole, isSuperAdmin, isAdmin]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading || !user) return <PageSkeleton />;

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FiHome />, role: "editor" },
    { name: "Projects", path: "/admin/projects", icon: <FiBox />, role: "editor" },
    { name: "Events", path: "/admin/events", icon: <FiCalendar />, role: "editor" },
    { name: "Papers", path: "/admin/papers", icon: <FiBookOpen />, role: "editor" },
    { name: "Resources", path: "/admin/resources", icon: <FiDownload />, role: "editor" },
    { name: "Blog", path: "/admin/blog", icon: <FiEdit3 />, role: "editor" },
    { name: "Network Explorer", path: "/admin/activity", icon: <FiActivity />, role: "editor" },
    { name: "Achievements", path: "/admin/achievements", icon: <FiAward />, role: "editor" },
    { name: "Sponsors", path: "/admin/sponsors", icon: <FiAward />, role: "admin" },
    { name: "Team", path: "/admin/team", icon: <FiUsers />, role: "admin" },
    { name: "Users", path: "/admin/users", icon: <FiShield />, role: "root" },
    { name: "Settings", path: "/admin/settings", icon: <FiSettings />, role: "admin" },
    { name: "Profile", path: "/admin/profile", icon: <FiUser />, role: "editor" },
  ];

  const allowedMenuItems = menuItems.filter(item => {
    if (item.role === "editor") return true;
    if (item.role === "admin") return isAdmin;
    if (item.role === "root") return isSuperAdmin;
    return false;
  });

  const handleClearCache = async () => {
    try {
      const res = await api.post('/admin/clear-cache');
      if (res.status === 200) {
        alert("Cache refreshed successfully!");
      } else {
        alert("Failed to refresh cache.");
      }
    } catch (e) {
      alert("Error refreshing cache.");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0d1117] overflow-hidden text-slate-900 dark:text-slate-200">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#161b22] border-r border-slate-200 dark:border-[#30363d] flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-5 border-b border-slate-200 dark:border-[#30363d] flex justify-between items-center bg-slate-50/50 dark:bg-[#161b22]/50">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="CypherSpace" width={24} height={24} className="rounded" />
            <span className="font-semibold text-lg tracking-tight">
              Admin
            </span>
          </Link>
          <button className="lg:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-slate-200 dark:border-[#30363d]">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Logged in as</p>
          <p className="font-medium truncate">{user.name}</p>
          <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-xs font-medium text-blue-600 dark:text-blue-400">
            {user.role}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          <nav className="px-3 space-y-1">
            {allowedMenuItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== "/admin" && pathname?.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? "bg-slate-100 dark:bg-[#21262d] text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#21262d]/50 hover:text-slate-900 dark:hover:text-slate-200"}
                  `}
                >
                  <span className={isActive ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-[#30363d] bg-slate-50/50 dark:bg-[#161b22]/50">
          <button
            onClick={handleClearCache}
            className="flex items-center gap-3 px-3 py-2 mb-1 w-full text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#21262d] transition-colors"
          >
            <FiRefreshCw className="text-slate-400" />
            Refresh Cache
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <FiLogOut className="text-red-400" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 dark:bg-[#0d1117]">

        <header className="lg:hidden bg-white dark:bg-[#161b22] border-b border-slate-200 dark:border-[#30363d] p-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-[#21262d] transition-colors"
            >
              <FiMenu size={20} />
            </button>
            <span className="font-semibold text-lg tracking-tight">
              Admin Panel
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
