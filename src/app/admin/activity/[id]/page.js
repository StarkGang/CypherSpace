"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Paper from "../../../../components/design-system/Paper";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import { FormSkeleton } from "../../../../components/ui/Skeleton";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { api } from "../../../../lib/api";

export default function AdminActivityForm() {
  const params = useParams();
  const router = useRouter();
  const isNew = params?.id === "new";
  const activityId = params?.id;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    type: "created",
    entity_type: "",
    entity_slug: "",
    entity_id: ""
  });

  useEffect(() => {
    if (isNew) return;
    
    const fetchActivity = async () => {
      try {
        const res = await api.get(`/activity/${activityId}`);
        const data = res.data.data;
        setFormData({
          title: data.title || "",
          type: data.type || "created",
          entity_type: data.entity_type || "",
          entity_slug: data.entity_slug || "",
          entity_id: data.entity_id || ""
        });
      } catch (err) {
        setError("Failed to load activity");
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [isNew, activityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (isNew) {
        await api.post("/activity", formData);
      } else {
        await api.put(`/activity/${activityId}`, formData);
      }
      router.push("/admin/activity");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save activity");
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><FormSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button href="/admin/activity" variant="ghost" className="mb-2 -ml-4" icon={<FiArrowLeft />}>
            Back to Network Explorer
          </Button>
          <h1 className="font-display font-black text-4xl uppercase mb-1">
            {isNew ? "New Activity" : "Edit Activity"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-32">
        
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="flex flex-col gap-8">
            <Paper variant="default" className="p-6 md:p-8" rotate={0} shadowSize="sm">
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-ink-black)] pb-2">Activity Info</h2>
              
              <Input
                label="Title / Description"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="text-lg"
              />

              <Input
                label="Action Type (e.g. created, updated)"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              />

              <Input
                label="Entity Type (e.g. event, project)"
                name="entity_type"
                value={formData.entity_type}
                onChange={handleChange}
              />
              
              <Input
                label="Entity Slug (Optional)"
                name="entity_slug"
                value={formData.entity_slug}
                onChange={handleChange}
              />

            </Paper>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-[var(--color-paper-white)] border-t-4 border-[var(--color-ink-black)] z-30 flex justify-end gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.15)]">
          <Button href="/admin/activity" variant="outline" type="button">Cancel</Button>
          <Button type="submit" variant="primary" icon={<FiSave />} disabled={saving}>
            {saving ? "Saving..." : "Save Activity"}
          </Button>
        </div>
      </form>

    </AdminLayout>
  );
}
