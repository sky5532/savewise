import { clearSession, getSession, saveSession } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export type FieldError = { field: string; message: string };

export class ApiError extends Error {
  status: number;
  errors: FieldError[];

  constructor(status: number, message: string, errors: FieldError[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {}
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      0,
      "Can’t reach the server. Check your connection and try again."
    );
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.message ?? "Something went wrong. Please try again.",
      data?.errors ?? []
    );
  }
  return data as T;
}

// For protected endpoints: adds the token, and if it has expired (401),
// refreshes it once and retries the original request.
export async function authedRequest<T>(
  path: string,
  options: Omit<RequestOptions, "token"> = {}
): Promise<T> {
  const session = getSession();
  if (!session) throw new ApiError(401, "Please log in again.");

  try {
    return await apiRequest<T>(path, {
      ...options,
      token: session.tokens.accessToken,
    });
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 401) throw err;
  }

  try {
    const r = await apiRequest<{ data: { accessToken: string } }>(
      "/api/v1/auth/refresh-token",
      { method: "POST", body: { refreshToken: session.tokens.refreshToken } }
    );
    session.tokens.accessToken = r.data.accessToken;
    saveSession(session);
  } catch {
    clearSession();
    window.location.href = "/login";
    throw new ApiError(401, "Your session expired. Please log in again.");
  }

  return apiRequest<T>(path, { ...options, token: session.tokens.accessToken });
}