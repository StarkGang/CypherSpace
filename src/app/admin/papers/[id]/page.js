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

export default function AdminPaperForm() {
  const params = useParams();
  const router = useRouter();
  const isNew = params?.id === "new";
  const paperId = params?.id;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    discussion_notes: "",
    paper_link: "",
    date_discussed: "",
    cover_image: "",
    tags: [""],
    authors: [""],
    external_url: ""
  });

  useEffect(() => {
    if (isNew) return;
    
    const fetchPaper = async () => {
      try {
        const res = await api.get(`/papers/${paperId}`);
        const data = res.data.data;
        setFormData({
          ...data,
          tags: data.tags?.length ? data.tags : [""],
          authors: data.authors?.length ? data.authors : [""]
        });
      } catch (err) {
        setError("Failed to load paper");
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [isNew, paperId]);

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
      tags: formData.tags.filter(item => item.trim() !== ""),
      authors: formData.authors.filter(item => item.trim() !== ""),
    };

    try {
      if (isNew) {
        await api.post("/papers", cleanedData);
      } else {
        await api.put(`/papers/${paperId}`, cleanedData);
      }
      router.push("/admin/papers");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save paper");
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><FormSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button href="/admin/papers" variant="ghost" className="mb-2 -ml-4" icon={<FiArrowLeft />}>
            Back to Papers
          </Button>
          <h1 className="font-display font-black text-4xl uppercase mb-1">
            {isNew ? "New Paper" : "Edit Paper"}
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
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-ink-black)] pb-2">Paper Details</h2>
              
              <Input
                label="Paper Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="text-lg"
              />

              <Input
                as="textarea"
                label="Summary / Abstract"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={4}
                required
              />

              <Input
                as="textarea"
                label="Discussion Notes / Takeaways"
                name="discussion_notes"
                value={formData.discussion_notes}
                onChange={handleChange}
                rows={8}
                helperText="Markdown or plain text notes from the reading group."
              />
            </Paper>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-8">
            <Paper variant="default" className="p-6" rotate={0} shadowSize="sm">
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-ink-black)] pb-2">Metadata</h2>
              
              <Input
                label="External URL (Optional redirect)"
                name="external_url"
                value={formData.external_url || ""}
                onChange={handleChange}
                placeholder="https://medium.com/... or external blog"
              />

              <Input
                label="Cover Image URL"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="https://..."
              />

              <Input
                label="Date Discussed"
                name="date_discussed"
                value={formData.date_discussed}
                onChange={handleChange}
                placeholder="e.g., Oct 10, 2026"
              />

              <Input
                label="Original Paper URL (PDF/Arxiv)"
                name="paper_link"
                value={formData.paper_link}
                onChange={handleChange}
                placeholder="https://arxiv.org/abs/..."
              />

              <div className="border-t-2 border-[var(--color-ink-dark)]/20 pt-6 mt-6">
                <label className="mb-2 font-display font-bold uppercase tracking-wider text-sm flex items-center">
                  Tags
                </label>
                {formData.tags.map((tag, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      value={tag}
                      onChange={(e) => handleArrayChange("tags", i, e.target.value)}
                      className="mb-0"
                    />
                    <Button type="button" variant="outline" onClick={() => removeArrayItem("tags", i)} className="px-3" icon={<FiTrash2 />} />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("tags")} className="mt-2 text-xs" icon={<FiPlus />}>Add Tag</Button>
              </div>

              <div className="border-t-2 border-[var(--color-ink-dark)]/20 pt-6 mt-6">
                <label className="mb-2 font-display font-bold uppercase tracking-wider text-sm flex items-center">
                  Authors
                </label>
                {formData.authors.map((author, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      value={author}
                      onChange={(e) => handleArrayChange("authors", i, e.target.value)}
                      className="mb-0"
                    />
                    <Button type="button" variant="outline" onClick={() => removeArrayItem("authors", i)} className="px-3" icon={<FiTrash2 />} />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("authors")} className="mt-2 text-xs" icon={<FiPlus />}>Add Author</Button>
              </div>

            </Paper>
          </div>

        </div>

        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-[var(--color-paper-white)] border-t-4 border-[var(--color-ink-black)] z-30 flex justify-end gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.15)]">
          <Button href="/admin/papers" variant="outline" type="button">Cancel</Button>
          <Button type="submit" variant="primary" icon={<FiSave />} disabled={saving}>
            {saving ? "Saving..." : "Save Paper"}
          </Button>
        </div>
      </form>

    </AdminLayout>
  );
}
