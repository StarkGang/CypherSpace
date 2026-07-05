"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { FormSkeleton } from "../../../components/ui/Skeleton";
import { FiSave, FiPlus, FiX } from "react-icons/fi";
import { api } from "../../../lib/api";

export default function AdminSponsors() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [sponsors, setSponsors] = useState([]);
  const [fullSettings, setFullSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        const data = res.data.data;
        setFullSettings(data);
        setSponsors(data.sponsors || []);
      } catch (err) {
        setError("Failed to load sponsors");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleAddSponsor = () => {
    setSponsors((prev) => [
      ...prev,
      { name: "", tier: "bronze", url: "", image: "" }
    ]);
  };

  const handleUpdateSponsor = (index, field, value) => {
    setSponsors((prev) => {
      const newSponsors = [...prev];
      newSponsors[index] = { ...newSponsors[index], [field]: value };
      return newSponsors;
    });
  };

  const handleRemoveSponsor = (index) => {
    setSponsors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedSettings = {
        ...fullSettings,
        sponsors: sponsors,
      };
      await api.put("/settings", updatedSettings);
      setSuccess("Sponsors updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save sponsors");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <AdminLayout requiredRole="admin">
        <FormSkeleton />
      </AdminLayout>
    );

  return (
    <AdminLayout requiredRole="admin">
      <div className="mb-8">
        <h1 className="font-semibold text-3xl mb-1">
          Sponsors Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Add, edit, and organize strategic partners and sponsors.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 pb-32 max-w-4xl"
      >
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-2 border-green-500 text-green-800 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider">
            {success}
          </div>
        )}

        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-[#30363d] pb-3">
            <div>
              <h2 className="font-semibold text-xl">Partners & Sponsors</h2>
            </div>
            <Button onClick={handleAddSponsor} type="button" size="sm" icon={<FiPlus />}>Add Sponsor</Button>
          </div>
          
          <div className="flex flex-col gap-6">
            {sponsors.map((sponsor, index) => (
              <div key={index} className="relative p-4 border border-slate-200 dark:border-[#30363d] rounded-lg bg-slate-50 dark:bg-[#0d1117] flex flex-col gap-4">
                <button 
                  type="button" 
                  onClick={() => handleRemoveSponsor(index)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <FiX size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Sponsor Name" 
                    value={sponsor.name} 
                    onChange={(e) => handleUpdateSponsor(index, "name", e.target.value)} 
                    placeholder="e.g. Polygon"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tier</label>
                    <select 
                      className="w-full bg-white dark:bg-[#0d1117] border border-slate-300 dark:border-[#30363d] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={sponsor.tier}
                      onChange={(e) => handleUpdateSponsor(index, "tier", e.target.value)}
                    >
                      <option value="gold">Gold</option>
                      <option value="silver">Silver</option>
                      <option value="bronze">Bronze</option>
                    </select>
                  </div>
                  <Input 
                    label="Website URL" 
                    value={sponsor.url} 
                    onChange={(e) => handleUpdateSponsor(index, "url", e.target.value)} 
                    placeholder="https://..."
                  />
                  <Input 
                    label="Logo URL" 
                    value={sponsor.image || ""} 
                    onChange={(e) => handleUpdateSponsor(index, "image", e.target.value)} 
                    placeholder="Image URL for the sponsor logo"
                  />
                </div>
              </div>
            ))}
            {sponsors.length === 0 && (
              <p className="text-center text-slate-500 text-sm py-4">No sponsors added yet.</p>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white dark:bg-[#161b22] border-t border-slate-200 dark:border-[#30363d] z-30 flex justify-end gap-4 shadow-lg">
          <Button
            type="submit"
            variant="primary"
            icon={<FiSave />}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Sponsors"}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
