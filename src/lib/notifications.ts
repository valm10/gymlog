// PATH: src/lib/notifications.ts
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const CHANNEL_ID = "default";

Notifications.setNotificationHandler({
  handleNotification:
    async (): Promise<Notifications.NotificationBehavior> => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
});

export async function ensureNotificationSetup(): Promise<boolean> {
  let perm = await Notifications.getPermissionsAsync();
  if (perm.status !== "granted") {
    perm = await Notifications.requestPermissionsAsync();
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Default",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF6A00",
    });
  }

  const iosOk =
    Platform.OS === "ios" &&
    perm.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

  return perm.status === "granted" || iosOk;
}

export async function scheduleRestIn(seconds: number) {
  const s = Math.floor(seconds);
  if (!Number.isFinite(s) || s < 1) return null;

  const trigger: Notifications.NotificationTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: s,
    ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : null),
  };

  return Notifications.scheduleNotificationAsync({
    content: { title: "Rest is over", body: "Time to lift." },
    trigger,
  });
}

export async function cancelAllScheduled() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}
