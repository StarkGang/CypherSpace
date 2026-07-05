"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Paper from "../../../components/design-system/Paper";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { TableSkeleton, FormSkeleton, PageSkeleton } from "../../../components/ui/Skeleton";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiPlus, FiExternalLink } from "react-icons/fi";
import { api } from "../../../lib/api";
import { format } from "date-fns";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/projects?per_page=100");
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (err) {
        alert("Failed to delete project");
      }
    }
  };

  if (loading) return <AdminLayout><TableSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-4xl uppercase mb-1">Projects</h1>
          <p className="font-mono text-[var(--color-text-secondary)] text-sm font-bold uppercase tracking-widest">
            Manage Lab Projects
          </p>
        </div>
        <Button href="/admin/projects/new" variant="primary" icon={<FiPlus />}>
          New Project
        </Button>
      </div>

      <Paper variant="default" className="p-0 overflow-hidden" rotate={0} shadowSize="sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] uppercase tracking-wider border-b border-[var(--color-border-subtle)] text-xs font-semibold">
              <tr>
                <th className="p-4 border-none">Project Title</th>
                <th className="p-4 border-none">Status</th>
                <th className="p-4 border-none">Featured</th>
                <th className="p-4 border-none hidden md:table-cell">Created</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-[var(--color-bg-surface)] transition-colors">
                    <td className="p-4 border-none">
                      <div className="font-display font-bold uppercase text-base">{project.title}</div>
                      <div className="text-[var(--color-text-secondary)] truncate max-w-[200px]">{project.slug}</div>
                    </td>
                    <td className="p-4 border-none">
                      <Badge variant={project.status === 'completed' ? 'success' : 'warning'}>
                        {project.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="p-4 border-none">
                      {project.featured ? (
                        <span className="text-[var(--color-sticker-pink)] font-black text-lg">★</span>
                      ) : (
                        <span className="text-gray-300 font-black text-lg">☆</span>
                      )}
                    </td>
                    <td className="p-4 border-none hidden md:table-cell">
                      {project.created_at ? format(new Date(project.created_at), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      <Link 
                        href={`/projects/${project.slug}`} 
                        target="_blank"
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-sticker-blue)] transition-colors"
                        title="View Live"
                      >
                        <FiExternalLink size={18} />
                      </Link>
                      <Link 
                        href={`/admin/projects/${project.id}`} 
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-sticker-lime)] transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(project.id)}
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
                    No projects found
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
