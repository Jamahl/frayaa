'use client'

import React, { useState } from "react";


type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export type PreferencesFormValues = {
  preferred_days: Day[];
  preferred_times: string;
  buffer_minutes: number;
  custom_ea_prompt: string;
};

type Props = {
  initialValues: PreferencesFormValues;
  onSave: (values: PreferencesFormValues) => void;
};

const DAYS: Day[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const PreferencesForm: React.FC<Props> = ({ initialValues, onSave }) => {
  const [form, setForm] = useState<PreferencesFormValues>(initialValues);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleDayToggle = (day: Day) => {
    setForm(f => ({
      ...f,
      preferred_days: f.preferred_days.includes(day)
        ? f.preferred_days.filter(d => d !== day)
        : [...f.preferred_days, day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    onSave(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="User Preferences Form">
      <fieldset>
        <legend className="font-semibold mb-2">Preferred Days</legend>
        <div className="flex flex-wrap gap-2">
          {DAYS.map(day => (
            <label key={day} className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                name="preferred_days"
                checked={form.preferred_days.includes(day)}
                onChange={() => handleDayToggle(day)}
                className="accent-blue-600"
                aria-label={day}
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="preferred_times" className="block font-semibold mb-1">
          Preferred Times
        </label>
        <input
          type="text"
          id="preferred_times"
          name="preferred_times"
          value={form.preferred_times}
          onChange={handleChange}
          placeholder="09:00-17:00"
          className="w-full border rounded px-3 py-2"
          aria-label="Preferred Times"
        />
      </div>
      <div>
        <label htmlFor="buffer_minutes" className="block font-semibold mb-1">
          Buffer Minutes
        </label>
        <input
          type="number"
          id="buffer_minutes"
          name="buffer_minutes"
          value={form.buffer_minutes}
          onChange={handleChange}
          min={0}
          className="w-24 border rounded px-3 py-2"
          aria-label="Buffer Minutes"
        />
      </div>
      <div>
        <label htmlFor="custom_ea_prompt" className="block font-semibold mb-1">
          Custom Executive Assistant Prompt
        </label>
        <textarea
          id="custom_ea_prompt"
          name="custom_ea_prompt"
          value={form.custom_ea_prompt}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded px-3 py-2"
          aria-label="Custom Executive Assistant Prompt"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={saving}
        aria-label="Save Preferences"
      >
        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </form>
  );
};

export default PreferencesForm;
