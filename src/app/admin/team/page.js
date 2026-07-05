"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Paper from "../../../components/design-system/Paper";
import Button from "../../../components/ui/Button";
import { TableSkeleton, FormSkeleton, PageSkeleton } from "../../../components/ui/Skeleton";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { api } from "../../../lib/api";

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await api.get("/team?per_page=100");
      setTeam(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await api.delete(`/team/${id}`);
        fetchTeam();
      } catch (err) {
        alert("Failed to delete team member");
      }
    }
  };

  if (loading) return <AdminLayout><TableSkeleton /></AdminLayout>;

  return (
    <AdminLayout requiredRole="admin">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-4xl uppercase mb-1">Team</h1>
          <p className="font-mono text-[var(--color-text-secondary)] text-sm font-bold uppercase tracking-widest">
            Manage Club Directory
          </p>
        </div>
        <Button href="/admin/team/new" variant="primary" icon={<FiPlus />}>
          New Member
        </Button>
      </div>

      <Paper variant="default" className="p-0 overflow-hidden" rotate={0} shadowSize="sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] uppercase tracking-wider border-b border-[var(--color-border-subtle)] text-xs font-semibold">
              <tr>
                <th className="p-4 border-none">Member Name</th>
                <th className="p-4 border-none">Role</th>
                <th className="p-4 border-none hidden md:table-cell">Links</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {team.length > 0 ? (
                team.map((member) => (
                  <tr key={member.id} className="hover:bg-[var(--color-bg-surface)] transition-colors">
                    <td className="p-4 border-none flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-[var(--color-ink-black)] hidden sm:block">
                        {member.image && <img src={member.image} alt={member.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="font-display font-bold uppercase text-base">{member.name}</div>
                    </td>
                    <td className="p-4 border-none">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)] border border-[var(--color-brand-secondary)]/20">
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4 border-none hidden md:table-cell">
                      <div className="flex gap-2">
                        {member.github && <span className="text-gray-500">GitHub</span>}
                        {member.linkedin && <span className="text-gray-500">LinkedIn</span>}
                      </div>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      <Link 
                        href={`/admin/team/${member.id}`} 
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-sticker-lime)] transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(member.id)}
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
                    No team members found
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
