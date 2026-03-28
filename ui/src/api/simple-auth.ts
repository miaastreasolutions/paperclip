export type SimpleAuthSession = {
  session: { id: string; userId: string };
  user: { id: string; email: string | null; name: string | null };
};

async function simpleAuthPost(path: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/simple-auth${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (payload as { error?: string } | null)?.error ?? `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return payload;
}

export const simpleAuthApi = {
  login: async (input: { password: string }): Promise<SimpleAuthSession> => {
    const res = await fetch("/api/simple-auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const payload = await res.json().catch(() => null);
    if (!res.ok) {
      const message =
        (payload as { error?: string } | null)?.error ?? `Request failed: ${res.status}`;
      throw new Error(message);
    }
    return payload as SimpleAuthSession;
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem("paperclip_simple_token");
    await fetch("/api/simple-auth/logout", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    localStorage.removeItem("paperclip_simple_token");
  },

  getSession: async (): Promise<SimpleAuthSession | null> => {
    const token = localStorage.getItem("paperclip_simple_token");
    if (!token) return null;

    const res = await fetch("/api/simple-auth/session", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      localStorage.removeItem("paperclip_simple_token");
      return null;
    }
    const payload = await res.json().catch(() => null);
    if (!res.ok) {
      localStorage.removeItem("paperclip_simple_token");
      return null;
    }
    return payload as SimpleAuthSession;
  },
};
