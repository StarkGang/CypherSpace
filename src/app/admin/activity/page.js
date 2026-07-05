"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Paper from "../../../components/design-system/Paper";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { api } from "../../../lib/api";

export default function AdminActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await api.get("/activity?per_page=100");
      setActivities(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this activity? This action cannot be undone.")) {
      try {
        await api.delete(`/activity/${id}`);
        fetchActivities();
      } catch (err) {
        alert("Failed to delete activity");
      }
    }
  };

  if (loading) return <AdminLayout><TableSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-4xl uppercase mb-1">Network Explorer</h1>
          <p className="font-mono text-[var(--color-text-secondary)] text-sm font-bold uppercase tracking-widest">
            Manage Activity Feed
          </p>
        </div>
        <Button href="/admin/activity/new" variant="primary" icon={<FiPlus />}>
          New Activity
        </Button>
      </div>

      <Paper variant="default" className="p-0 overflow-hidden" rotate={0} shadowSize="sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] uppercase tracking-wider border-b border-[var(--color-border-subtle)] text-xs font-semibold">
              <tr>
                <th className="p-4 border-none">Title</th>
                <th className="p-4 border-none">Type</th>
                <th className="p-4 border-none hidden md:table-cell">Entity Type</th>
                <th className="p-4 border-none hidden lg:table-cell">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-[var(--color-bg-surface)] transition-colors">
                    <td className="p-4 border-none">
                      <div className="font-display font-bold uppercase text-base">{activity.title}</div>
                      <div className="text-[var(--color-text-secondary)] truncate max-w-[200px]">{activity.entity_slug}</div>
                    </td>
                    <td className="p-4 border-none">
                      <Badge variant="info">
                        {activity.type || 'created'}
                      </Badge>
                    </td>
                    <td className="p-4 border-none hidden md:table-cell">
                      <span className="truncate max-w-[150px] inline-block">{activity.entity_type || '-'}</span>
                    </td>
                    <td className="p-4 border-none hidden lg:table-cell">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      <Link 
                        href={`/admin/activity/${activity.id}`} 
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-sticker-lime)] transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(activity.id)}
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
                  <td colSpan={5} className="p-8 text-center text-[var(--color-text-secondary)] font-bold uppercase">
                    No activities found
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
