"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Paper from "../../../../components/design-system/Paper";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import { TableSkeleton, FormSkeleton, PageSkeleton } from "../../../../components/ui/Skeleton";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { api } from "../../../../lib/api";

export default function AdminTeamForm() {
  const params = useParams();
  const router = useRouter();
  const isNew = params?.id === "new";
  const memberId = params?.id;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    image: "",
    github: "",
    linkedin: "",
    portfolio: "",
    email: "",
    display_order: 99
  });

  useEffect(() => {
    if (isNew) return;
    
    const fetchMember = async () => {
      try {
        const res = await api.get(`/team/${memberId}`);
        setFormData(res.data.data);
      } catch (err) {
        setError("Failed to load team member");
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [isNew, memberId]);

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
        await api.post("/team", formData);
      } else {
        await api.put(`/team/${memberId}`, formData);
      }
      router.push("/admin/team");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save team member");
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><FormSkeleton /></AdminLayout>;

  return (
    <AdminLayout requiredRole="admin">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button href="/admin/team" variant="ghost" className="mb-2 -ml-4" icon={<FiArrowLeft />}>
            Back to Team
          </Button>
          <h1 className="font-display font-black text-4xl uppercase mb-1">
            {isNew ? "New Team Member" : "Edit Team Member"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-32">
        
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Paper variant="default" className="p-6 md:p-8" rotate={0} shadowSize="sm">
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-ink-black)] pb-2">Profile Info</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Role (e.g., Core Team, Alumnus)"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                as="textarea"
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="GitHub Profile URL"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />
                <Input
                  label="LinkedIn Profile URL"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                />
                <Input
                  label="Portfolio URL"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                />
                <Input
                  label="Display Order (lower is first)"
                  name="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={handleChange}
                  placeholder="99"
                />
              </div>
            </Paper>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-8">
            <Paper variant="default" className="p-6" rotate={0} shadowSize="sm">
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-ink-black)] pb-2">Photo</h2>
              
              <Input
                label="Profile Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
              />

              {formData.image && (
                <div className="mt-4 mb-6 border-[3px] border-[var(--color-ink-black)] rounded-full overflow-hidden w-40 h-40 mx-auto bg-[var(--color-paper-cream)]">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                  <div style={{ display: 'none' }} className="w-full h-full flex items-center justify-center font-mono text-red-500 text-xs text-center p-2">Failed to load</div>
                </div>
              )}
            </Paper>
          </div>

        </div>

        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-[var(--color-paper-white)] border-t-4 border-[var(--color-ink-black)] z-30 flex justify-end gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.15)]">
          <Button href="/admin/team" variant="outline" type="button">Cancel</Button>
          <Button type="submit" variant="primary" icon={<FiSave />} disabled={saving}>
            {saving ? "Saving..." : "Save Member"}
          </Button>
        </div>
      </form>

    </AdminLayout>
  );
}
