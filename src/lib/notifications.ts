import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

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

export async function ensureNotificationSetup() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF6A00",
    });
  }
}

export async function scheduleRestIn(seconds: number) {
  if (seconds <= 0) return null;
  return Notifications.scheduleNotificationAsync({
    content: { title: "Rest is over", body: "Time to lift." },
    trigger: { seconds, channelId: "default" },
  });
}

export async function cancelNotification(id: string | null) {
  if (!id) return;
  await Notifications.cancelScheduledNotificationAsync(id);
}
