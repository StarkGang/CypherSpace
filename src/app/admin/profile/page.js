"use client";

import React, { useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { FiSave, FiCheck } from "react-icons/fi";
import { api } from "../../../lib/api";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (!formData.current_password) {
      setError("Current password is required.");
      setSaving(false);
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError("New passwords do not match.");
      setSaving(false);
      return;
    }

    if (formData.new_password.length < 8) {
      setError("New password must be at least 8 characters.");
      setSaving(false);
      return;
    }

    try {
      await api.put("/auth/me", {
        current_password: formData.current_password,
        password: formData.new_password,
      });
      setSuccess("Password updated successfully.");
      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout requiredRole="editor">
      <div className="mb-8">
        <h1 className="font-semibold text-3xl mb-1">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Update your account settings and change your password.
        </p>
      </div>

      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-6 md:p-8 shadow-sm max-w-2xl">
        <h2 className="font-semibold text-xl mb-6 border-b border-slate-200 dark:border-[#30363d] pb-3">
          Change Password
        </h2>

        {error && (
          <div className="mb-6 bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-100 border-2 border-green-500 text-green-800 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Current Password"
            name="current_password"
            type="password"
            value={formData.current_password}
            onChange={handleChange}
            required
          />

          <Input
            label="New Password"
            name="new_password"
            type="password"
            value={formData.new_password}
            onChange={handleChange}
            helperText="Must be at least 8 characters."
            required
          />

          <Input
            label="Confirm New Password"
            name="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              variant="primary"
              icon={success ? <FiCheck /> : <FiSave />}
              disabled={saving}
              className={success ? "!bg-green-500 !text-white transition-colors duration-300" : "transition-colors duration-300"}
            >
              {saving ? "Updating..." : success ? "Updated!" : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
