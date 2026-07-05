"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Paper from "../../../components/design-system/Paper";
import Button from "../../../components/ui/Button";
import { TableSkeleton, FormSkeleton, PageSkeleton } from "../../../components/ui/Skeleton";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { api } from "../../../lib/api";

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await api.get("/achievements?per_page=100");
      setAchievements(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      try {
        await api.delete(`/achievements/${id}`);
        fetchAchievements();
      } catch (err) {
        alert("Failed to delete achievement");
      }
    }
  };

  if (loading) return <AdminLayout><TableSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-4xl uppercase mb-1">Achievements</h1>
          <p className="font-mono text-[var(--color-text-secondary)] text-sm font-bold uppercase tracking-widest">
            Manage Club Milestones
          </p>
        </div>
        <Button href="/admin/achievements/new" variant="primary" icon={<FiPlus />}>
          New Achievement
        </Button>
      </div>

      <Paper variant="default" className="p-0 overflow-hidden" rotate={0} shadowSize="sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] uppercase tracking-wider border-b border-[var(--color-border-subtle)] text-xs font-semibold">
              <tr>
                <th className="p-4 border-none">Achievement Title</th>
                <th className="p-4 border-none">Date</th>
                <th className="p-4 border-none hidden md:table-cell">Makers</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <tr key={achievement.id} className="hover:bg-[var(--color-bg-surface)] transition-colors">
                    <td className="p-4 border-none">
                      <div className="font-display font-bold uppercase text-base">{achievement.title}</div>
                      <div className="text-[var(--color-text-secondary)] truncate max-w-[200px]">{achievement.slug}</div>
                    </td>
                    <td className="p-4 border-none">
                      {achievement.date || '-'}
                    </td>
                    <td className="p-4 border-none hidden md:table-cell">
                      <span className="truncate max-w-[200px] inline-block">
                        {achievement.members?.join(", ") || '-'}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      <Link 
                        href={`/admin/achievements/${achievement.id}`} 
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-sticker-lime)] transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(achievement.id)}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[var(--color-text-secondary)] font-bold uppercase">
                    No achievements found yet!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Paper>
    </AdminLayout>
  );
}
