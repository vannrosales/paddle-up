"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithMagicLink, signInWithGoogle } from "@/lib/auth/auth-service";
import { Mail, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await signInWithMagicLink(email);
      setMessage(res.message);
      if (res.message.includes("Demo login")) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send magic link";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    document.cookie = `paddleup_demo_user=${encodeURIComponent(demoEmail)}; path=/; max-age=604800; SameSite=Lax`;
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[32px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-8 sm:p-10 shadow-lg relative">
        <div className="text-center mb-8">
          <div className="inline-block relative w-12 h-12 rounded-2xl overflow-hidden mb-3 shadow-xs">
            <Image
              src="/brand/mark.svg"
              alt="PaddleUp"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Welcome to PaddleUp
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Sign in to manage your pickleball profile, roles, and achievements.
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#C8F31D] text-[#1C2A00] font-bold text-sm hover:bg-[#b8e214] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            <span>{loading ? "Sending link..." : "Send Magic Link"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
            or continue with
          </span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <button
          type="button"
          onClick={() => signInWithGoogle()}
          className="w-full py-3 px-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs hover:bg-neutral-50 dark:hover:bg-neutral-700 active:scale-98 transition-all flex items-center justify-center gap-2.5 shadow-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Demo Fast Login Switcher */}
        <div className="mt-8 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-lime-600 dark:text-[#C8F31D]" />
            <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
              Quick Test As Existing Player
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("marias@paddleup.test")}
              className="py-1.5 px-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-left hover:border-lime-500 transition-colors"
            >
              <div className="text-xs font-bold text-neutral-900 dark:text-white">Maria Santos</div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400">4.0 Dinker</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("junr@paddleup.test")}
              className="py-1.5 px-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-left hover:border-lime-500 transition-colors"
            >
              <div className="text-xs font-bold text-neutral-900 dark:text-white">Jun Reyes</div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400">4.5 Power Hitter</div>
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-600 dark:text-neutral-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/onboarding" className="font-bold text-[#0A84FF] hover:underline">
            Get started
          </Link>
        </p>
      </div>
    </div>
  );
}
