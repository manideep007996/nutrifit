// Thin localStorage wrapper. This is the ONLY file that touches localStorage,
// so swapping to a backend later means replacing the service functions that
// call it — pages and components never read storage directly.

const PREFIX = 'nutrifit:';

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (err) {
      console.warn('Storage write failed', err);
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
  },
};

/** Simulates network latency so the UI already handles async/loading states */
export const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const uid = () =>
  (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`);
