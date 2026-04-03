'use client';
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react';
import { Target, Flame, Clock, ChevronRight, CheckCircle2, Circle, Moon, Sun, LockKeyhole, User, ShieldCheck, LogOut } from 'lucide-react';
import { InteractivePanels } from './interactive-panels';
import { StudentProfile } from './student-profile';

export function SmartMessUI({ initialData }: { initialData: any }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuTab, setMenuTab] = useState<'today' | 'weekly'>('today');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginMode, setLoginMode] = useState<'student' | 'admin'>('student');
  const [regNumber, setRegNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [user, setUser] = useState<any>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleItem = (id: number) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (err) {
      setLoginError('An error occurred during login');
    } finally {
      setLoginLoading(false);
    }
  };

  if (!isLoggedIn) {
     return (
       <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 font-sans ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
         
         <div className="absolute top-4 right-4 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
            <button onClick={toggleTheme} className="p-2 rounded-md transition-all bg-white shadow text-gray-800 dark:bg-gray-700 dark:shadow-none dark:text-yellow-400">
              {isDarkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
         </div>

         <div className={`w-full max-w-lg p-8 rounded-[1.75rem] shadow-[0_18px_60px_rgba(7,17,31,0.08)] border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-white/70'}`}>
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">NutriTrack</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Login to access your menu, nutrition insights & feedback loop.</p>
            </div>

            <div className={`flex p-1 rounded-xl mb-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
              <button 
                type="button"
                onClick={() => { setLoginMode('student'); setLoginError(''); }}
                className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${loginMode === 'student' ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-white shadow text-gray-900') : 'text-gray-500'}`}
              >
                <User className="w-4 h-4" /> Student
              </button>
              <button 
                type="button"
                onClick={() => { setLoginMode('admin'); setLoginError(''); }}
                className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${loginMode === 'admin' ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-white shadow text-gray-900') : 'text-gray-500'}`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder={loginMode === 'admin' ? 'Admin ID (try admin)' : 'Registration Number'}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>
              <div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={loginMode === 'admin' ? 'Password (try admin123)' : 'Password'}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>

              {loginError && <p className="text-sm text-red-500 text-center">{loginError}</p>}

              <button
                type="submit"
                disabled={loginLoading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-70"
              >
                <LockKeyhole className="w-4 h-4" />
                {loginLoading ? 'Signing in...' : 'Sign in to NutriTrack'}
              </button>
            </form>

            {loginMode === 'student' && (
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center flex flex-col items-center">
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">First time here? Scroll to create an account.</p>
                 <InteractivePanels menuItems={[]} isSetupOnly={true} />
              </div>
            )}
         </div>
       </div>
     );
  }

  const recommendations = initialData.menuItems;
  const allChecked = recommendations.length > 0 && recommendations.every((item: any) => checkedItems[item.id]);
  const streak = 5 + (allChecked ? 1 : 0);

  return (
    <div className={`min-h-screen font-sans p-4 md:p-8 transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between p-4 shadow-sm rounded-xl mb-6 transition-colors bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              NutriTrack {isAdmin ? 'Admin' : 'Dashboard'}
            </h1>
            {!isAdmin && (
              <div className="hidden lg:flex space-x-2 ml-6 border-l pl-6 border-gray-200 dark:border-gray-700">
                <button onClick={() => window.scrollTo(0,0)} className="px-4 py-1.5 rounded-full font-medium text-sm transition-colors bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">Home</button>
                <a href="#feedback" className="px-4 py-1.5 rounded-full font-medium text-sm transition-colors text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">Rate / Feedback</a>
                <a href="#preference" className="px-4 py-1.5 rounded-full font-medium text-sm transition-colors text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">Preference</a>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm font-medium px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700">
              {isAdmin ? 'Admin Session' : user?.registrationNumber}
            </div>
            <div className="flex items-center space-x-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-md transition-all bg-white shadow text-gray-800 dark:bg-gray-600 dark:shadow-none dark:text-yellow-400" 
              >
                {isDarkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
            </div>
            <button 
              onClick={() => { setIsLoggedIn(false); setRegNumber(''); setPassword(''); }}
              className="p-2.5 rounded-lg transition-all bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
              title="Logout"
            >
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {isAdmin ? (            <>
            <div className="flex justify-end w-full mb-6">
              <button 
                onClick={async () => {
                  const newState = !initialData.adminSettings.isPreferenceOpen;
                  await fetch('/api/admin/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isPreferenceOpen: newState })
                  });
                  window.location.reload();
                }}
                className={`px-4 py-2 font-semibold text-sm rounded-xl transition ${initialData.adminSettings.isPreferenceOpen ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'}`}
              >
                {initialData.adminSettings.isPreferenceOpen ? 'Close Preference Window' : 'Open Preference Window'}
              </button>
            </div>          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Total Preferences Logs</h3>
              <p className="text-3xl font-bold mt-2">{initialData.stats.totalPreferences}</p>
            </div>
            <div className="rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Average Rating</h3>
              <p className="text-3xl font-bold mt-2 text-emerald-500">{initialData.stats.averageRating} / 5</p>
            </div>
            <div className="rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Feast vs Regular</h3>
              <p className="text-3xl font-bold mt-2">{initialData.stats.feastCount} / {initialData.stats.regularCount}</p>
            </div>
            <div className="rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Waste Risk</h3>
              <p className="text-3xl font-bold mt-2 text-orange-500">{initialData.stats.wasteRisk}</p>
            </div>
          </div>
          </>
          ) : null}

          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 h-full transition-all ${isAdmin ? 'min-h-[400px]' : 'min-h-[600px]'}`}>
            <div className="lg:col-span-4 flex flex-col space-y-6">
            {!isAdmin && (
              <div className="h-48 shrink-0">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden h-full flex flex-col justify-center">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-500 rounded-full opacity-20 blur-2xl"></div>
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Goal Tracker</p>
                      <h2 className="text-xl font-bold flex items-center">
                        <Target className="mr-2 text-emerald-400 w-5 h-5" /> {user?.currentGoal || 'Balanced Diet'}
                      </h2>
                    </div>
                    <div className="bg-white/10 px-3 py-1.5 rounded-full flex items-center backdrop-blur-sm">
                      <Flame className={`mr-1.5 w-4 h-4 ${allChecked ? 'text-orange-400 animate-pulse' : 'text-gray-400'}`} />
                      <span className="font-bold">{streak} Day</span>
                    </div>
                  </div>

                  <div className="relative z-10 mt-auto flex justify-between items-end">
                     <div>
                       <span className="text-xs text-gray-400">Target Calories</span>
                       <p className="text-lg font-semibold">{user?.dailyCalorieTarget || 2000} kcal</p>
                     </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-hidden" style={{ minHeight: '300px' }}>
              <div className="rounded-2xl p-6 shadow-sm border h-full flex flex-col transition-colors bg-white border-gray-100 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <div className="flex p-1 rounded-xl mb-6 bg-gray-100 dark:bg-gray-900">
                  <button 
                    onClick={() => setMenuTab('today')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${menuTab === 'today' ? 'bg-white shadow-sm text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                  >
                    Today's Menu
                  </button>
                  <button 
                    disabled
                    className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all text-gray-500 opacity-50 cursor-not-allowed dark:text-gray-400"
                  >
                    Weekly Plan
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-4">
                    {initialData.menuItems.map((item: any) => (
                      <div key={item.id} className="flex items-center p-3 rounded-xl border transition-colors border-gray-50 bg-gray-50/50 hover:bg-emerald-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-emerald-900/20">
                        <div className="p-2 rounded-lg mr-4 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                          <Clock className="w-[18px] h-[18px]" />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">{item.mealSlot}</p>
                          <p className="font-medium text-gray-900 dark:text-gray-200">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-8 h-full">
            <div className="rounded-2xl p-6 shadow-sm border h-full flex flex-col relative overflow-hidden transition-colors bg-white border-emerald-100 dark:bg-gray-800 dark:border-emerald-900">
              {!isAdmin && allChecked && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>}
              
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Action Plan & Nutrition</h2>
                  <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                    {isAdmin ? 'Overview of today&apos;s offerings' : 'Track and consume these meals to hit your goals today.'}
                  </p>
                </div>
                {!isAdmin && (
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-medium uppercase mb-1 text-gray-400 dark:text-gray-500">Status</p>
                    <div>
                      {allChecked ? (
                        <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Perfect Day
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {recommendations.map((rec: any) => {
                  const isChecked = checkedItems[rec.id];
                  return (
                    <div key={rec.id} onClick={() => { if(!isAdmin) toggleItem(rec.id) }} className={`p-4 rounded-xl border-2 transition-all ${isAdmin ? 'cursor-default border-gray-100 dark:border-gray-700' : 'cursor-pointer'} flex items-center group ${!isAdmin && isChecked ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/20 hover:shadow-md' : 'border-gray-100 bg-white hover:border-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald-800 hover:shadow-md'}`}>
                      {!isAdmin && (
                        <div className="mr-4">
                          {isChecked ? (
                            <CheckCircle2 className="text-emerald-500 w-8 h-8 transition-transform transform scale-110" />
                          ) : (
                            <Circle className="w-8 h-8 transition-colors text-gray-300 group-hover:text-emerald-200 dark:text-gray-600 dark:group-hover:text-emerald-700" />
                          )}
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <p className={`font-semibold text-lg transition-colors ${!isAdmin && isChecked ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-gray-200'}`}>
                            {rec.title}
                          </p>
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            {rec.mealSlot}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-xs px-2 py-1 rounded font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            ⭐ {rec.averageRating || 'N/A'} ({rec.feedbackCount})
                          </span>
                          <span className="text-xs px-2 py-1 rounded font-medium bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400">
                            {rec.calories} kcal
                          </span>
                          <span className="text-xs px-2 py-1 rounded font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                            {rec.protein}g Protein
                          </span>
                          <span className="text-xs px-2 py-1 rounded font-medium bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400">
                            {rec.fats}g Fat
                          </span>
                          <span className="text-xs px-2 py-1 rounded font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400">
                            {rec.carbs}g Carbs
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {!isAdmin && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8" id="feedback">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-6 text-center">Your Profile & Feedback</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
                 <div>
                    <StudentProfile user={user} onUpdate={(updatedStudent) => setUser({ ...user, ...updatedStudent })} />
                 </div>
                 <div>
                    <InteractivePanels menuItems={initialData.menuItems} isDashboardOnly={true} isPreferenceOpen={initialData.adminSettings.isPreferenceOpen} />        
                 </div>
              </div>
          </div>
        )}

        {isAdmin && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8" id="admin-feedback">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-6 text-center">Student Feedback</h2>
              <div className="w-full max-w-4xl mx-auto space-y-6">
                 {initialData.menuItems.filter((item: any) => item.feedbackCount > 0).map((item: any) => (
                   <div key={item.id} className="rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">{item.title} ({item.mealSlot})</h3>
                        <span className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm font-bold">Avg Rating: {item.averageRating} ★</span>
                      </div>
                      <div className="space-y-4">
                        {item.ratings.map((rating: any, index: number) => (
                          <div key={index} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                             <div className="flex justify-between mb-2">
                               <span className="text-sm font-semibold">{rating.studentName || 'Student'}</span>
                               <span className="text-sm text-yellow-500">{rating.stars} ★</span>
                             </div>
                             <p className="text-sm text-gray-600 dark:text-gray-400">{rating.feedback || 'No written feedback'}</p>
                          </div>
                        ))}
                      </div>
                   </div>
                 ))}
                 {initialData.menuItems.filter((item: any) => item.feedbackCount > 0).length === 0 && (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">No feedback submitted yet.</div>
                 )}
              </div>
          </div>
        )}

      </div>
    </div>
  );
}