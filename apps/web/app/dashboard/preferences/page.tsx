'use client'

import React, { useEffect, useState } from "react";
import PreferencesForm, { PreferencesFormValues } from "../../../components/PreferencesForm";
import Link from 'next/link';

const USER_ID = "6a9bda06-7325-4421-9b7f-532defcc2928"; // Real user id from Supabase

const PreferencesPage = () => {
  const [initialValues, setInitialValues] = useState<PreferencesFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!USER_ID) return;
      setLoading(true);
      setError("");
      try {
        // Call Django backend directly to avoid Next.js proxy redirect issues
        const res = await fetch(`http://localhost:8001/api/user/preferences/${USER_ID}/`);
        if (!res.ok) throw new Error("Failed to fetch preferences");
        const data = await res.json();
        setInitialValues({
          preferred_days: data.preferred_days || [],
          preferred_times: data.preferred_times || "",
          buffer_minutes: data.buffer_minutes || 15,
          custom_ea_prompt: data.custom_ea_prompt || "",
        });
      } catch (err) {
        setError("Failed to load preferences");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const handleSave = async (values: PreferencesFormValues) => {
    setError("");
    setSuccess("");
    try {
      // Call Django backend directly to avoid Next.js proxy redirect issues
      const res = await fetch(`http://localhost:8001/api/user/preferences/${USER_ID}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to update preferences");
      setSuccess("Preferences updated successfully!");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-900">User Preferences</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline text-sm" aria-label="Back to Dashboard">
            ← Back to Dashboard
          </Link>
        </div>
        <p className="text-gray-500 mb-6">Set your meeting and assistant preferences below. These will be used by Fraya to schedule meetings and draft replies.</p>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}
        {initialValues && (
          <PreferencesForm initialValues={initialValues} onSave={handleSave} />
        )}
      </div>
    </div>
  );
};

export default PreferencesPage;
