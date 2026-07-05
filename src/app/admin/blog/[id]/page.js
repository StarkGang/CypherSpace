"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Paper from "../../../../components/design-system/Paper";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import { TableSkeleton, FormSkeleton, PageSkeleton } from "../../../../components/ui/Skeleton";
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiArrowUp, FiArrowDown, FiType, FiHash, FiImage, FiCode } from "react-icons/fi";
import { api } from "../../../../lib/api";

export default function AdminBlogForm() {
  const params = useParams();
  const router = useRouter();
  const isNew = params?.id === "new";
  const postId = params?.id;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    cover_image: "",
    status: "draft",
    tags: [""],
    blocks: [],
    external_url: ""
  });

  useEffect(() => {
    if (isNew) return;
    
    const fetchPost = async () => {
      try {
        const res = await api.get(`/blogs/${postId}`);
        const data = res.data.data;
        setFormData({
          ...data,
          status: data.published ? "published" : "draft",
          tags: data.tags?.length ? data.tags : [""],
          blocks: data.blocks || []
        });
      } catch (err) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [isNew, postId]);

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

  const addBlock = (type) => {
    const newBlock = {
      type,
      content: "",
      metadata: type === "code" ? { language: "text" } : type === "image" ? { caption: "" } : {}
    };
    setFormData(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  const updateBlock = (index, field, value) => {
    const newBlocks = [...formData.blocks];
    if (field === "content") {
      newBlocks[index].content = value;
    } else {
      newBlocks[index].metadata = { ...newBlocks[index].metadata, [field]: value };
    }
    setFormData(prev => ({ ...prev, blocks: newBlocks }));
  };

  const removeBlock = (index) => {
    const newBlocks = formData.blocks.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, blocks: newBlocks }));
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...formData.blocks];
    if (direction === "up" && index > 0) {
      [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    } else if (direction === "down" && index < newBlocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    }
    setFormData(prev => ({ ...prev, blocks: newBlocks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const cleanedData = {
      ...formData,
      published: formData.status === "published",
      tags: formData.tags.filter(item => item.trim() !== ""),
    };

    try {
      if (isNew) {
        await api.post("/blogs", cleanedData);
      } else {
        await api.put(`/blogs/${postId}`, cleanedData);
      }
      router.push("/admin/blog");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save post");
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><FormSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button href="/admin/blog" variant="ghost" className="mb-2 -ml-4" icon={<FiArrowLeft />}>
            Back to Blog
          </Button>
          <h1 className="font-display font-black text-4xl uppercase mb-1">
            {isNew ? "New Post" : "Edit Post"}
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
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-border-subtle)] pb-2">Basic Info</h2>
              
              <Input
                label="Post Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="text-xl font-bold"
              />

              <Input
                as="textarea"
                label="Excerpt (Short summary for listings)"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                required
              />

              <Input
                label="Cover Image URL"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="https://..."
              />
            </Paper>

            <Paper variant="default" className="p-6 md:p-8" rotate={0} shadowSize="sm">
              <div className="flex justify-between items-center mb-6 border-b-2 border-[var(--color-border-subtle)] pb-2">
                <h2 className="font-display font-black text-2xl uppercase">Block Editor</h2>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => addBlock("text")} icon={<FiType />} title="Add Text" />
                  <Button type="button" variant="outline" size="sm" onClick={() => addBlock("heading")} icon={<FiHash />} title="Add Heading" />
                  <Button type="button" variant="outline" size="sm" onClick={() => addBlock("image")} icon={<FiImage />} title="Add Image" />
                  <Button type="button" variant="outline" size="sm" onClick={() => addBlock("code")} icon={<FiCode />} title="Add Code" />
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {formData.blocks.length === 0 ? (
                  <div className="text-center p-8 bg-[var(--color-bg-surface)] border-2 border-dashed border-[var(--color-border-subtle)]/30">
                    <p className="font-mono text-[var(--color-text-secondary)] mb-4">No content blocks yet.</p>
                    <div className="flex justify-center gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => addBlock("text")} icon={<FiType />}>Text</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => addBlock("heading")} icon={<FiHash />}>Heading</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => addBlock("image")} icon={<FiImage />}>Image</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => addBlock("code")} icon={<FiCode />}>Code</Button>
                    </div>
                  </div>
                ) : (
                  formData.blocks.map((block, i) => (
                    <div key={i} className="border-[3px] border-[var(--color-border-subtle)] bg-[var(--color-bg-deep)] group relative">
                      <div className="bg-[var(--color-bg-surface)] border-b-[3px] border-[var(--color-border-subtle)] px-3 py-2 flex justify-between items-center">
                        <span className="font-mono text-xs font-bold uppercase tracking-widest bg-[var(--color-border-subtle)] text-[var(--color-text-primary)] px-2 py-0.5">
                          {block.type}
                        </span>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => moveBlock(i, "up")} disabled={i === 0} className="p-1 hover:bg-[var(--color-bg-surface)] disabled:opacity-30">
                            <FiArrowUp />
                          </button>
                          <button type="button" onClick={() => moveBlock(i, "down")} disabled={i === formData.blocks.length - 1} className="p-1 hover:bg-[var(--color-bg-surface)] disabled:opacity-30">
                            <FiArrowDown />
                          </button>
                          <button type="button" onClick={() => removeBlock(i)} className="p-1 hover:bg-red-200 text-red-600 ml-2">
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        {block.type === "text" && (
                          <textarea
                            value={block.content}
                            onChange={(e) => updateBlock(i, "content", e.target.value)}
                            placeholder="Write your text here..."
                            rows={4}
                            className="w-full resize-y border-none focus:ring-0 p-0 font-body text-lg bg-transparent text-[var(--color-text-primary)]"
                          />
                        )}
                        {block.type === "heading" && (
                          <input
                            type="text"
                            value={block.content}
                            onChange={(e) => updateBlock(i, "content", e.target.value)}
                            placeholder="Heading text..."
                            className="w-full border-none focus:ring-0 p-0 font-display font-black text-2xl uppercase bg-transparent text-[var(--color-text-primary)]"
                          />
                        )}
                        {block.type === "image" && (
                          <div className="flex flex-col gap-3">
                            <Input
                              label="Image URL"
                              value={block.content}
                              onChange={(e) => updateBlock(i, "content", e.target.value)}
                              placeholder="https://..."
                              className="mb-0"
                            />
                            <Input
                              label="Caption (optional)"
                              value={block.metadata?.caption || ""}
                              onChange={(e) => updateBlock(i, "caption", e.target.value)}
                              className="mb-0"
                            />
                            {block.content && (
                              <img src={block.content} alt="Preview" className="max-h-40 object-contain border-brutal mt-2" onError={(e) => e.target.style.display = 'none'} />
                            )}
                          </div>
                        )}
                        {block.type === "code" && (
                          <div className="flex flex-col gap-3">
                            <Input
                              label="Language"
                              value={block.metadata?.language || "text"}
                              onChange={(e) => updateBlock(i, "language", e.target.value)}
                              placeholder="python, javascript, etc."
                              className="mb-0"
                            />
                            <textarea
                              value={block.content}
                              onChange={(e) => updateBlock(i, "content", e.target.value)}
                              placeholder="Paste code here..."
                              rows={6}
                              className="w-full resize-y bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm border-brutal focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Paper>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-8">
            <Paper variant="default" className="p-6" rotate={0} shadowSize="sm">
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-border-subtle)] pb-2">Status & Meta</h2>
              
              <Input
                label="External URL (Optional redirect)"
                name="external_url"
                value={formData.external_url || ""}
                onChange={handleChange}
                placeholder="https://medium.com/..."
              />

              <div className="mb-6 border-t-2 border-[var(--color-border-subtle)] pt-6 mt-6">
                <label className="mb-2 font-display font-bold uppercase tracking-wider text-sm flex items-center">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--color-bg-deep)] text-[var(--color-text-primary)] border-brutal font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-primary)]/30 shadow-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="border-t-2 border-[var(--color-border-subtle)] pt-6">
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

            </Paper>
          </div>

        </div>

        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-[var(--color-bg-surface)] border-t border-[var(--color-border-subtle)] z-30 flex justify-end gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.15)]">
          <Button href="/admin/blog" variant="outline" type="button">Cancel</Button>
          <Button type="submit" variant="primary" icon={<FiSave />} disabled={saving}>
            {saving ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </form>

    </AdminLayout>
  );
}
