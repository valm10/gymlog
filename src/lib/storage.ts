// Minimal wrapper so the app won’t crash if the module is missing during dev.
type StorageLike = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

let AsyncStorageSafe: StorageLike;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AsyncStorageSafe =
    require("@react-native-async-storage/async-storage").default;
} catch {
  const mem = new Map<string, string>();
  AsyncStorageSafe = {
    async getItem(k) {
      return mem.has(k) ? mem.get(k)! : null;
    },
    async setItem(k, v) {
      mem.set(k, v);
    },
    async removeItem(k) {
      mem.delete(k);
    },
  };
}

export default AsyncStorageSafe as StorageLike;
