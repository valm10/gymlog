# GymLog (React Native + Supabase)

A simple, fast workout log for iOS/Android. Start a workout, add sets (reps × weight), and review your training on a calendar.

> Built with Expo, React Navigation, and Supabase. Focused on clarity, reliability, and small, deliberate code.

---

## Features

- 🗓️ **Calendar view** — marks days you trained; tap any day to review that date.
- ✍️ **Workout log** — choose an exercise, add sets (reps/weight). Groups by exercise.
- 🔁 **Quick add** — duplicate last set for speed.
- ⏱️ **Rest timer** — presets + local notifications.
- 🗑️ **Edit safety** — long-press a set to delete (with confirmation).
- 🔐 **Auth** — sign up / login with Supabase.
- 📱 **Polished UI** — simple cards, consistent theme tokens.

---

## Screenshots

<p align="center">
  <img src="src/assets/Screenshot-home.PNG" alt="Home" width="280" />
  <img src="src/assets/Screenshot-loginput.PNG" alt="Workout Log" width="280" />
  <img src="src/assets/Screenshot-settings.PNG" alt="Settings & Help" width="280" />
</p>

---

## Environment

- Create .env file
  EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY

---

## QuickStart

npm install
cp .env.example .env # fill Supabase URL + anon key
npm run start # or: npm run ios / npm run android

---

## Contact

<p align="center">
  <a href="https://www.linkedin.com/in/vitor-lopes-medeiros">LinkedIn</a> •
  <a href="mailto:vitorlopesmed@gmail.com">Email</a> •
  <a href="https://github.com/valm10">GitHub</a>
</p>

---
