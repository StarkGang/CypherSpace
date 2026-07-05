"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Paper from "../../../components/design-system/Paper";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { TableSkeleton, FormSkeleton, PageSkeleton } from "../../../components/ui/Skeleton";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiPlus, FiExternalLink } from "react-icons/fi";
import { api } from "../../../lib/api";

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/blogs?per_page=100&published=all");
      setPosts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/blogs/${id}`);
        fetchPosts();
      } catch (err) {
        alert("Failed to delete post");
      }
    }
  };

  if (loading) return <AdminLayout><TableSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-4xl uppercase mb-1">Blog</h1>
          <p className="font-mono text-[var(--color-text-secondary)] text-sm font-bold uppercase tracking-widest">
            Manage Notebook Entries
          </p>
        </div>
        <Button href="/admin/blog/new" variant="primary" icon={<FiPlus />}>
          New Post
        </Button>
      </div>

      <Paper variant="default" className="p-0 overflow-hidden" rotate={0} shadowSize="sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] uppercase tracking-wider border-b border-[var(--color-border-subtle)] text-xs font-semibold">
              <tr>
                <th className="p-4 border-none">Post Title</th>
                <th className="p-4 border-none">Status</th>
                <th className="p-4 border-none hidden md:table-cell">Author</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[var(--color-bg-surface)] transition-colors">
                    <td className="p-4 border-none">
                      <div className="font-display font-bold uppercase text-base">{post.title}</div>
                      <div className="text-[var(--color-text-secondary)] truncate max-w-[200px]">{post.slug}</div>
                    </td>
                    <td className="p-4 border-none">
                      <Badge variant={post.published ? 'success' : 'warning'}>
                        {post.published ? 'published' : 'draft'}
                      </Badge>
                    </td>
                    <td className="p-4 border-none hidden md:table-cell">
                      {post.author_name || '-'}
                    </td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      {post.published && (
                        <Link 
                          href={`/blog/${post.slug}`} 
                          target="_blank"
                          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors"
                          title="View Live"
                        >
                          <FiExternalLink size={18} />
                        </Link>
                      )}
                      <Link 
                        href={`/admin/blog/${post.id}`} 
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[var(--color-text-secondary)] font-bold uppercase">
                    No posts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Paper>
    </AdminLayout>
  );
}
