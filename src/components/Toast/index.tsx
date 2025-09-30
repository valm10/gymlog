import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type ToastItem = {
  id: string;
  text: string;
  actionText?: string;
  onAction?: () => void;
  durationMs?: number;
};

type ToastContextValue = {
  show: (
    text: string,
    opts?: { actionText?: string; onAction?: () => void; durationMs?: number }
  ) => string;
  dismiss: (id: string) => void;
};

const ToastCtx = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: React.PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, any>());

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const tm = timers.current.get(id);
    if (tm) clearTimeout(tm);
    timers.current.delete(id);
  }, []);

  const show = useCallback<ToastContextValue["show"]>(
    (text, opts) => {
      const id = Math.random().toString(36).slice(2);
      const item: ToastItem = {
        id,
        text,
        actionText: opts?.actionText,
        onAction: opts?.onAction,
        durationMs: opts?.durationMs ?? 4000,
      };
      setToasts((prev) => [...prev, item]);
      const tm = setTimeout(() => dismiss(id), item.durationMs);
      timers.current.set(id, tm);
      return id;
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({ show, dismiss }),
    [show, dismiss]
  );

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <View pointerEvents="box-none" style={styles.wrap}>
        {toasts.map((t) => (
          <View
            key={t.id}
            style={styles.toast}
            accessible
            accessibilityLiveRegion="polite"
          >
            <Text style={styles.text}>{t.text}</Text>
            {t.actionText ? (
              <Pressable
                onPress={() => {
                  dismiss(t.id);
                  t.onAction?.();
                }}
                accessibilityRole="button"
                accessibilityLabel={t.actionText}
                hitSlop={8}
              >
                <Text style={styles.action}>{t.actionText}</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider/>");
  return ctx;
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  toast: {
    maxWidth: "92%",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(28,28,30,0.94)",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 8,
  },
  text: { color: "#fff", fontWeight: "600" },
  action: { color: "#FFD28A", fontWeight: "700" },
});
