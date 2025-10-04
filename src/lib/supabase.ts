import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

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
  async getItem(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      if (__DEV__) {
        console.warn(
          "[SecureStore.getItemAsync] ignored:",
          (e as Error)?.message
        );
      }
      return null;
    }
  },
  async setItem(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(
        key,
        value,
        Platform.OS === "ios"
          ? { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK }
          : undefined
      );
    } catch (e) {
      if (__DEV__)
        console.warn(
          "[SecureStore.setItemAsync] ignored:",
          (e as Error)?.message
        );
    }
  },
  async removeItem(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      if (__DEV__)
        console.warn(
          "[SecureStore.deleteItemAsync] ignored:",
          (e as Error)?.message
        );
    }
  },
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
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);
      return fetch(input as any, {
        ...(init || {}),
        signal: controller.signal,
      }).finally(() => clearTimeout(id));
    },
  },
});
