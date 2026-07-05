"use client";

import React, { useEffect, useState } from "react";
import PageWrapper from "../../../components/layout/PageWrapper";
import Button from "../../../components/ui/Button";
import { PageSkeleton } from "../../../components/ui/Skeleton";
import { api } from "../../../lib/api";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function PublicForm() {
  const params = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForm();
  }, [params.id]);

  const fetchForm = async () => {
    try {
      const res = await api.get(`/forms/${params.id}`);
      setForm(res.data.data);
    } catch (err) {
      setError("Form not found or is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.is_published) {
      alert("This form is not accepting responses.");
      return;
    }
    const missing = form.schema_json.filter(b => b.required && !answers[b.id]);
    if (missing.length > 0) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/forms/${params.id}/responses`, { answers_json: answers });
      setSubmitted(true);
    } catch (err) {
      alert("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateAnswer = (blockId, value) => {
    setAnswers({ ...answers, [blockId]: value });
  };

  if (loading) return <PageWrapper><PageSkeleton /></PageWrapper>;

  if (error || !form) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="glass-card p-12 text-center max-w-md w-full">
            <h1 className="font-display font-black text-2xl text-red-500 mb-4 uppercase">Error</h1>
            <p className="text-[var(--color-text-secondary)] font-mono">{error}</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (submitted) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-12 text-center max-w-lg w-full border border-[var(--color-brand-secondary)]/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-secondary)]/10 to-transparent -z-10" />
            <h1 className="font-display font-black text-4xl mb-4 uppercase drop-shadow-md">Thank You!</h1>
            <p className="text-[var(--color-text-secondary)] font-mono mb-8">Your response has been recorded successfully.</p>
            <Button href="/" variant="primary">Return Home</Button>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="py-20 px-4 flex justify-center">
        <div className="max-w-2xl w-full">
          {!form.is_published && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-4 rounded-lg font-mono text-sm mb-8 text-center">
              ⚠️ This form is currently in Draft mode. Responses cannot be submitted.
            </div>
          )}

          <div className="mb-12">
            <h1 className="font-display font-black text-4xl sm:text-5xl uppercase mb-4 drop-shadow-md">
              {form.title}
            </h1>
            {form.description && (
              <p className="font-mono text-[var(--color-text-secondary)] text-lg whitespace-pre-wrap">
                {form.description}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {form.schema_json?.map((block, index) => (
              <div key={block.id} className="glass-card p-6 sm:p-8 border border-[var(--color-border-subtle)] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-brand-secondary)] to-transparent opacity-50" />
                <h3 className="font-display font-bold text-xl mb-6">
                  {index + 1}. {block.question}
                  {block.required && <span className="text-red-500 ml-2">*</span>}
                </h3>

                {block.type === "short_text" && (
                  <input
                    type="text"
                    required={block.required}
                    value={answers[block.id] || ""}
                    onChange={(e) => updateAnswer(block.id, e.target.value)}
                    className="w-full bg-[var(--color-bg-surface)] border-b-2 border-[var(--color-border-subtle)] focus:border-[var(--color-brand-secondary)] text-[var(--color-text-primary)] p-3 focus:outline-none transition-colors font-mono"
                    placeholder="Your answer"
                  />
                )}

                {block.type === "long_text" && (
                  <textarea
                    required={block.required}
                    value={answers[block.id] || ""}
                    onChange={(e) => updateAnswer(block.id, e.target.value)}
                    className="w-full bg-[var(--color-bg-surface)] border-2 border-[var(--color-border-subtle)] focus:border-[var(--color-brand-secondary)] rounded text-[var(--color-text-primary)] p-3 focus:outline-none transition-colors min-h-[120px] font-mono resize-y"
                    placeholder="Your answer"
                  />
                )}

                {block.type === "multiple_choice" && (
                  <div className="flex flex-col gap-3">
                    {block.options.map((opt, oIndex) => (
                      <label key={oIndex} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name={block.id}
                          required={block.required}
                          value={opt}
                          checked={answers[block.id] === opt}
                          onChange={(e) => updateAnswer(block.id, e.target.value)}
                          className="w-5 h-5 accent-[var(--color-brand-secondary)]"
                        />
                        <span className="font-mono text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-8">
              <Button type="submit" variant="primary" disabled={submitting || !form.is_published} className="w-full sm:w-auto px-12 py-4 text-lg">
                {submitting ? "Submitting..." : "Submit Form"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
