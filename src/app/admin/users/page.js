"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { api } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor"
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (id === currentUser.id) {
      alert("You cannot delete yourself.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      try {
        await api.delete(`/auth/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleRoleChange = async (id, currentRole, newRole) => {
    if (id === currentUser.id && newRole !== currentRole) {
      alert("You cannot change your own role.");
      return;
    }
    try {
      await api.put(`/auth/users/${id}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
      fetchUsers();
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);
    try {
      await api.post("/auth/register", formData);
      setFormData({ name: "", email: "", password: "", role: "editor" });
      setShowAddModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <AdminLayout requiredRole="root"><TableSkeleton /></AdminLayout>;

  return (
    <AdminLayout requiredRole="root">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Users</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Manage admins, editors, and roles
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="primary" icon={<FiPlus />}>
          Add User
        </Button>
      </div>

      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-[#0d1117] text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-[#30363d] text-xs font-semibold">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#30363d]">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-[#21262d] transition-colors">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                    <td className="p-4">
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, user.role, e.target.value)}
                        disabled={user.id === currentUser.id}
                        className="bg-transparent border border-slate-300 dark:border-[#30363d] rounded px-2 py-1 text-sm disabled:opacity-50"
                      >
                        <option value="root">Root</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                      </select>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      <button 
                        onClick={() => handleDelete(user.id)}
                        disabled={user.id === currentUser.id}
                        className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-[#30363d]">
              <h2 className="font-display font-bold text-xl">Add New User</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 flex flex-col gap-4">
              {error && (
                <div className="p-3 rounded bg-red-100 text-red-700 text-sm border border-red-200 font-medium">
                  {error}
                </div>
              )}
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                helperText="Must be at least 8 characters"
              />
              <div className="flex flex-col w-full mb-4">
                <label className="mb-2 font-display font-semibold uppercase tracking-wider text-xs text-[var(--color-text-secondary)]">
                  Role
                </label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 bg-[var(--color-bg-deep)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] rounded-lg font-mono focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)]"
                >
                  <option value="editor">Editor (Can only edit content)</option>
                  <option value="admin">Admin (Can manage team & settings)</option>
                  <option value="root">Root (Full access, manage users)</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={formLoading}>
                  {formLoading ? "Adding..." : "Add User"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
