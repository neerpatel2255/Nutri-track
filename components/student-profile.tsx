'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, ChangeEvent } from 'react';
import { Target } from 'lucide-react';

export function StudentProfile({ user, onUpdate }: { user: any, onUpdate: (user: any) => void }) {
  const [profileState, setProfileState] = useState({
    height: user.height?.toString() || '',
    weight: user.weight?.toString() || '',
    age: user.age?.toString() || '',
    gender: user.gender || 'OTHER',
    activityLevel: user.activityLevel || 'MODERATE',
    currentGoal: user.currentGoal || 'NEUTRAL',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profileState, registrationNumber: user.registrationNumber })
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Profile updated successfully!');
        onUpdate(data.student);
      } else {
        setMessage(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setMessage('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-slate-200/50 bg-white/50 p-5 shadow-sm backdrop-blur dark:border-gray-700/50 dark:bg-gray-800/50">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">Nutritional Profile</p>
          <h3 className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">Update Biometrics</h3>
        </div>
        <div className="rounded-full bg-cyan-100/50 p-2 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-400">
          <Target className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          required
          value={profileState.height}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setProfileState(curr => ({ ...curr, height: event.target.value }))}
          placeholder="Height (cm)"
          className="col-span-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <input
          type="number"
          required
          value={profileState.weight}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setProfileState(curr => ({ ...curr, weight: event.target.value }))}
          placeholder="Weight (kg)"
          className="col-span-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <input
          type="number"
          required
          value={profileState.age}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setProfileState(curr => ({ ...curr, age: event.target.value }))}
          placeholder="Age"
          className="col-span-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <select
          value={profileState.gender}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => setProfileState(curr => ({ ...curr, gender: event.target.value }))}
          className="col-span-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <select
          value={profileState.activityLevel}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => setProfileState(curr => ({ ...curr, activityLevel: event.target.value }))}
          className="col-span-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="SEDENTARY">Sedentary (Little to no exercise)</option>
          <option value="MODERATE">Moderate (Light exercise 1-3 days/week)</option>
          <option value="ACTIVE">Active (Moderate exercise 3-5 days/week)</option>
          <option value="VERY_ACTIVE">Very Active (Heavy exercise 6-7 days/week)</option>
        </select>
        <select
          value={profileState.currentGoal}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => setProfileState(curr => ({ ...curr, currentGoal: event.target.value }))}
          className="col-span-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="WEIGHT_LOSS">Weight Loss</option>
          <option value="NEUTRAL">Maintain Weight</option>
          <option value="WEIGHT_GAIN">Weight Gain</option>
        </select>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Updating...' : 'Save Profile'}
      </button>
      {message && <div className={`mt-3 rounded-lg p-3 text-sm ${message.includes('successfully') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' : 'bg-red-50 text-red-600 dark:bg-red-900/30'}`}>
        {message}
      </div>}
    </form>
  )
}
