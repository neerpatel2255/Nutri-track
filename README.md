# Smart Mess Menu (NutriTrack)

A full-stack hackathon app for hostel mess operations with an interactive daily menu dashboard, nutrition data, student feedback, meal preferences, and admin insights.

## Features Added

*   **Student Dashboard**: Secure registration and login for students.
*   **Biometric Profile & Goal Tracker**: Set your height, weight, age, activity level, and fitness goal (Weight Loss, Maintain, Weight Gain). The app actively calculates and updates your daily Calorie target automatically.
*   **Admin Dashboard**: Dedicated `admin` login to track real-time preferences, average meal ratings, read student feedback securely, and manage the system.
*   **Admin Control**: Admins can open and close the Preference Collection window, so students are only asked when necessary.
*   **Meal Recommendations**: The main dashboard shows today's action plan for caloric intake with an interactive list.

## Tech Stack
- Next.js (App Router)
- React 19
- Prisma + SQLite Database
- Tailwind CSS

## How to Run

1.  **Dependencies**: `npm install`
2.  **Database & Seed**: `npm run db:push` then `npm run db:seed`
3.  **Boot Up**: `npm run dev`

Navigate to `http://localhost:3000` (or `http://localhost:3001` if port 3000 is busy).

*   **Testing as Admin:**
    *   **Login**: `admin`
    *   **Password**: `admin123`
*   **Testing as Student:**
    *   Sign Up directly on the main screen, then use the created credential to explore your dashboard.
