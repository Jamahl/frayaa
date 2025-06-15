// User Preferences Dashboard Page for Next.js App Router
// Location: apps/web/app/dashboard/preferences/page.tsx

import React, { useEffect, useState } from "react";
import PreferencesForm, { PreferencesFormValues } from "@/components/PreferencesForm";

const USER_ID = "demo-user-id"; // TODO: Replace with real user id from auth/session

const PreferencesPage = () => {
  const [initialValues, setInitialValues] = useState<PreferencesFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/user/preferences/${USER_ID}/`);
        if (!res.ok) throw new Error("Failed to fetch preferences");
        const data = await res.json();
        setInitialValues({
          preferred_days: data.preferred_days || [],
          preferred_times: data.preferred_times || "",
          buffer_minutes: data.buffer_minutes || 0,
          custom_ea_prompt: data.custom_ea_prompt || "",
        });
      } catch (err: any) {
        setError(err.message || "Unknown error");
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
      const res = await fetch(`/api/user/preferences/${USER_ID}/`, {
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
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">User Preferences</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}
      {initialValues && (
        <PreferencesForm initialValues={initialValues} onSave={handleSave} />
      )}
    </div>
  );
};

export default PreferencesPage;
