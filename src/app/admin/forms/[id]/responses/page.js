"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../../components/admin/AdminLayout";
import { TableSkeleton } from "../../../../../components/ui/Skeleton";
import { api } from "../../../../../lib/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function FormResponses() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [formRes, respRes] = await Promise.all([
        api.get(`/forms/${params.id}`),
        api.get(`/forms/${params.id}/responses`)
      ]);
      setForm(formRes.data.data);
      setResponses(respRes.data.data);
    } catch (err) {
      alert("Failed to load responses");
      router.push("/admin/forms");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminLayout><TableSkeleton /></AdminLayout>;

  return (
    <AdminLayout requiredRole="admin">
      <div className="mb-8">
        <Link href="/admin/forms" className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-white mb-4 text-sm font-mono transition-colors">
          <FiArrowLeft /> Back to Forms
        </Link>
        <h1 className="font-display font-black text-4xl uppercase mb-1">Responses</h1>
        <p className="font-mono text-[var(--color-text-secondary)] text-sm font-bold uppercase tracking-widest">
          {form?.title}
        </p>
      </div>

      <div className="glass-card p-0 overflow-hidden border border-[var(--color-border-subtle)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] uppercase tracking-wider border-b border-[var(--color-border-subtle)] text-xs font-semibold">
              <tr>
                <th className="p-4 border-none w-48">Submitted At</th>
                <th className="p-4 border-none">Answers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {responses.length > 0 ? (
                responses.map((response) => (
                  <tr key={response.id} className="hover:bg-[var(--color-bg-surface)] transition-colors">
                    <td className="p-4 border-none align-top whitespace-nowrap text-[var(--color-text-secondary)]">
                      {new Date(response.submitted_at).toLocaleString()}
                    </td>
                    <td className="p-4 border-none">
                      <div className="flex flex-col gap-4">
                        {form?.schema_json?.map(block => (
                          <div key={block.id}>
                            <div className="font-bold text-[var(--color-text-primary)] mb-1">{block.question}</div>
                            <div className="text-[var(--color-text-secondary)] bg-[var(--color-bg-surface)] p-3 rounded border border-[var(--color-border-subtle)] whitespace-pre-wrap">
                              {response.answers_json[block.id] || <span className="italic opacity-50">No answer provided</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-[var(--color-text-secondary)] font-bold uppercase">
                    No responses yet
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
