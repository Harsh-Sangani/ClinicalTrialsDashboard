// Thin fetch wrapper around the Express API.
// In dev, VITE_API_URL is empty and requests hit "/api/*", which Vite proxies
// to the local server (see vite.config.ts). In production, set VITE_API_URL to
// the deployed API origin (e.g. https://ctd-api.onrender.com).
const BASE_URL = import.meta.env.VITE_API_URL ?? "";

type ApiFetchOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = (await response.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // response body was not JSON; keep the status-based message
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
