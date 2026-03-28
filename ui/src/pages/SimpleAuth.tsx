import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { queryKeys } from "@/lib/queryKeys";

export function SimpleAuthPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const nextPath = searchParams.get("next") || "/";

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/simple-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }
      
      return res.json();
    },
    onSuccess: async (data) => {
      setError(null);
      // Store session token
      localStorage.setItem("paperclip_simple_token", data.session.id);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
      await queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      navigate(nextPath, { replace: true });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Authentication failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the password");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 flex bg-background">
      {/* Left half — form */}
      <div className="w-full md:w-1/2 flex flex-col overflow-y-auto">
        <div className="w-full max-w-md mx-auto my-auto px-8 py-12">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Paperclip</span>
          </div>

          <h1 className="text-xl font-semibold">Enter Password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the admin password to access this Paperclip instance.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="password" className="text-xs text-muted-foreground mb-1 block">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                placeholder="Enter admin password"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Verifying..." : "Access"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right half — decorative */}
      <div className="hidden md:flex md:w-1/2 bg-muted/30 items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <p className="text-sm text-muted-foreground">Secure access</p>
        </div>
      </div>
    </div>
  );
}
