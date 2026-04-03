'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Send, Star } from 'lucide-react';

const menuModes = ['REGULAR', 'FEAST'] as const;
const messHalls = ['GRACE', 'PROODLE', 'RASSENCE', 'FUSION'] as const;
const messTypes = ['VEG', 'NON_VEG', 'SPECIAL_MESS'] as const;

type MenuMode = (typeof menuModes)[number];
type MessHall = (typeof messHalls)[number];
type MessType = (typeof messTypes)[number];

type MenuItemOption = {
  id: number;
  title: string;
  mealSlot: string;
};

type PanelProps = {
  menuItems: MenuItemOption[];
  isSetupOnly?: boolean;
  isDashboardOnly?: boolean;
  isPreferenceOpen?: boolean;
};

const ratingOptions = [5, 4, 3, 2, 1];

async function submitJson(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? 'Request failed.');
  }

  return payload;
}

export function InteractivePanels({ menuItems, isSetupOnly, isDashboardOnly, isPreferenceOpen }: PanelProps) {
  const router = useRouter();
  const [setupState, setSetupState] = useState<{ registrationNumber: string; password: string; messHall: MessHall; messType: MessType }>({
    registrationNumber: '',
    password: '',
    messHall: 'GRACE',
    messType: 'VEG'
  });
  const [preferenceState, setPreferenceState] = useState<{ studentName: string; menuMode: MenuMode; favorites: string; notes: string }>({
    studentName: '',
    menuMode: 'REGULAR',
    favorites: '',
    notes: ''
  });
  const [ratingState, setRatingState] = useState<{ studentName: string; menuItemId: number; stars: number; feedback: string }>({
    studentName: '',
    menuItemId: menuItems[0]?.id ?? 0,
    stars: 5,
    feedback: ''
  });
  const [preferenceMessage, setPreferenceMessage] = useState('');
  const [ratingMessage, setRatingMessage] = useState('');
  const [setupMessage, setSetupMessage] = useState('');
  const [loadingSetup, setLoadingSetup] = useState(false);
  const [loadingPreference, setLoadingPreference] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);

  async function handleSetupSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingSetup(true);
    setSetupMessage('');

    try {
      await submitJson('/api/student-setup', setupState);
      setSetupMessage('Account created. You can now submit preferences and ratings.');
      setSetupState({
        registrationNumber: '',
        password: '',
        messHall: 'GRACE',
        messType: 'VEG'
      });
      router.refresh();
    } catch (error) {
      setSetupMessage(error instanceof Error ? error.message : 'Failed to create account.');
    } finally {
      setLoadingSetup(false);
    }
  }

  async function handlePreferenceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingPreference(true);
    setPreferenceMessage('');

    try {
      await submitJson('/api/preferences', preferenceState);
      setPreferenceMessage('Preference saved.');
      setPreferenceState({
        studentName: '',
        menuMode: 'REGULAR',
        favorites: '',
        notes: ''
      });
      router.refresh();
    } catch (error) {
      setPreferenceMessage(error instanceof Error ? error.message : 'Failed to save preference.');
    } finally {
      setLoadingPreference(false);
    }
  }

  async function handleRatingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingRating(true);
    setRatingMessage('');

    try {
      await submitJson('/api/ratings', ratingState);
      setRatingMessage('Feedback submitted.');
      setRatingState((current) => ({
        ...current,
        studentName: '',
        feedback: ''
      }));
      router.refresh();
    } catch (error) {
      setRatingMessage(error instanceof Error ? error.message : 'Failed to submit feedback.');
    } finally {
      setLoadingRating(false);
    }
  }

  return (
    <div className="space-y-6">
      {!isDashboardOnly && (
        <form onSubmit={handleSetupSubmit} className="rounded-[1.75rem] border border-slate-200/50 bg-white/50 p-5 shadow-sm backdrop-blur dark:border-gray-700/50 dark:bg-gray-800/50">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">First time here</p>
              <h3 className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">Create your mess account</h3>
            </div>
            <div className="rounded-full bg-emerald-100/50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">Sign Up</div>
          </div>

          <div className="space-y-3">
            <input
              required
              value={setupState.registrationNumber}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setSetupState((current) => ({ ...current, registrationNumber: event.target.value.toUpperCase() }))}
              placeholder="Registration number"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <input
              required
              type="password"
              value={setupState.password}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setSetupState((current) => ({ ...current, password: event.target.value }))}
              placeholder="Set password (min 6 characters)"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <select
              value={setupState.messHall}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => setSetupState((current) => ({ ...current, messHall: event.target.value as MessHall }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              {messHalls.map((hall) => (
                <option key={hall} value={hall}>
                  {hall.charAt(0) + hall.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <select
              value={setupState.messType}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => setSetupState((current) => ({ ...current, messType: event.target.value as MessType }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              {messTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'NON_VEG' ? 'Non-veg' : type === 'SPECIAL_MESS' ? 'Special mess' : 'Veg'}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loadingSetup}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Send className="h-4 w-4" />
            {loadingSetup ? 'Creating account...' : 'Create account'}
          </button>
          {setupMessage && (
            <div className={`mt-3 rounded-lg p-3 text-sm ${setupMessage.includes('failed') || setupMessage.includes('already') ? 'bg-red-50 text-red-600 dark:bg-red-900/30' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30'}`}>
              {setupMessage}
            </div>
          )}
        </form>
      )}

      {/* Profile Settings (only shown if not setup only) */}
      {!isSetupOnly && (
        <>      {isPreferenceOpen ? (      <form onSubmit={handlePreferenceSubmit} className="rounded-[1.75rem] border border-white/70 bg-white/[0.85] p-5 shadow-[0_18px_60px_rgba(7,17,31,0.08)] backdrop-blur">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-moss">Meal choice</p>
            <h3 className="mt-1 text-xl font-semibold text-ink">Set your menu preference</h3>
          </div>
          <div className="rounded-full bg-moss/10 px-3 py-1 text-xs font-semibold text-moss">Regular / Feast</div>
        </div>

        <div className="space-y-3">
          <input
            value={preferenceState.studentName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setPreferenceState((current) => ({ ...current, studentName: event.target.value }))}
            placeholder="Student name"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-moss"
          />
          <select
            value={preferenceState.menuMode}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => setPreferenceState((current) => ({ ...current, menuMode: event.target.value as MenuMode }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-moss"
          >
            {menuModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode === 'REGULAR' ? 'Regular Menu' : 'Feast Menu'}
              </option>
            ))}
          </select>
          <textarea
            value={preferenceState.favorites}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setPreferenceState((current) => ({ ...current, favorites: event.target.value }))}
            placeholder="Preferred dishes or meal style"
            rows={3}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-moss"
          />
          <textarea
            value={preferenceState.notes}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setPreferenceState((current) => ({ ...current, notes: event.target.value }))}
            placeholder="Dietary notes, spice level, allergies"
            rows={2}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-moss"
          />
        </div>

        <button
          type="submit"
          disabled={loadingPreference}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send className="h-4 w-4" />
          {loadingPreference ? 'Saving...' : 'Save preference'}
        </button>
        {preferenceMessage ? <p className="mt-3 text-sm text-moss">{preferenceMessage}</p> : null}
      </form>      ) : (
        <div className="rounded-[1.75rem] border border-white/70 bg-white/[0.85] p-5 shadow-[0_18px_60px_rgba(7,17,31,0.08)] backdrop-blur flex flex-col justify-center items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-moss mb-2">Meal choice</p>
          <h3 className="mt-1 text-xl font-semibold text-ink">Set your menu preference</h3>
          <p className="mt-4 text-lg font-medium text-gray-500">Not required right now.</p>
          <p className="text-sm text-gray-400 mt-2">Preferences are collected once a month on dates set by the admin.</p>
        </div>
      )}
      <form onSubmit={handleRatingSubmit} className="rounded-[1.75rem] border border-white/70 bg-ink p-5 text-paper shadow-glow">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sand/80">Feedback loop</p>
            <h3 className="mt-1 text-xl font-semibold">Rate a dish in seconds</h3>
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sand">1 to 5 stars</div>
        </div>

        <div className="space-y-3">
          <input
            value={ratingState.studentName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setRatingState((current) => ({ ...current, studentName: event.target.value }))}
            placeholder="Student name"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-sand"
          />
          <select
            value={ratingState.menuItemId}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => setRatingState((current) => ({ ...current, menuItemId: Number(event.target.value) }))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-sand"
          >
            {menuItems.map((item) => (
              <option key={item.id} value={item.id} className="text-ink">
                {item.title} - {item.mealSlot}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-5 gap-2">
            {ratingOptions.map((stars) => (
              <button
                key={stars}
                type="button"
                onClick={() => setRatingState((current) => ({ ...current, stars }))}
                className={`flex items-center justify-center rounded-2xl border px-0 py-3 text-sm font-semibold transition ${
                  ratingState.stars === stars
                    ? 'border-sand bg-white text-ink'
                    : 'border-white/10 bg-white/5 text-sand hover:bg-white/10'
                }`}
              >
                <Star className="mr-1 h-4 w-4 fill-current" />
                {stars}
              </button>
            ))}
          </div>
          <textarea
            value={ratingState.feedback}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setRatingState((current) => ({ ...current, feedback: event.target.value }))}
            placeholder="What should change? What worked?"
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-sand"
          />
        </div>

        <button
          type="submit"
          disabled={loadingRating}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-flame px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#fb6a19] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send className="h-4 w-4" />
          {loadingRating ? 'Submitting...' : 'Send feedback'}
        </button>
        {ratingMessage ? <p className="mt-3 text-sm text-sand">{ratingMessage}</p> : null}
      </form>
      </>
      )}
    </div>
  );
}
