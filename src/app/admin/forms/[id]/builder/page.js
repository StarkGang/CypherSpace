"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../../../components/admin/AdminLayout";
import Button from "../../../../../components/ui/Button";
import { PageSkeleton } from "../../../../../components/ui/Skeleton";
import { FiSave, FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { api } from "../../../../../lib/api";
import { useParams, useRouter } from "next/navigation";

export default function FormBuilder() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [params.id]);

  const fetchForm = async () => {
    try {
      const res = await api.get(`/forms/${params.id}`);
      setForm(res.data.data);
      setBlocks(res.data.data.schema_json || []);
    } catch (err) {
      alert("Failed to load form");
      router.push("/admin/forms");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/forms/${params.id}`, {
        ...form,
        schema_json: blocks
      });
      alert("Form saved successfully");
    } catch (err) {
      alert("Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  const addBlock = (type) => {
    const newBlock = {
      id: `block_${Date.now()}`,
      type,
      question: "New Question",
      required: false,
      options: type === "multiple_choice" ? ["Option 1", "Option 2"] : []
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, field, value) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const updateOption = (blockId, optionIndex, value) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        const newOptions = [...b.options];
        newOptions[optionIndex] = value;
        return { ...b, options: newOptions };
      }
      return b;
    }));
  };

  const addOption = (blockId) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        return { ...b, options: [...b.options, `Option ${b.options.length + 1}`] };
      }
      return b;
    }));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index, direction) => {
    if (direction === "up" && index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      setBlocks(newBlocks);
    } else if (direction === "down" && index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
      setBlocks(newBlocks);
    }
  };

  if (loading) return <AdminLayout><PageSkeleton /></AdminLayout>;

  return (
    <AdminLayout requiredRole="admin">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-4xl uppercase mb-1">Form Builder</h1>
          <p className="font-mono text-[var(--color-text-secondary)] text-sm font-bold uppercase tracking-widest">
            {form?.title}
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => window.open(`/f/${form.id}`, "_blank")} variant="outline">
            Preview
          </Button>
          <Button onClick={handleSave} variant="primary" icon={<FiSave />} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-card p-6">
            <input 
              type="text" 
              className="w-full bg-transparent text-3xl font-display font-black focus:outline-none mb-4"
              value={form?.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              placeholder="Form Title"
            />
            <textarea 
              className="w-full bg-transparent font-mono text-sm focus:outline-none resize-none text-[var(--color-text-secondary)]"
              rows={2}
              value={form?.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              placeholder="Form description or instructions..."
            />
          </div>

          <div className="flex flex-col gap-4">
            {blocks.map((block, index) => (
              <div key={block.id} className="glass-card p-6 border border-[var(--color-border-subtle)] relative group">
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={() => moveBlock(index, "up")} className="p-2 bg-[var(--color-bg-surface)] rounded hover:text-[var(--color-brand-secondary)]"><FiArrowUp /></button>
                  <button onClick={() => moveBlock(index, "down")} className="p-2 bg-[var(--color-bg-surface)] rounded hover:text-[var(--color-brand-secondary)]"><FiArrowDown /></button>
                  <button onClick={() => removeBlock(block.id)} className="p-2 bg-[var(--color-bg-surface)] rounded text-red-500 hover:bg-red-500/10"><FiTrash2 /></button>
                </div>
                
                <div className="mb-4">
                  <span className="text-xs font-mono font-bold text-[var(--color-brand-secondary)] uppercase tracking-wider">{block.type.replace('_', ' ')}</span>
                </div>
                
                <input
                  type="text"
                  className="w-full bg-transparent text-xl font-bold mb-4 focus:outline-none"
                  value={block.question}
                  onChange={(e) => updateBlock(block.id, "question", e.target.value)}
                  placeholder="Type your question here"
                />

                {block.type === "short_text" && (
                  <div className="w-full p-3 border border-[var(--color-border-subtle)] rounded bg-[var(--color-bg-surface)]/50 text-[var(--color-text-secondary)] text-sm">
                    Short answer text
                  </div>
                )}

                {block.type === "long_text" && (
                  <div className="w-full p-3 h-24 border border-[var(--color-border-subtle)] rounded bg-[var(--color-bg-surface)]/50 text-[var(--color-text-secondary)] text-sm">
                    Long answer text
                  </div>
                )}

                {block.type === "multiple_choice" && (
                  <div className="flex flex-col gap-2">
                    {block.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border border-[var(--color-border-subtle)]" />
                        <input 
                          type="text"
                          className="bg-transparent border-b border-transparent focus:border-[var(--color-border-subtle)] focus:outline-none flex-1"
                          value={opt}
                          onChange={(e) => updateOption(block.id, oIndex, e.target.value)}
                        />
                      </div>
                    ))}
                    <button 
                      onClick={() => addOption(block.id)}
                      className="text-sm text-[var(--color-brand-secondary)] flex items-center gap-2 mt-2 w-fit hover:underline"
                    >
                      <FiPlus size={14}/> Add Option
                    </button>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-2 border-t border-[var(--color-border-subtle)] pt-4">
                  <label className="text-sm font-mono flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={block.required} 
                      onChange={(e) => updateBlock(block.id, "required", e.target.checked)}
                      className="accent-[var(--color-brand-secondary)]"
                    />
                    Required
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center py-12 border-2 border-dashed border-[var(--color-border-subtle)] rounded-lg">
            <span className="text-[var(--color-text-secondary)] font-mono text-sm">Select a block type from the right to add to your form</span>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-8 flex flex-col gap-4">
            <h3 className="font-display font-bold uppercase tracking-wider mb-2">Form Settings</h3>
            <label className="flex items-center gap-3 text-sm font-mono cursor-pointer mb-6">
              <input 
                type="checkbox" 
                checked={form?.is_published || false}
                onChange={(e) => setForm({...form, is_published: e.target.checked})}
                className="w-5 h-5 accent-[var(--color-brand-secondary)]"
              />
              <span className={form?.is_published ? "text-green-400" : "text-[var(--color-text-secondary)]"}>
                {form?.is_published ? "Accepting Responses" : "Draft (Not Live)"}
              </span>
            </label>

            <h3 className="font-display font-bold uppercase tracking-wider mb-2 pt-4 border-t border-[var(--color-border-subtle)]">Add Block</h3>
            <button onClick={() => addBlock("short_text")} className="text-left w-full p-3 bg-[var(--color-bg-surface)] hover:bg-[var(--color-brand-secondary)]/10 hover:text-[var(--color-brand-secondary)] rounded transition-colors border border-[var(--color-border-subtle)] font-mono text-sm">
              + Short Text
            </button>
            <button onClick={() => addBlock("long_text")} className="text-left w-full p-3 bg-[var(--color-bg-surface)] hover:bg-[var(--color-brand-secondary)]/10 hover:text-[var(--color-brand-secondary)] rounded transition-colors border border-[var(--color-border-subtle)] font-mono text-sm">
              + Long Text
            </button>
            <button onClick={() => addBlock("multiple_choice")} className="text-left w-full p-3 bg-[var(--color-bg-surface)] hover:bg-[var(--color-brand-secondary)]/10 hover:text-[var(--color-brand-secondary)] rounded transition-colors border border-[var(--color-border-subtle)] font-mono text-sm">
              + Multiple Choice
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
