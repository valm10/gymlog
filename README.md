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

Create a `.env` file at the project root (Expo reads `EXPO_PUBLIC_*` at build time):

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

---

## Quickstart

**Prereqs:** Node 18+, npm, Expo Go (phone) or iOS/Android emulator.

```bash
npm install
cp .env.example .env
npm run start      # QR code for Expo Go
npm run ios        # iOS simulator (macOS)
npm run android    # Android emulator/device
npm run web        # Web preview (limited)
```

---

## Contact

<p align="center">
  <a href="https://www.linkedin.com/in/vitor-lopes-medeiros">LinkedIn</a> •
  <a href="mailto:vitorlopesmed@gmail.com">Email</a> •
  <a href="https://github.com/valm10">GitHub</a>
</p>

---
