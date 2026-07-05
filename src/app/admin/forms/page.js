"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Button from "../../../components/ui/Button";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiSettings } from "react-icons/fi";
import { api } from "../../../lib/api";

export default function AdminForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await api.get("/forms");
      setForms(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await api.post("/forms", {
        title: "Untitled Form",
        description: "A new form",
        is_published: false,
        schema_json: []
      });
      if (res.data.success) {
        window.location.href = `/admin/forms/${res.data.data.id}/builder`;
      }
    } catch (err) {
      alert("Failed to create form");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this form? All responses will be lost.")) {
      try {
        await api.delete(`/forms/${id}`);
        fetchForms();
      } catch (err) {
        alert("Failed to delete form");
      }
    }
  };

  if (loading) return <AdminLayout><TableSkeleton /></AdminLayout>;

  return (
    <AdminLayout requiredRole="admin">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-4xl uppercase mb-1">Forms</h1>
          <p className="font-mono text-[var(--color-text-secondary)] text-sm font-bold uppercase tracking-widest">
            Manage Custom Forms & Surveys
          </p>
        </div>
        <Button onClick={handleCreate} variant="primary" icon={<FiPlus />}>
          Create Form
        </Button>
      </div>

      <div className="glass-card p-0 overflow-hidden border border-[var(--color-border-subtle)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] uppercase tracking-wider border-b border-[var(--color-border-subtle)] text-xs font-semibold">
              <tr>
                <th className="p-4 border-none">Form Title</th>
                <th className="p-4 border-none text-center">Status</th>
                <th className="p-4 border-none text-center">Responses</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {forms.length > 0 ? (
                forms.map((form) => (
                  <tr key={form.id} className="hover:bg-[var(--color-bg-surface)] transition-colors">
                    <td className="p-4 border-none">
                      <div className="font-display font-bold text-base">{form.title}</div>
                      <div className="text-[var(--color-text-secondary)] text-xs mt-1 truncate max-w-[200px]">
                        {form.description}
                      </div>
                    </td>
                    <td className="p-4 border-none text-center">
                      {form.is_published ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">Published</span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]/50">Draft</span>
                      )}
                    </td>
                    <td className="p-4 border-none text-center">
                      <Link href={`/admin/forms/${form.id}/responses`} className="font-bold text-[var(--color-brand-secondary)] hover:underline">
                        {form.response_count || 0} Responses
                      </Link>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      <Link 
                        href={`/f/${form.id}`}
                        target="_blank"
                        className="p-2 text-[var(--color-text-secondary)] hover:text-white transition-colors"
                        title="View Public Form"
                      >
                        <FiEye size={18} />
                      </Link>
                      <Link 
                        href={`/admin/forms/${form.id}/builder`} 
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-brand-secondary)] transition-colors"
                        title="Edit Builder"
                      >
                        <FiSettings size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(form.id)}
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
                    No forms created yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
