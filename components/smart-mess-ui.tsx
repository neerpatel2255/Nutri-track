'use client';
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Circle,
  Clock3,
  Flame,
  LockKeyhole,
  LogOut,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  User
} from 'lucide-react';

import { InteractivePanels } from './interactive-panels';
import { StudentProfile } from './student-profile';

type MealSlot = 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER';

const mealOrder: MealSlot[] = ['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'];
const slotLabel: Record<MealSlot, string> = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  SNACKS: 'Snacks',
  DINNER: 'Dinner'
};

export function SmartMessUI({ initialData }: { initialData: any }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginMode, setLoginMode] = useState<'student' | 'admin'>('student');
  const [regNumber, setRegNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [user, setUser] = useState<any>(null);

  const recommendations = useMemo(() => initialData.menuItems ?? [], [initialData.menuItems]);
  const groupedMeals = useMemo(() => {
    const grouped: Record<MealSlot, any[]> = {
      BREAKFAST: [],
      LUNCH: [],
      SNACKS: [],
      DINNER: []
    };

    recommendations.forEach((item: any) => {
      const slot = item.mealSlot as MealSlot;
      if (grouped[slot]) {
        grouped[slot].push(item);
      }
    });

    return grouped;
  }, [recommendations]);

  const toggleTheme = () => {
    setIsDarkMode((current) => {
      const next = !current;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const toggleItem = (id: number) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = recommendations.length > 0 && recommendations.every((item: any) => checkedItems[item.id]);
  const completedCount = recommendations.filter((item: any) => checkedItems[item.id]).length;
  const completionPct = recommendations.length === 0 ? 0 : Math.round((completedCount / recommendations.length) * 100);
  const streak = 5 + (allChecked ? 1 : 0);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      if (loginMode === 'admin') {
        if (regNumber === 'admin' && password === 'admin123') {
          setIsLoggedIn(true);
          setIsAdmin(true);
        } else {
          setLoginError('Invalid admin credentials. Use admin / admin123');
        }
      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registrationNumber: regNumber, password })
        });
        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setIsLoggedIn(true);
          setIsAdmin(false);
        } else {
          setLoginError(data.error || 'Failed to login');
        }
      }
    } catch {
      setLoginError('An error occurred during login');
    } finally {
      setLoginLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen overflow-hidden p-4 md:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald-400/25 blur-3xl" />
          <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>

        <div className="absolute right-6 top-6 z-10 rounded-xl border border-white/30 bg-white/70 p-1 backdrop-blur dark:border-gray-700 dark:bg-gray-800/80">
          <button onClick={toggleTheme} className="rounded-lg p-2 text-gray-700 transition hover:bg-black/5 dark:text-yellow-300 dark:hover:bg-white/10">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        <div className="relative z-10 mx-auto mt-6 w-full max-w-5xl rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_20px_80px_rgba(3,12,23,0.12)] backdrop-blur dark:border-gray-700/60 dark:bg-gray-900/75 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" /> Hackathon Ready
              </p>
              <h1 className="text-4xl font-extrabold leading-tight text-gray-900 dark:text-white md:text-5xl">
                NutriTrack
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 md:text-base">
                Smart student nutrition platform with goal tracking, mess feedback intelligence, and admin decision insights.
              </p>
            </div>

            <form onSubmit={handleLogin} className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800/80">
              <div className="mb-4 flex rounded-xl bg-gray-100 p-1 dark:bg-gray-900">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('student');
                    setLoginError('');
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    loginMode === 'student' ? 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <span className="inline-flex items-center gap-2"><User className="h-4 w-4" />Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('admin');
                    setLoginError('');
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    loginMode === 'admin' ? 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Admin</span>
                </button>
              </div>

              <div className="space-y-3">
                <input
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder={loginMode === 'admin' ? 'Admin ID (admin)' : 'Registration Number'}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={loginMode === 'admin' ? 'Password (admin123)' : 'Password'}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              {loginError ? <p className="mt-3 text-sm text-red-500">{loginError}</p> : null}

              <button
                type="submit"
                disabled={loginLoading}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-70"
              >
                <LockKeyhole className="h-4 w-4" />
                {loginLoading ? 'Signing in...' : 'Login Securely'}
              </button>

              {loginMode === 'student' ? (
                <div className="mt-5 border-t border-gray-200 pt-5 dark:border-gray-700">
                  <p className="mb-2 text-center text-xs text-gray-500 dark:text-gray-400">New student? Create account first.</p>
                  <InteractivePanels menuItems={[]} isSetupOnly={true} />
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-gray-700/60 dark:bg-gray-900/75">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white md:text-3xl">
                {isAdmin ? 'NutriTrack Admin Console' : 'NutriTrack Student Dashboard'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isAdmin ? 'Monitor performance, feedback, and preference cycles.' : 'Daily action plan with nutrition-driven meal decisions.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {isAdmin ? 'Admin Session' : user?.registrationNumber}
              </span>
              <button onClick={toggleTheme} className="rounded-lg bg-gray-100 p-2 text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setRegNumber('');
                  setPassword('');
                }}
                className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {isAdmin ? (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Preferences" value={initialData.stats.totalPreferences} tone="emerald" />
            <MetricCard label="Avg Rating" value={`${initialData.stats.averageRating} / 5`} tone="cyan" />
            <MetricCard label="Feast vs Regular" value={`${initialData.stats.feastCount} / ${initialData.stats.regularCount}`} tone="orange" />
            <MetricCard label="Waste Risk" value={initialData.stats.wasteRisk} tone="rose" />
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            {!isAdmin ? (
              <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-lg">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Performance</p>
                    <h2 className="mt-2 inline-flex items-center gap-2 text-xl font-bold">
                      <Target className="h-5 w-5 text-emerald-400" />
                      {user?.currentGoal || 'Balanced Diet'}
                    </h2>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur">{streak} Day</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span className="inline-flex items-center gap-1"><Activity className="h-4 w-4 text-emerald-400" /> Completion</span>
                    <span>{completionPct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/15">
                    <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300" style={{ width: `${completionPct}%` }} />
                  </div>
                  <div className="pt-2 text-sm text-gray-300">
                    Target Calories: <span className="font-semibold text-white">{user?.dailyCalorieTarget || 2000} kcal</span>
                  </div>
                </div>
              </section>
            ) : null}

            <section className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today's Menu</h3>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">Live</span>
              </div>
              <div className="custom-scrollbar max-h-[460px] space-y-4 overflow-y-auto pr-2">
                {mealOrder.map((slot) => (
                  <div key={slot}>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">{slotLabel[slot]}</p>
                    <div className="space-y-2">
                      {(groupedMeals[slot] || []).map((item: any) => (
                        <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</p>
                        </div>
                      ))}
                      {groupedMeals[slot].length === 0 ? <p className="text-xs text-gray-400">No item scheduled.</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-8">
            <section className="rounded-2xl border border-white/60 bg-white/85 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Action Plan & Nutrition</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tap each meal item as completed to track your daily discipline.</p>
                </div>
                {!isAdmin ? (
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${allChecked ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>
                    {allChecked ? 'Perfect Day' : 'In Progress'}
                  </span>
                ) : null}
              </div>

              <div className="custom-scrollbar max-h-[620px] space-y-5 overflow-y-auto pr-2">
                {mealOrder.map((slot) => (
                  <div key={slot} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-700 dark:bg-gray-800/70">
                    <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-gray-700 dark:text-gray-200">
                      <Clock3 className="h-4 w-4 text-emerald-500" />
                      {slotLabel[slot]}
                    </h3>

                    <div className="space-y-3">
                      {(groupedMeals[slot] || []).map((rec: any) => {
                        const isChecked = checkedItems[rec.id];
                        return (
                          <div
                            key={rec.id}
                            onClick={() => {
                              if (!isAdmin) {
                                toggleItem(rec.id);
                              }
                            }}
                            className={`rounded-xl border-2 p-4 transition ${
                              isAdmin ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              !isAdmin && isChecked
                                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
                                : 'border-gray-100 bg-white hover:border-emerald-200 dark:border-gray-700 dark:bg-gray-800'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {!isAdmin ? (
                                isChecked ? <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-500" /> : <Circle className="mt-0.5 h-6 w-6 text-gray-300 dark:text-gray-500" />
                              ) : null}

                              <div className="flex-1">
                                <div className="mb-2 flex items-start justify-between gap-3">
                                  <p className={`font-semibold ${!isAdmin && isChecked ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>{rec.title}</p>
                                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                    {rec.mealSlot}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                  <span className="rounded bg-orange-50 px-2 py-1 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">{rec.calories} kcal</span>
                                  <span className="rounded bg-cyan-50 px-2 py-1 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">{rec.protein}g protein</span>
                                  <span className="rounded bg-blue-50 px-2 py-1 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">{rec.carbs}g carbs</span>
                                  <span className="rounded bg-amber-50 px-2 py-1 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">{rec.fats}g fats</span>
                                  <span className="rounded bg-gray-100 px-2 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">⭐ {rec.averageRating || 'N/A'} ({rec.feedbackCount})</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {groupedMeals[slot].length === 0 ? <p className="text-sm text-gray-400">No recommendation available for this slot.</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {!isAdmin ? (
          <div className="mt-8 border-t border-gray-200/80 pt-8 dark:border-gray-800" id="feedback">
            <h2 className="mb-6 text-center text-2xl font-extrabold text-gray-900 dark:text-white">Profile & Feedback Workspace</h2>
            <div className="grid gap-8 lg:grid-cols-2">
              <StudentProfile user={user} onUpdate={(updatedStudent) => setUser({ ...user, ...updatedStudent })} />
              <InteractivePanels menuItems={initialData.menuItems} isDashboardOnly={true} isPreferenceOpen={initialData.adminSettings.isPreferenceOpen} />
            </div>
          </div>
        ) : (
          <div className="mt-8 border-t border-gray-200/80 pt-8 dark:border-gray-800" id="admin-feedback">
            <h2 className="mb-6 text-center text-2xl font-extrabold text-gray-900 dark:text-white">Student Feedback Intelligence</h2>
            <div className="space-y-5">
              {initialData.menuItems
                .filter((item: any) => item.feedbackCount > 0)
                .map((item: any) => (
                  <div key={item.id} className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Avg {item.averageRating} ★</span>
                    </div>
                    <div className="space-y-3">
                      {item.ratings.map((rating: any, index: number) => (
                        <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{rating.studentName || 'Student'}</span>
                            <span className="text-amber-500">{rating.stars} ★</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{rating.feedback || 'No written feedback'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

              {initialData.menuItems.filter((item: any) => item.feedbackCount > 0).length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  No feedback submitted yet.
                </div>
              ) : null}
            </div>
          </div>
        )}

        {!isAdmin ? (
          <div className="mt-8 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 text-center dark:border-emerald-900 dark:from-emerald-900/20 dark:to-cyan-900/20">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <Flame className="mr-1 inline h-4 w-4" />
              Hackathon mode active: finish all meals to keep your streak alive.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string | number; tone: 'emerald' | 'cyan' | 'orange' | 'rose' }) {
  const toneClasses: Record<typeof tone, string> = {
    emerald: 'from-emerald-500/15 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-900/20 text-emerald-700 dark:text-emerald-300',
    cyan: 'from-cyan-500/15 to-cyan-100 dark:from-cyan-900/40 dark:to-cyan-900/20 text-cyan-700 dark:text-cyan-300',
    orange: 'from-orange-500/15 to-orange-100 dark:from-orange-900/40 dark:to-orange-900/20 text-orange-700 dark:text-orange-300',
    rose: 'from-rose-500/15 to-rose-100 dark:from-rose-900/40 dark:to-rose-900/20 text-rose-700 dark:text-rose-300'
  };

  return (
    <div className={`rounded-2xl border border-white/70 bg-gradient-to-br p-5 shadow-sm dark:border-gray-700 ${toneClasses[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-[0.15em]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </div>
  );
}
