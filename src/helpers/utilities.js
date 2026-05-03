// Utility functions for safe JSON parsing and other common tasks 

// Added safeParseJSON as a general-purpose utility for safely parsing JSON with a fallback value, to prevent crashes from malformed data. This is used across the app wherever we read from localStorage or any external source that may not be well-formed.
export function safeParseJSON(raw, fallback = null) {
  try {
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// Added safeParseSession and safeParseEvents to centralize error handling for JSON parsing across the app, especially for localStorage data which may be corrupted or missing. This prevents the app from crashing due to unexpected null values or malformed JSON.
export function safeParseSession(raw) {
  return safeParseJSON(raw, null);
}

// Added a separate safeParseEvents function to handle event logs, which should always return an array (never null)
export function safeParseEvents(raw) {
  const parsed = safeParseJSON(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}
