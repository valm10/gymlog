import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

function assertEnv() {
  if (!url || !anon) {
    throw new Error(
      "Supabase env missing. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env and restart Expo."
    );
  }
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) {
    throw new Error(`Invalid Supabase URL: ${url}`);
  }
}
assertEnv();

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(url!, anon!, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: { "X-Client-Info": "gymlog-rn" },
    fetch: (input, init) => {
      // add a 10s timeout to fail fast on network/DNS issues
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);
      return fetch(input as any, {
        ...(init || {}),
        signal: controller.signal,
      }).finally(() => clearTimeout(id));
    },
  },
});
