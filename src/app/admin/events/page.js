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

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/events?per_page=100");
      setEvents(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert("Failed to delete event");
      }
    }
  };

  if (loading) return <AdminLayout><TableSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-4xl uppercase mb-1">Events</h1>
          <p className="font-mono text-[var(--color-text-secondary)] text-sm font-bold uppercase tracking-widest">
            Manage Community Events
          </p>
        </div>
        <Button href="/admin/events/new" variant="primary" icon={<FiPlus />}>
          New Event
        </Button>
      </div>

      <Paper variant="default" className="p-0 overflow-hidden" rotate={0} shadowSize="sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] uppercase tracking-wider border-b border-[var(--color-border-subtle)] text-xs font-semibold">
              <tr>
                <th className="p-4 border-none">Event Title</th>
                <th className="p-4 border-none">Status</th>
                <th className="p-4 border-none hidden md:table-cell">Date</th>
                <th className="p-4 border-none hidden lg:table-cell">Venue</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-[var(--color-bg-surface)] transition-colors">
                    <td className="p-4 border-none">
                      <div className="font-display font-bold uppercase text-base">{event.title}</div>
                      <div className="text-[var(--color-text-secondary)] truncate max-w-[200px]">{event.slug}</div>
                    </td>
                    <td className="p-4 border-none">
                      <Badge variant={
                        event.status === 'upcoming' ? 'info' : 
                        event.status === 'ongoing' ? 'success' : 'neutral'
                      }>
                        {event.status}
                      </Badge>
                    </td>
                    <td className="p-4 border-none hidden md:table-cell">
                      {event.date || '-'}
                    </td>
                    <td className="p-4 border-none hidden lg:table-cell">
                      <span className="truncate max-w-[150px] inline-block">{event.venue || '-'}</span>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      <Link 
                        href={`/events/${event.slug}`} 
                        target="_blank"
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-sticker-blue)] transition-colors"
                        title="View Live"
                      >
                        <FiExternalLink size={18} />
                      </Link>
                      <Link 
                        href={`/admin/events/${event.id}`} 
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-sticker-lime)] transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(event.id)}
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
                  <td colSpan={5} className="p-8 text-center text-[var(--color-text-secondary)] font-bold uppercase">
                    No events found
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
