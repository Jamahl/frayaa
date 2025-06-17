'use client'

import React, { useEffect, useState } from "react";
import PreferencesForm, { PreferencesFormValues } from "../../../components/PreferencesForm";
import Link from 'next/link';
import "./preferences.css";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

const PreferencesPage = () => {
  const { user, loading: userLoading } = useContext(AuthContext) ?? {} as any;
  const [initialValues, setInitialValues] = useState<PreferencesFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user || userLoading) return;
    const fetchPreferences = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:8001/api/user/preferences/${user.id}/`);
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
  }, [user, userLoading]);

  const handleSave = async (values: PreferencesFormValues) => {
    setError("");
    setSuccess("");
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:8001/api/user/preferences/${user.id}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to update preferences");
      setSuccess("Preferences updated successfully!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };


  return (
    <div className="preferences-root">
      <div className="preferences-card">
        <div className="preferences-header">
          <h1 className="preferences-title">User Preferences</h1>
          <Link href="/dashboard" aria-label="Back to Dashboard" style={{ color: '#7c3aed', textDecoration: 'underline', fontSize: '0.95rem', fontWeight: 500 }}>← Back to Dashboard</Link>
        </div>
        <div className="preferences-desc">
          Set your meeting and assistant preferences below. These will be used by Fraya to schedule meetings and draft replies.
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="status-message error">{error}</div>}
        {success && <div className="status-message success">{success}</div>}
        {initialValues && (
          <div className="preferences-form">
            <PreferencesForm initialValues={initialValues} onSave={handleSave} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferencesPage;
