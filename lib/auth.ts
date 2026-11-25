export type User = {
  id: string;
  email: string;
  profile: { firstName: string; lastName: string };
  walletBalanceKobo: number;
  settings: {
    targetSavingsPercentage: number;
    monthlyIncomeKobo: number;
    currency: string;
  };
  status: string;
  createdAt: string;
};

export type Session = {
  user: User;
  tokens: { accessToken: string; refreshToken: string };
};

export type LoginResponse = { success: boolean; message: string; data: Session };

const KEY = "savewise.session";

export function saveSession(session: Session) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}