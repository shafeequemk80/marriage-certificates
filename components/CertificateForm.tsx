"use client";

import React, { useState } from "react";
import { CertificateConfig } from "../lib/certificates/types";

interface CertificateFormProps {
  config: CertificateConfig;
  initialData?: Record<string, string>;
  onSubmit: (data: Record<string, string>) => void;
  isLoading?: boolean;
}

export function CertificateForm({
  config,
  initialData,
  onSubmit,
  isLoading = false,
}: CertificateFormProps) {
  // Start initially empty unless initialData is explicitly provided
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    config.fields.forEach((f) => {
      initial[f.id] = initialData?.[f.id] ?? "";
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Only load sample data when user clicks this button
  const handlePrefillSample = () => {
    setFormData(config.sampleData);
    setErrors({});
  };

  const handleClear = () => {
    const empty: Record<string, string> = {};
    config.fields.forEach((f) => {
      empty[f.id] = "";
    });
    setFormData(empty);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    config.fields.forEach((field) => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ACTION TOOLBAR: PREFILL SAMPLE & CLEAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Certificate Form Details
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrefillSample}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            ⚡ Load Sample Data
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* FORM FIELDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {config.fields.map((field) => {
          const isFullWidth = field.gridSpan === 2 || field.type === "textarea";
          const hasError = Boolean(errors[field.id]);

          return (
            <div
              key={field.id}
              className={isFullWidth ? "md:col-span-2 space-y-1.5" : "space-y-1.5"}
            >
              <div className="flex justify-between items-center">
                <label
                  htmlFor={field.id}
                  className="block text-sm font-semibold text-slate-800"
                >
                  {field.label}{" "}
                  {field.required && <span className="text-rose-500">*</span>}
                </label>
                {field.helpText && (
                  <span className="text-xs text-slate-400">
                    {field.helpText}
                  </span>
                )}
              </div>

              {field.type === "textarea" ? (
                <textarea
                  id={field.id}
                  name={field.id}
                  rows={3}
                  value={formData[field.id] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
                    hasError
                      ? "border-rose-400 bg-rose-50/20 focus:ring-rose-400"
                      : "border-slate-200 focus:border-slate-900 focus:ring-slate-900/10"
                  }`}
                />
              ) : field.type === "select" ? (
                <select
                  id={field.id}
                  name={field.id}
                  value={formData[field.id] || ""}
                  onChange={handleChange}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-white transition focus:outline-none focus:ring-2 ${
                    hasError
                      ? "border-rose-400 bg-rose-50/20 focus:ring-rose-400"
                      : "border-slate-200 focus:border-slate-900 focus:ring-slate-900/10"
                  }`}
                >
                  <option value="">-- Select {field.label} --</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.id}
                  type={field.type}
                  name={field.id}
                  value={formData[field.id] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
                    hasError
                      ? "border-rose-400 bg-rose-50/20 focus:ring-rose-400"
                      : "border-slate-200 focus:border-slate-900 focus:ring-slate-900/10"
                  }`}
                />
              )}

              {hasError && (
                <p className="text-xs text-rose-600 font-medium">
                  {errors[field.id]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* SUBMIT BUTTON */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-4 rounded-xl text-base shadow-xl shadow-slate-950/15 hover:shadow-slate-950/25 active:translate-y-0.5 transition duration-150 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Generating Preview..." : "Preview Certificate →"}
        </button>
      </div>
    </form>
  );
}
