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

export default function AdminEventForm() {
  const params = useParams();
  const router = useRouter();
  const isNew = params?.id === "new";
  const eventId = params?.id;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    end_date: "",
    time: "",
    end_time: "",
    venue: "",
    status: "upcoming",
    registration_link: "",
    banner: "",
    gallery: [""],
    tags: "",
    featured: false,
    blast_from_past: false
  });

  useEffect(() => {
    if (isNew) return;

    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${eventId}`);
        const data = res.data.data;
        setFormData({
          ...data,
          tags: data.tags ? data.tags.join(", ") : "",
          gallery: data.gallery?.length ? data.gallery : [""]
        });
      } catch (err) {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [isNew, eventId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
      gallery: formData.gallery.filter(item => item.trim() !== ""),
    };

    try {
      if (isNew) {
        await api.post("/events", cleanedData);
      } else {
        await api.put(`/events/${eventId}`, cleanedData);
      }
      router.push("/admin/events");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event");
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><FormSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button href="/admin/events" variant="ghost" className="mb-2 -ml-4" icon={<FiArrowLeft />}>
            Back to Events
          </Button>
          <h1 className="font-display font-black text-4xl uppercase mb-1">
            {isNew ? "New Event" : "Edit Event"}
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
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-ink-black)] pb-2">Event Info</h2>

              <Input
                label="Event Title"
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
                  type="date"
                  label="Start Date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
                <Input
                  type="time"
                  label="Start Time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="End Date"
                  name="end_date"
                  value={formData.end_date || ""}
                  onChange={handleChange}
                />
                <Input
                  type="time"
                  label="End Time"
                  name="end_time"
                  value={formData.end_time || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Main Auditorium, NSSCE"
                />
                <Input
                  label="Registration Link URL"
                  name="registration_link"
                  value={formData.registration_link}
                  onChange={handleChange}
                  placeholder="https://forms.gle/..."
                />
              </div>

              <Input
                label="Tags (comma separated)"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="tech, workshop, annual"
              />
            </Paper>

            <Paper variant="default" className="p-6 md:p-8" rotate={0} shadowSize="sm">
              <h2 className="font-display font-black text-2xl uppercase mb-6 border-b-2 border-[var(--color-ink-black)] pb-2">Media URLs</h2>

              <Input
                label="Banner Image URL"
                name="banner"
                value={formData.banner}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
              />

              {formData.banner && (
                <div className="mt-2 mb-6 border-brutal overflow-hidden w-full max-w-sm aspect-[4/3] bg-[var(--color-paper-cream)]">
                  <img src={formData.banner} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
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
                  Event Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--color-paper-white)] text-[var(--color-ink-black)] border-brutal font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[var(--color-sticker-pink)]/30 shadow-[var(--shadow-sticker)]"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="past">Past</option>
                </select>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 border-2 border-[var(--color-ink-black)] accent-[var(--color-sticker-pink)]"
                  />
                  <label htmlFor="featured" className="font-display font-bold uppercase tracking-wider text-sm cursor-pointer">
                    Featured Event
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="blast_from_past"
                    name="blast_from_past"
                    checked={formData.blast_from_past}
                    onChange={handleChange}
                    className="w-5 h-5 border-2 border-[var(--color-ink-black)] accent-[var(--color-sticker-lime)]"
                  />
                  <label htmlFor="blast_from_past" className="font-display font-bold uppercase tracking-wider text-sm cursor-pointer">
                    Past Events
                  </label>
                </div>
              </div>
            </Paper>
          </div>

        </div>

        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-[var(--color-paper-white)] border-t-4 border-[var(--color-ink-black)] z-30 flex justify-end gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.15)]">
          <Button href="/admin/events" variant="outline" type="button">Cancel</Button>
          <Button type="submit" variant="primary" icon={<FiSave />} disabled={saving}>
            {saving ? "Saving..." : "Save Event"}
          </Button>
        </div>
      </form>

    </AdminLayout>
  );
}
