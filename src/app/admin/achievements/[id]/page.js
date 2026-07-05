"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Paper from "../../../../components/design-system/Paper";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import { TableSkeleton, FormSkeleton, PageSkeleton } from "../../../../components/ui/Skeleton";
import { FiSave, FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import { api } from "../../../../lib/api";

export default function AdminAchievementForm() {
  const params = useParams();
  const router = useRouter();
  const isNew = params?.id === "new";
  const achievementId = params?.id;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    image: "",
    certificate: "",
    external_link: "",
    members: [""]
  });

  useEffect(() => {
    if (isNew) return;
    
    const fetchAchievement = async () => {
      try {
        const res = await api.get(`/achievements/${achievementId}`);
        const data = res.data.data;
        setFormData({
          ...data,
          members: data.members?.length ? data.members : [""]
        });
      } catch (err) {
        setError("Failed to load achievement");
      } finally {
        setLoading(false);
      }
    };
    fetchAchievement();
  }, [isNew, achievementId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    if (newArray.length === 0) newArray.push("");
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const cleanedData = {
      ...formData,
      members: formData.members.filter(item => item.trim() !== ""),
    };

    try {
      if (isNew) {
        await api.post("/achievements", cleanedData);
      } else {
        await api.put(`/achievements/${achievementId}`, cleanedData);
      }
      router.push("/admin/achievements");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save achievement");
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><FormSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button href="/admin/achievements" variant="ghost" className="mb-2 -ml-4" icon={<FiArrowLeft />}>
            Back to Achievements
          </Button>
          <h1 className="font-display font-black text-4xl uppercase mb-1">
            {isNew ? "New Achievement" : "Edit Achievement"}
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
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-ink-black)] pb-2">Details</h2>
              
              <Input
                label="Achievement Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="text-lg"
              />

              <Input
                as="textarea"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />

              <Input
                label="Date (e.g., Nov 2026)"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="Nov 2026"
                required
              />
            </Paper>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-8">
            <Paper variant="default" className="p-6" rotate={0} shadowSize="sm">
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-ink-black)] pb-2">Media & Makers</h2>
              
              <Input
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
              />

              {formData.image && (
                <div className="mt-2 mb-6 border-brutal overflow-hidden w-full aspect-video bg-[var(--color-paper-cream)]">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                  <div style={{ display: 'none' }} className="w-full h-full flex items-center justify-center font-mono text-red-500 text-sm">Image failed to load</div>
                </div>
              )}

              <Input
                label="Certificate Image URL"
                name="certificate"
                value={formData.certificate}
                onChange={handleChange}
                placeholder="https://..."
              />

              <Input
                label="External Link URL"
                name="external_link"
                value={formData.external_link}
                onChange={handleChange}
                placeholder="https://..."
              />

              <div className="border-t-2 border-[var(--color-ink-dark)]/20 pt-6 mt-6">
                <label className="mb-2 font-display font-bold uppercase tracking-wider text-sm flex items-center">
                  Makers Involved
                </label>
                {formData.members.map((member, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      value={member}
                      onChange={(e) => handleArrayChange("members", i, e.target.value)}
                      className="mb-0"
                    />
                    <Button type="button" variant="outline" onClick={() => removeArrayItem("members", i)} className="px-3" icon={<FiTrash2 />} />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("members")} className="mt-2 text-xs" icon={<FiPlus />}>Add Maker</Button>
              </div>

            </Paper>
          </div>

        </div>

        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-[var(--color-paper-white)] border-t-4 border-[var(--color-ink-black)] z-30 flex justify-end gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.15)]">
          <Button href="/admin/achievements" variant="outline" type="button">Cancel</Button>
          <Button type="submit" variant="primary" icon={<FiSave />} disabled={saving}>
            {saving ? "Saving..." : "Save Achievement"}
          </Button>
        </div>
      </form>

    </AdminLayout>
  );
}
