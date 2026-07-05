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

export default function AdminProjectForm() {
  const params = useParams();
  const router = useRouter();
  const isNew = params?.id === "new";
  const projectId = params?.id;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "in_progress",
    featured: false,
    cover_image: "",
    gallery: [""],
    tags: [""],
    tech_stack: [""],
    contributors: [""],
    github_link: "",
    demo_link: "",
    external_url: ""
  });

  useEffect(() => {
    if (isNew) return;
    
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${projectId}`);
        const data = res.data.data;
        setFormData({
          ...data,
          gallery: data.gallery?.length ? data.gallery : [""],
          tags: data.tags?.length ? data.tags : [""],
          tech_stack: data.tech_stack?.length ? data.tech_stack : [""],
          contributors: data.contributors?.length ? data.contributors : [""]
        });
      } catch (err) {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [isNew, projectId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
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
      gallery: formData.gallery.filter(item => item.trim() !== ""),
      tags: formData.tags.filter(item => item.trim() !== ""),
      tech_stack: formData.tech_stack.filter(item => item.trim() !== ""),
      contributors: formData.contributors.filter(item => item.trim() !== ""),
    };

    try {
      if (isNew) {
        await api.post("/projects", cleanedData);
      } else {
        await api.put(`/projects/${projectId}`, cleanedData);
      }
      router.push("/admin/projects");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save project");
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><FormSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button href="/admin/projects" variant="ghost" className="mb-2 -ml-4" icon={<FiArrowLeft />}>
            Back to Projects
          </Button>
          <h1 className="font-display font-black text-4xl uppercase mb-1">
            {isNew ? "New Project" : "Edit Project"}
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
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-ink-black)] pb-2">Basic Info</h2>
              
              <Input
                label="Project Title"
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
                rows={6}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="GitHub Link URL"
                  name="github_link"
                  value={formData.github_link}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />
                <Input
                  label="Demo Link URL"
                  name="demo_link"
                  value={formData.demo_link}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
              <div className="mt-4">
                <Input
                  label="External URL (Optional redirect)"
                  name="external_url"
                  value={formData.external_url || ""}
                  onChange={handleChange}
                  placeholder="https://medium.com/..."
                />
              </div>
            </Paper>

            <Paper variant="default" className="p-6 md:p-8" rotate={0} shadowSize="sm">
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-ink-black)] pb-2">Media URLs</h2>
              
              <Input
                label="Cover Image URL"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                helperText="Provide a direct URL to the cover image"
              />

              {formData.cover_image && (
                <div className="mt-2 mb-6 border-brutal overflow-hidden w-full max-w-sm aspect-video bg-[var(--color-paper-cream)]">
                  <img src={formData.cover_image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                  <div style={{ display: 'none' }} className="w-full h-full flex items-center justify-center font-mono text-red-500 text-sm">Image failed to load</div>
                </div>
              )}

              <div className="mt-8">
                <label className="mb-2 font-display font-bold uppercase tracking-wider text-sm flex items-center">
                  Gallery Image URLs
                </label>
                {formData.gallery.map((url, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      name={`gallery-${i}`}
                      value={url}
                      onChange={(e) => handleArrayChange("gallery", i, e.target.value)}
                      placeholder="https://..."
                      className="mb-0"
                    />
                    <Button type="button" variant="outline" onClick={() => removeArrayItem("gallery", i)} className="px-3" icon={<FiTrash2 />} />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("gallery")} className="mt-2" icon={<FiPlus />}>
                  Add Image URL
                </Button>
              </div>
            </Paper>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-8">
            <Paper variant="default" className="p-6" rotate={0} shadowSize="sm">
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-ink-black)] pb-2">Status</h2>
              
              <div className="mb-6">
                <label className="mb-2 font-display font-bold uppercase tracking-wider text-sm flex items-center">
                  Project Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--color-paper-white)] text-[var(--color-ink-black)] border-brutal font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[var(--color-sticker-pink)]/30 shadow-[var(--shadow-sticker)]"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-6 h-6 border-brutal text-[var(--color-ink-black)] focus:ring-[var(--color-ink-black)]"
                />
                <label htmlFor="featured" className="font-mono font-bold uppercase cursor-pointer">
                  Featured Project
                </label>
              </div>
            </Paper>

            <Paper variant="default" className="p-6" rotate={0} shadowSize="sm">
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-ink-black)] pb-2">Metadata</h2>
              
              <div className="mb-6">
                <label className="mb-2 font-display font-bold uppercase tracking-wider text-sm flex items-center">
                  Tags (e.g., CV, NLP)
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
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("tags")} className="mt-2 text-xs" icon={<FiPlus />}>Add</Button>
              </div>

              <div className="mb-6 border-t-2 border-[var(--color-ink-dark)]/20 pt-6">
                <label className="mb-2 font-display font-bold uppercase tracking-wider text-sm flex items-center">
                  Tech Stack (e.g., Python, PyTorch)
                </label>
                {formData.tech_stack.map((tech, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      value={tech}
                      onChange={(e) => handleArrayChange("tech_stack", i, e.target.value)}
                      className="mb-0"
                    />
                    <Button type="button" variant="outline" onClick={() => removeArrayItem("tech_stack", i)} className="px-3" icon={<FiTrash2 />} />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("tech_stack")} className="mt-2 text-xs" icon={<FiPlus />}>Add</Button>
              </div>

              <div className="border-t-2 border-[var(--color-ink-dark)]/20 pt-6">
                <label className="mb-2 font-display font-bold uppercase tracking-wider text-sm flex items-center">
                  Contributors
                </label>
                {formData.contributors.map((person, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input
                      value={person}
                      onChange={(e) => handleArrayChange("contributors", i, e.target.value)}
                      className="mb-0"
                    />
                    <Button type="button" variant="outline" onClick={() => removeArrayItem("contributors", i)} className="px-3" icon={<FiTrash2 />} />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("contributors")} className="mt-2 text-xs" icon={<FiPlus />}>Add</Button>
              </div>

            </Paper>
          </div>

        </div>

        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-[var(--color-paper-white)] border-t-4 border-[var(--color-ink-black)] z-30 flex justify-end gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.15)]">
          <Button href="/admin/projects" variant="outline" type="button">Cancel</Button>
          <Button type="submit" variant="primary" icon={<FiSave />} disabled={saving}>
            {saving ? "Saving..." : "Save Project"}
          </Button>
        </div>
      </form>

    </AdminLayout>
  );
}
