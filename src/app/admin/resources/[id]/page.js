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

export default function AdminResourceForm() {
  const params = useParams();
  const router = useRouter();
  const isNew = params?.id === "new";
  const resourceId = params?.id;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tutorial",
    difficulty: "beginner",
    link: "",
    thumbnail: "",
    tags: "",
    files: [""]
  });

  useEffect(() => {
    if (isNew) return;
    
    const fetchResource = async () => {
      try {
        const res = await api.get(`/resources/${resourceId}`);
        const data = res.data.data;
        const predefinedCategories = ["fundamentals", "cryptography", "smart_contracts", "research", "tools", "other"];
        
        setFormData({
          ...data,
          tags: data.tags ? data.tags.join(", ") : "",
          files: data.files?.length ? data.files : [""]
        });

        if (data.category && !predefinedCategories.includes(data.category)) {
          setIsCustomCategory(true);
        }
      } catch (err) {
        setError("Failed to load resource");
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [isNew, resourceId]);

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
      tags: typeof formData.tags === 'string' ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : formData.tags,
      files: formData.files.filter(item => item.trim() !== ""),
    };

    try {
      if (isNew) {
        await api.post("/resources", cleanedData);
      } else {
        await api.put(`/resources/${resourceId}`, cleanedData);
      }
      router.push("/admin/resources");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save resource");
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><FormSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button href="/admin/resources" variant="ghost" className="mb-2 -ml-4" icon={<FiArrowLeft />}>
            Back to Resources
          </Button>
          <h1 className="font-display font-black text-4xl uppercase mb-1">
            {isNew ? "New Resource" : "Edit Resource"}
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
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-border-subtle)] pb-2">Resource Info</h2>
              
              <Input
                label="Resource Title"
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
                label="Resource Link URL"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://..."
                required
              />

              <Input
                label="Tags (comma separated)"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="blockchain, web3, dataset"
              />
            </Paper>

            <Paper variant="default" className="p-6 md:p-8" rotate={0} shadowSize="sm">
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-border-subtle)] pb-2">Media & Files</h2>
              
              <Input
                label="Thumbnail Image URL"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://..."
              />

              {formData.thumbnail && (
                <div className="mt-2 mb-6 border-[3px] border-[var(--color-border-glow)] rounded overflow-hidden w-full max-w-xs aspect-video bg-[var(--color-bg-deep)]">
                  <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}

              <div className="mt-8">
                <label className="mb-2 font-display font-bold uppercase tracking-wider text-sm flex items-center">
                  File URLs (PDFs, Source code, etc.)
                </label>
                {formData.files.map((url, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      name={`files-${i}`}
                      value={url}
                      onChange={(e) => handleArrayChange("files", i, e.target.value)}
                      placeholder="https://..."
                      className="mb-0"
                    />
                    <Button type="button" variant="outline" onClick={() => removeArrayItem("files", i)} className="px-3" icon={<FiTrash2 />} />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("files")} className="mt-2" icon={<FiPlus />}>
                  Add File URL
                </Button>
              </div>
            </Paper>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-8">
            <Paper variant="default" className="p-6" rotate={0} shadowSize="sm">
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-border-subtle)] pb-2">Category</h2>
              
              <div className="mb-6">
                <label className="mb-2 font-display font-bold uppercase tracking-wider text-sm flex items-center">
                  Resource Category
                </label>
                <select
                  name="category"
                  value={isCustomCategory ? "custom" : formData.category}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setIsCustomCategory(true);
                      setFormData(prev => ({ ...prev, category: "" }));
                    } else {
                      setIsCustomCategory(false);
                      handleChange(e);
                    }
                  }}
                  className="w-full px-4 py-3 bg-[var(--color-bg-deep)] text-[var(--color-text-primary)] border-brutal font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-primary)]/30 shadow-sm"
                >
                  <option value="fundamentals">Blockchain Fundamentals</option>
                  <option value="cryptography">Cryptography</option>
                  <option value="smart_contracts">Smart Contracts & Development</option>
                  <option value="research">Research & Papers</option>
                  <option value="tools">Developer Tools</option>
                  <option value="other">Other</option>
                  <option value="custom">Custom...</option>
                </select>
                {isCustomCategory && (
                  <Input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter custom category"
                    className="mt-4"
                    required
                  />
                )}
              </div>

              <div className="mb-6">
                <label className="mb-2 font-display font-bold uppercase tracking-wider text-sm flex items-center">
                  Difficulty Level
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--color-bg-deep)] text-[var(--color-text-primary)] border-brutal font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-primary)]/30 shadow-sm"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </Paper>
          </div>

        </div>

        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-[var(--color-bg-surface)] border-t border-[var(--color-border-subtle)] z-30 flex justify-end gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.15)]">
          <Button href="/admin/resources" variant="outline" type="button">Cancel</Button>
          <Button type="submit" variant="primary" icon={<FiSave />} disabled={saving}>
            {saving ? "Saving..." : "Save Resource"}
          </Button>
        </div>
      </form>

    </AdminLayout>
  );
}
